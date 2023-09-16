import adminModel from "../modals/adminModel.js";
import generateToken from "../utils/adminJwt.js";
import jwt from "jsonwebtoken";

const adminLogin = async (req, res) => {
  console.log(req.body);
  const { username, password } = req.body;
  const admin = await adminModel.findOne({ username });
  if (admin) {
    if (admin.password == password) {
      generateToken(res, admin._id);
      res.status(200).json({ username, password });
    } else {
      res.status(400).json({ error: "Invalid passord" });
    }
  } else {
    res.status(400).json({ error: "Invalid Admin" });
  }
};

const adminLogout = async (req, res) => {
  try {
    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    res.status(200).json("logut success");
  } catch (error) {
    res.status(400).json({error})
  }
};

const check = (req, res) => {
  console.log("angane vannu mooone");
  res.status(200).json("its working macha");
};

export { adminLogin, adminLogout, check };
