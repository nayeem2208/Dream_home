import asyncHandler from "express-async-handler";
import usermodel from "../modals/userModal.js";
import generateToken from "../utils/userJwt.js";

const registerUser = asyncHandler(async (req, res) => {
  try {
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
    if (user && (await user.matchpassword(password))) {
      generateToken(res, user._id);
      res.status(200).json({ id: user._id, name: user.username });
    } else {
      res.status(400).json("wrong email or password");
    }
    res.status(200).json(user);
  } catch (err) {
    console.log(err.message);
  }
});

const check = (req, res) => {
  // res.send('haaaai1')
  res.status(200).json("haaai");
};

export { registerUser, loginUser, check };
