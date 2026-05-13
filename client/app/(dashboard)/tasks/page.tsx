'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

interface User { _id: string; name: string; }
interface Project { _id: string; title: string; }
interface Task { _id: string; title: string; description: string; status: string; priority: string; assignedTo: User; project: Project; dueDate: string; }

export default function TasksPage() {
  const { user } = useAuthStore();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium', project: '', assignedTo: '', dueDate: '' });

  const fetchAll = async () => {
    try {
      const [t, p] = await Promise.all([api.get('/tasks'), api.get('/projects')]);
      setTasks(t.data.data);
      setProjects(p.data.data);
      if (user?.role === 'admin') {
        const u = await api.get('/users');
        setUsers(u.data.data);
      }
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/tasks', form);
      toast.success('Task created!');
      setForm({ title: '', description: '', priority: 'medium', project: '', assignedTo: '', dueDate: '' });
      setShowForm(false);
      fetchAll();
    } catch { toast.error('Failed to create task'); }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await api.put(`/tasks/${id}`, { status });
      toast.success('Status updated!');
      fetchAll();
    } catch { toast.error('Failed to update'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      toast.success('Task deleted');
      fetchAll();
    } catch { toast.error('Failed to delete'); }
  };

  const statusColor: Record<string, string> = {
    'todo': 'bg-gray-100 text-gray-600',
    'in-progress': 'bg-yellow-100 text-yellow-700',
    'completed': 'bg-green-100 text-green-700'
  };

  const priorityColor: Record<string, string> = {
    'low': 'bg-blue-50 text-blue-600',
    'medium': 'bg-orange-50 text-orange-600',
    'high': 'bg-red-50 text-red-600'
  };

  const overdueCount = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed').length;

  if (loading) return <div className="text-gray-500">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Tasks</h1>
          {overdueCount > 0 && <p className="text-xs text-red-500 mt-0.5">{overdueCount} overdue task(s)</p>}
        </div>
        {user?.role === 'admin' && (
          <button onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
            + New Task
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white border border-gray-200 rounded-xl p-6 mb-6 space-y-4">
          <h2 className="font-medium text-gray-800">Create Task</h2>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Task title" required
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Description" rows={2}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <div className="grid grid-cols-2 gap-4">
            <select value={form.project} onChange={(e) => setForm({ ...form, project: e.target.value })} required
              className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select Project</option>
              {projects.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
            </select>
            <select value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
              className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Assign to...</option>
              {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
            </select>
            <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}
              className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex gap-3">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">Create</button>
            <button type="button" onClick={() => setShowForm(false)} className="text-gray-500 text-sm px-4 py-2">Cancel</button>
          </div>
        </form>
      )}

      {tasks.length === 0 ? (
        <div className="text-center py-16 text-gray-400">No tasks yet.</div>
      ) : (
        <div className="space-y-3">
          {tasks.map(t => (
            <div key={t._id} className="bg-white border border-gray-200 rounded-xl p-5 flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-gray-900">{t.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColor[t.priority]}`}>{t.priority}</span>
                </div>
                <p className="text-sm text-gray-500 mb-2">{t.description}</p>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span>📁 {t.project?.title}</span>
                  {t.assignedTo && <span>👤 {t.assignedTo.name}</span>}
                  {t.dueDate && <span className={new Date(t.dueDate) < new Date() && t.status !== 'completed' ? 'text-red-500' : ''}>📅 {new Date(t.dueDate).toLocaleDateString()}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <select value={t.status} onChange={(e) => handleStatusUpdate(t._id, e.target.value)}
                  className={`text-xs px-2 py-1 rounded-full border-0 font-medium cursor-pointer ${statusColor[t.status]}`}>
                  <option value="todo">Todo</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                {user?.role === 'admin' && (
                  <button onClick={() => handleDelete(t._id)} className="text-xs text-red-400 hover:text-red-600">✕</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}