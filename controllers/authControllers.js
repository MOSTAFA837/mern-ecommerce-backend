const bcrypt = require("bcrypt");

const adminModel = require("../models/admin.model");
const Seller = require("../models/seller.model");
const SellerCustomer = require("../models/sellerCustomer.model");
const { responseReturn } = require("../utils/response");
const { createToken } = require("../utils/tokenCreate");

class authControllers {
  admin_login = async (req, res) => {
    const { email, password } = req.body;

    try {
      const admin = await adminModel.findOne({ email }).select("+password");

      if (admin) {
        const match = await bcrypt.compare(password, admin.password);

        if (match) {
          const token = await createToken({
            id: admin._id,
            role: admin.role,
          });

          res.cookie("accessToken", token, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          });

          responseReturn(res, 200, { token, message: "Login Success" });
        } else {
          responseReturn(res, 404, { error: "Password Wrong" });
        }
      } else {
        responseReturn(res, 404, { error: "Email not Found" });
      }
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  getUser = async (req, res) => {
    const { id, role } = req;

    try {
      if (role === "admin") {
        const user = await adminModel.findById(id);
        responseReturn(res, 200, { userInfo: user });
      } else if (role === "seller") {
        const seller = await Seller.findById(id);
        responseReturn(res, 200, { userInfo: seller });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  seller_register = async (req, res) => {
    const { email, name, password } = req.body;

    try {
      const seller = await Seller.findOne({ email });

      if (seller) {
        responseReturn(res, 404, { error: "Email already exists" });
      } else {
        const seller = await Seller.create({
          name,
          email,
          password: await bcrypt.hash(password, 10),
        });

        await SellerCustomer.create({
          myId: seller._id,
        });

        const token = await createToken({ id: seller._id, role: seller.role });
        res.cookie("accessToken", token, {
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

        responseReturn(res, 201, { token, message: "Register Success" });
      }
    } catch (error) {
      responseReturn(res, 500, { error: "Internal Server Error" });
    }
  };

  seller_login = async (req, res) => {
    const { email, password } = req.body;

    try {
      const seller = await Seller.findOne({ email }).select("+password");

      if (seller) {
        const match = await bcrypt.compare(password, seller.password);

        if (match) {
          const token = await createToken({
            id: seller._id,
            role: seller.role,
          });

          res.cookie("accessToken", token, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          });
          responseReturn(res, 200, { token, message: "Login Success" });
        } else {
          responseReturn(res, 404, { error: "Password Wrong" });
        }
      }
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };
}

module.exports = new authControllers();
