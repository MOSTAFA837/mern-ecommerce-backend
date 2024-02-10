const {
  admin_login,
  getUser,
  seller_register,
  seller_login,
} = require("../controllers/authControllers");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = require("express").Router();

router.post("/admin-login", admin_login);
router.get("/get-user", authMiddleware, getUser);

router.post("/seller-register", seller_register);
router.post("/seller-login", seller_login);

module.exports = router;
