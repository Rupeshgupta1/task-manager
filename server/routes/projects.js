const router = require("express").Router();
const { getProjects, createProject, updateProject, deleteProject } = require("../controllers/projectController");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

router.get("/", auth, getProjects);
router.post("/", auth, admin, createProject);
router.put("/:id", auth, admin, updateProject);
router.delete("/:id", auth, admin, deleteProject);

module.exports = router;
