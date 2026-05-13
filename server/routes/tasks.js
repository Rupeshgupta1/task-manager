const router = require("express").Router();
const { getTasks, createTask, updateTask, deleteTask } = require("../controllers/taskController");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

router.get("/", auth, getTasks);
router.post("/", auth, admin, createTask);
router.put("/:id", auth, updateTask);
router.delete("/:id", auth, admin, deleteTask);

module.exports = router;
