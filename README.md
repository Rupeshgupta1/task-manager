# Task Manager

A full-stack task management web app where you can organize your work into projects, create tasks, assign them, and track progress — all in one place.

**Live Demo:** [task-manager-psi-eight-71.vercel.app](https://task-manager-psi-eight-71.vercel.app)

---

## What it does

- Create an account and log in securely
- Organize work into separate **Projects**
- Add **Tasks** inside each project with details like title, description, and status
- Manage **team members** and assign tasks to users
- All data is saved in real-time to the cloud

---

## Tech Stack

**Frontend**
- Next.js (React framework)
- Deployed on Vercel

**Backend**
- Node.js + Express REST API
- Deployed on Railway

**Database**
- MongoDB Atlas (cloud database)

**Auth**
- JWT-based authentication

---

## Project Structure

```
task-manager/
├── client/          # Next.js frontend
│   ├── pages/       # App routes
│   ├── components/  # Reusable UI components
│   └── .env.local   # Frontend environment variables
│
└── server/          # Express backend
    ├── routes/      # API route handlers
    ├── models/      # MongoDB schemas
    ├── middleware/  # Auth & error handling
    └── .env         # Backend environment variables
```

---

## Running Locally

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the repo

```bash
git clone https://github.com/Rupeshgupta1/task-manager.git
cd task-manager
```

### 2. Setup Backend

```bash
cd server
npm install
```

Create a `.env` file in the `server/` folder:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

Start the server:

```bash
npm run dev
```

### 3. Setup Frontend

```bash
cd client
npm install
```

Create a `.env.local` file in the `client/` folder:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

App will be running at `http://localhost:3000`

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/login` | Login and get JWT token |
| GET | `/api/projects` | Get all projects |
| POST | `/api/projects` | Create a new project |
| GET | `/api/tasks` | Get all tasks |
| POST | `/api/tasks` | Create a new task |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

---

## Deployment

| Service | Platform | URL |
|---------|----------|-----|
| Frontend | Vercel | [task-manager-psi-eight-71.vercel.app](https://task-manager-psi-eight-71.vercel.app) |
| Backend | Railway | [task-manager-production-471f.up.railway.app](https://task-manager-production-471f.up.railway.app) |

---

## Environment Variables (Production)

**Vercel (Frontend)**
```
NEXT_PUBLIC_API_URL=https://task-manager-production-471f.up.railway.app/api
```

**Railway (Backend)**
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```