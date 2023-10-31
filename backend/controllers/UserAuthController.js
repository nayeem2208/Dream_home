import asyncHandler from "express-async-handler";
import usermodel from "../modals/userModal.js";
import generateToken from "../utils/userJwt.js";
import sendresetmail from "../utils/nodeMailer.js";
import jwt from "jsonwebtoken";

const registerUser = asyncHandler(async (req, res) => {
  try {
    const { username, email, phone, password } = req.body;
    const userExist = await usermodel.findOne({ email });
    const usernameExist = await usermodel.findOne({ username });
    if (userExist) {
      res.status(400).json("Email already exists");
    }
    if (usernameExist) {
      res.status(400).json("Please Use unique usename");
    }
    const user = await usermodel.create({
      username,
      email,
      phone,
      password,
      profilePic: "file_1695748280782.png",
    });
    if (user) {
      const token = generateToken(res, user._id);
      res.status(200).json({
        id: user._id,
        name: user.username,
        email: user.email,
        image: user.profilePic,
        token,
      });
    }
  } catch (err) {
    res.status(400).json({ err: "Email already exist" });
  }
});

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await usermodel.findOne({ email });
    if (user) {
      if (await user.matchpassword(password)) {
        if (user.isBlocked) {
          res.status(400).json({ error: "User is blocked" });
        } else {
          const token = generateToken(res, user._id);
          res.status(200).json({
            id: user._id,
            name: user.username,
            email: user.email,
            image: user.profilePic,
            token,
          });
        }
      } else {
        res.status(400).json({ error: "Wrong password" });
      }
    } else {
      res.status(400).json({ error: "Wrong email" });
    }
  } catch (err) {
    res.status(400).json({ error: "invalid " });
  }
};

const check = (req, res) => {
  res.status(200).json("Its workingggggggggggggggg");
};

const forgotpassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await usermodel.findOne({ email });
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
    const { state, otp } = req.body;

    const user = await usermodel.findOne({ email: state });
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
    res.status(400).json( err );
  }
};

const resetPassword = async (req, res) => {
  try {
    const { state, password } = req.body;
    const user = await usermodel.findOne({ email: state });
    user.password = password;
    await user.save();
    res.status(200).json("reset password is working");
  } catch (error) {
    res.status(400).json({ error });
  }
};

const googleAuth = async (req, res) => {
  try {
    const token = req.body.credentialResponse.credential;
    const decode = jwt.decode(token);
    const { name, email, sub } = decode;
    const userExists = await usermodel.findOne({ email });
    if (userExists) {
      res.status(400).json({ error: "User already exists" });
    }

    let username = "";
    for (let i = 0; i < email.length; i++) {
      if (email[i] == "@") {
        break;
      } else {
        username += email[i];
      }
    }

    const user = await usermodel.create({
      username: username,
      name: name,
      email,
      sub,
      profilePic: "file_1695748280782.png",
    });
    if (user) {
      const token = generateToken(res, user._id);
      res.status(200).json({
        id: user._id,
        name: user.username,
        email: user.email,
        image: user.profilePic,
        token,
      });
    } else {
      res.status(400).json("Couldnt find the user");
    }
  } catch (error) {
    res.status(400).json({ error });
  }
};

const googleLogin = async (req, res) => {
  try {
    const token = req.body.credentialResponse.credential;
    const decode = jwt.decode(token);
    const { email } = decode;
    const user = await usermodel.findOne({ email });
    if (user) {
      const token = generateToken(res, user._id);
      res.status(200).json({
        id: user._id,
        name: user.username,
        email: user.email,
        image: user.profilePic,
        token,
      });
    } else {
      res.status(400).json("Invalid User");
    }
  } catch (error) {
    res.status(400).json(error);
  }
};

export {
  registerUser,
  loginUser,
  check,
  forgotpassword,
  verifyOtp,
  resetPassword,
  googleAuth,
  googleLogin,
};
