const router = require("express").Router();
const { getUsers } = require("../controllers/userController");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

router.get("/", auth, admin, getUsers);

module.exports = router;
