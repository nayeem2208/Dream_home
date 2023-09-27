import asyncHandler from "express-async-handler";
import usermodel from "../modals/userModal.js";
import generateToken from "../utils/userJwt.js";
import sendresetmail from "../utils/nodeMailer.js";
import jwt from "jsonwebtoken";
import postModel from "../modals/postModel.js";
import fs from "fs";

const registerUser = asyncHandler(async (req, res) => {
  try {
    const { username, email, phone, password } = req.body;
    let userExist = await usermodel.findOne({ email });
    let usernameExist = await usermodel.findOne({ username });
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
      generateToken(res, user._id);

      res
        .status(201)
        .json({
          id: user._id,
          name: user.username,
          email: user.email,
          image: user.profilePic,
        });
    }
  } catch (err) {
    res.status(400).json({ err: "Email already exist" });
  }
});

const loginUser = asyncHandler(async (req, res) => {
  try {
    let { email, password } = req.body;
    let user = await usermodel.findOne({ email });
    if (user) {
      if (await user.matchpassword(password)) {
        generateToken(res, user._id);

        res
          .status(200)
          .json({
            id: user._id,
            name: user.username,
            email: user.email,
            image: user.profilePic,
          });
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
  try {
    let token = req.body.credentialResponse.credential;
    let decode = jwt.decode(token);
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
    console.log(username);

    const user = await usermodel.create({
      username: username,
      name: name,
      email,
      sub,
      profilePic: "file_1695748280782.png",
    });
    if (user) {
      generateToken(res, user._id);
      res
        .status(200)
        .json({
          id: user._id,
          name: user.username,
          email: user.email,
          image: user.profilePic,
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
    let token = req.body.credentialResponse.credential;
    let decode = jwt.decode(token);
    const { email } = decode;
    const user = await usermodel.findOne({ email });
    if (user) {
      generateToken(res, user._id);
      res
        .status(200)
        .json({
          id: user._id,
          name: user.username,
          email: user.email,
          image: user.profilePic,
        });
    } else {
      res.status(400).json("Invalid User");
    }
  } catch (error) {
    res.status(400).json(error);
  }
};

const logout = (req, res) => {
  console.log("haai");
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json("logut success");
};

const uploadPost = async (req, res) => {
  try {
    let { _id, heading, description, service } = req.body;

    let currentDate = new Date();

    let post = await postModel.create({
      userId: _id,
      heading: heading,
      description: description,
      service: service,
      dateOfPosted: currentDate,
    });
    if (req.files) {
      let uploadedFiles = req.files;
      let fileUrls = [];
      for (let file of uploadedFiles) {
        const filePath = file.filename;
        fileUrls.push(filePath);
      }
      post.media = fileUrls;
      await post.save();
    }
    res.status(200).json({ heading: req.body.heading });
  } catch (error) {
    res.status(400).json({ error });
  }
};

const getPostforHome = async (req, res) => {
  try {
    let { id } = req.query;
    let user = await usermodel.findOne({ _id: id });
    if (user) {
      let posts = await postModel.aggregate([
        {
          $sort: { dateOfPosted: -1 }, // Sort the posts by dateOfPosted in descending order
        },
        {
          $lookup: {
            from: "users", // The name of the User collection
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: "$user", // Convert the user array to an object
        },
        {
          $project: {
            _id: 1,
            heading: 1,
            description: 1,
            service: 1,
            dateOfPosted: {
              $dateToString: {
                format: "%Y-%m-%d", // Format to display only the date
                date: "$dateOfPosted",
                timezone: "Asia/Kolkata", // Set the desired timezone (Indian Standard Time)
              },
            },
            media: 1,
            likes: 1,
            comments: 1,
            "user.username": 1,
            "user.profilePic": 1,
          },
        },
      ]);

      res.status(200).json(posts);
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const uploadCoverPic = async (req, res) => {
  try {
    let { id } = req.body;
    let user = await usermodel.findOne({ _id: id });
    if (user) {
      user.coverPic = req.file.filename;
      await user.save();
      res.status(200).json("Cover succefully uploaded");
    } else {
      res.status(400).json("User not found");
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const getUserProfile = async (req, res) => {
  try {
    let { id } = req.query;

    let user = await usermodel.findOne({ _id: id });
    if (user) {
      let post = await postModel.aggregate([
        {
          $match: { userId: user._id }, // Filter posts by userId
        },
        {
          $sort: { dateOfPosted: -1 }, // Sort the posts by dateOfPosted in descending order
        },
        {
          $lookup: {
            from: "users", // The name of the User collection
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: "$user", // Convert the user array to an object
        },
        {
          $project: {
            _id: 1,
            heading: 1,
            description: 1,
            service: 1,
            dateOfPosted: {
              $dateToString: {
                format: "%Y-%m-%d", // Format to display only the date
                date: "$dateOfPosted",
                timezone: "Asia/Kolkata", // Set the desired timezone (Indian Standard Time)
              },
            },
            likes: 1,
            comments: 1,
            media: 1,
            "user.username": 1,
            "user.profilePic": 1,
          },
        },
      ]);

      res.status(200).json({
        username: user.username,
        email: user.email,
        phone: user.phone,
        profilePic: user.profilePic,
        coverPic: user.coverPic,
        following: user.following,
        followers: user.followers,
        aboutUs: user.aboutUs,
        name: user.name,
        post,
      });
    } else {
      res.status(400).json("User not found");
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const otherUserProfile = async (req, res) => {
  try {
    let profile = await usermodel.findOne({ username: req.query.username });
    console.log(profile);
    let post = await postModel.aggregate([
      {
        $match: { userId: profile._id }, // Filter posts by userId
      },
      {
        $sort: { dateOfPosted: -1 }, // Sort the posts by dateOfPosted in descending order
      },
      {
        $lookup: {
          from: "users", // The name of the User collection
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user", // Convert the user array to an object
      },
      {
        $project: {
          _id: 1,
          heading: 1,
          description: 1,
          service: 1,
          dateOfPosted: {
            $dateToString: {
              format: "%Y-%m-%d", // Format to display only the date
              date: "$dateOfPosted",
              timezone: "Asia/Kolkata", // Set the desired timezone (Indian Standard Time)
            },
          },
          likes: 1,
          comments: 1,
          media: 1,
          "user.username": 1,
          "user.profilePic": 1,
        },
      },
    ]);

    res.status(200).json({
      username: profile.username,
      email: profile.email,
      phone: profile.phone,
      profilePic: profile.profilePic,
      coverPic: profile.coverPic,
      following: profile.following,
      followers: profile.followers,
      aboutUs: profile.aboutUs,
      name: profile.name,
      post,
    });
  } catch (error) {
    res.status(400).json({ error });
  }
};

const editProfile = async (req, res) => {
  try {
    let { id, username, Phone, email, AboutUs, name } = req.body;
    let user = await usermodel.findOne({ _id: id });
    if (user) {
      // user.profilePic = req.file.filename;
      user.username = username;
      user.name = name;
      user.email = email;
      user.phone = Phone;
      user.aboutUs = AboutUs;
      if (req.file) {
        user.profilePic = req.file.filename;
      }
      await user.save();
      res.status(200).json("Cover succefully uploaded");
    } else {
      res.status(400).json("User not found");
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const postlike = async (req, res) => {
  try {
    let { id, userId } = req.query;
    console.log(id);
    let post = await postModel.findOne({ _id: id });
    const indexOfLike = post.likes.findIndex(
      (like) => like.userId.toString() === userId
    );

    if (indexOfLike !== -1) {
      // User has already liked the post, so remove the like
      post.likes.splice(indexOfLike, 1);
      await post.save();
      let already = true;
      res.status(200).json("unliked");
    } else {
      // User has not liked the post, so add a new like
      post.likes.push({ userId: userId, timeStamp: new Date() });
      await post.save();
      res.status(200).json("liked");
    }
  } catch (err) {
    res.status(400).json(err.message);
  }
};

const followManagement = async (req, res) => {
  try {
    let { id, userId } = req.query;
    // console.log(id);
    let user = await usermodel.findOne({username: id });
    // const indexOffollower = user.followers.findIndex(
    //   (follow) => follow.toString() === userId
    // );
    if (user.followers.includes(userId)) {
      let indexOfFollow = user.followers.indexOf(userId);
      console.log(indexOfFollow);
      console.log('haaai');
    
      user.followers.splice(indexOfFollow, 1); // Remove 1 element at the found index
      await user.save();
      res.status(200).json('unfollowed');
    }else {
      // User has not liked the post, so add a new like
      user.followers.push(userId);
      await user.save();
      res.status(200).json("following");
    }
  } catch (err) {
    res.status(400).json(err.message);
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
  logout,
  uploadPost,
  getPostforHome,
  uploadCoverPic,
  getUserProfile,
  editProfile,
  postlike,
  otherUserProfile,
  followManagement
};
