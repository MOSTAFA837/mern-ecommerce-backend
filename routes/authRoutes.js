const { admin_login, getUser } = require("../controllers/authControllers");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = require("express").Router();

router.post("/admin-login", admin_login);
router.get("/get-user", authMiddleware, getUser);

module.exports = router;
