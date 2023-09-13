import asyncHandler from "express-async-handler";
import usermodel from "../modals/userModal.js";
import generateToken from "../utils/userJwt.js";
import sendresetmail from "../utils/nodeMailer.js";
import jwt from "jsonwebtoken";

const registerUser = asyncHandler(async (req, res) => {
  try {
    const { username, email, phone, password } = req.body;
    let userExist = await usermodel.findOne({ email });
    if (userExist) {
      res.status(400);
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

const forgotpassword = async (req, res) => {
  try {
    let { email } = req.body;
    let user = await usermodel.findOne({ email });
    const token1 = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiration = new Date(Date.now() + 1 * 120 * 1000);
    if (user) {
      user.token = token1;
      user.otpExpiration = otpExpiration;
      await user.save();
      sendresetmail(user.username, email, user.token);
      res.status(200).json("its working");
    } else {
      res.status(400).json("User not found");
    }
  } catch (error) {
    res.status(400).json({ error });
  }
};

const verifyOtp = async (req, res) => {
  try {
    let { state, otp } = req.body;

    let user = await usermodel.findOne({ email: state });
    if (user.token == otp) {
      const currentTime = new Date();
      if (currentTime <= user.otpExpiration) {
        res.status(200).json("otp is matched");
      } else {
        res.status(200).json("Otp expired");
      }
    } else {
      res.status(400).json("Otp not matched");
    }
  } catch (err) {
    res.status(400).json({ error });
  }
};

const resetPassword = async (req, res) => {
  try {
    console.log(req.body);
    let { state, password } = req.body;
    console.log(state, "email");
    let user = await usermodel.findOne({ email: state });
    console.log(user);
    user.password = password;
    await user.save();
    res.status(200).json("reset password is working");
  } catch (error) {
    res.status(400).json({ error });
  }
};

const googleAuth = async (req, res) => {
  console.log(req.body);
  let token = req.body.credentialResponse.credential;
  let decode = jwt.decode(token);
  const { name, email, sub } = decode;
  const userExists = await usermodel.findOne({ email });
  if (userExists) {
    res.status(400).json({ error: "User already exists" });
  }

  const user = await usermodel.create({
    username: name,
    email,
    sub,
  });
  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      username: user.name,
      email: user.email,
    });
  }
};

const googleLogin=async(req,res)=>{
  let token=req.body.credentialResponse.credential
  let decode=jwt.decode(token)
  const {email}=decode
  const user=await usermodel.findOne({email})
  if(user){
    generateToken(res,user._id)
    res.status(200).json({name:user.username,email:user.email})
  }
  else{
    res.status(400).json("Invalid User")
  }
}

export {
  registerUser,
  loginUser,
  check,
  forgotpassword,
  verifyOtp,
  resetPassword,
  googleAuth,
  googleLogin
};
