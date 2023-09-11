import asyncHandler from "express-async-handler";
import usermodel from "../modals/userModal.js";
import generateToken from "../utils/userJwt.js";

const registerUser = asyncHandler(async (req, res) => {
  try {
    console.log("Im here macha");
    console.log(req.body)
    const { username, email, phone, password } = req.body;
    let userExist = await usermodel.findOne({ email });
    if (userExist) {
      res.status(400);
      console.log("user already exist");
    }
    const user = await usermodel.create({
      username,
      email,
      phone,
      password,
    });
    if (user) {
      generateToken(res, user._id);

      res
        .status(201)
        .json({ id: user._id, name: user.username, email: user.email });
    }
  } catch (err) {
    console.error(err.message);
  }
});

const loginUser = asyncHandler(async (req, res) => {
  try {
    let { email, password } = req.body;
    let user = await usermodel.findOne({ email });
    if (user) {
      if (await user.matchpassword(password)) {
        generateToken(res, user._id);

        res.status(200).json({ id: user._id, name: user.username });
      } else {
        res.status(400).json({ error: "Wrong password" });
      }
    } else {
      res.status(400).json({ error: "Wrong email" });
    }
  } catch (err) {
    res.status(400).json({ error: "invalid " });
  }
});

const check = (req, res) => {
  res.status(200).json("Its workingggggggggggggggg");
};

export { registerUser, loginUser, check };
