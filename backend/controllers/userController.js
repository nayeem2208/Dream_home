import asyncHandler from "express-async-handler";
import usermodel from "../modals/userModal.js";
import generateToken from "../utils/userJwt.js";
import sendresetmail from "../utils/nodeMailer.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import postModel from "../modals/postModel.js";
import fs from "fs";
import mongoose from "mongoose";

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
      let token = generateToken(res, user._id);
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
    let { email, password } = req.body;
    let user = await usermodel.findOne({ email });
    if (user) {
      if (await user.matchpassword(password)) {
        let token = generateToken(res, user._id);
        res.status(200).json({
          id: user._id,
          name: user.username,
          email: user.email,
          image: user.profilePic,
          token,
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
};

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
    let { state, password } = req.body;
    let user = await usermodel.findOne({ email: state });
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

    const user = await usermodel.create({
      username: username,
      name: name,
      email,
      sub,
      profilePic: "file_1695748280782.png",
    });
    if (user) {
      let token = generateToken(res, user._id);
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
    let token = req.body.credentialResponse.credential;
    let decode = jwt.decode(token);
    const { email } = decode;
    const user = await usermodel.findOne({ email });
    if (user) {
      let token = generateToken(res, user._id);
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

// const logout = (req, res) => {
//   console.log("haai");
//   res.cookie("jwt", "", {
//     httpOnly: true,
//     expires: new Date(0),
//   });
//   res.status(200).json("logut success");
// };

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

const editPost=async(req,res)=>{
  try {
    let post=await postModel.findOne({_id:req.query.id})
    post.heading=req.body.heading
    post.description=req.body.description
    post.service=req.body.service
    await post.save()
    console.log(post)
    res.status(200).json(post)
  } catch (error) {
    res.status(400).json(error.message)
  }
}

const getPostforHome = async (req, res) => {
  try {
    let { id } = req.query;
    let user = await usermodel.findOne({ _id: id });
    if (user) {
      let posts = await postModel.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $match: {
            $or: [
              { userId: user._id, isBlocked: { $ne: true } }, // Include user's own posts that are not blocked
              { "user._id": { $in: user.following }, isBlocked: { $ne: true } }, // Include posts from users the current user follows that are not blocked
            ],
          },
        },
        {
          $project: {
            _id: 1,
            heading: 1,
            description: 1,
            service: 1,
            dateOfPosted: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$dateOfPosted",
                timezone: "Asia/Kolkata",
              },
            },
            media: 1,
            likes: 1,
            comments: 1,
            "user.username": 1,
            "user.profilePic": 1,
          },
        },
        {
          $sort: { dateOfPosted: -1 },
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

      // Use $lookup again to fetch the following and followers details
      user = await usermodel.aggregate([
        {
          $match: { _id: user._id },
        },
        {
          $lookup: {
            from: "users",
            localField: "following",
            foreignField: "_id",
            as: "followingDetails",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "followers",
            foreignField: "_id",
            as: "followersDetails",
          },
        },
        {
          $sort: {
            'followersDetails.username': 1,
          },
        },
        
      ]);

      res.status(200).json({
        username: user[0].username,
        email: user[0].email,
        phone: user[0].phone,
        profilePic: user[0].profilePic,
        coverPic: user[0].coverPic,
        following: user[0].following,
        followers: user[0].followers,
        aboutUs: user[0].aboutUs,
        name: user[0].name,
        post,
        // Include the following and followers details
        followingDetails: user[0].followingDetails,
        followersDetails: user[0].followersDetails,
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
    profile = await usermodel.aggregate([
      {
        $match: { _id: profile._id },
      },
      {
        $lookup: {
          from: "users",
          localField: "following",
          foreignField: "_id",
          as: "followingDetails",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "followers",
          foreignField: "_id",
          as: "followersDetails",
        },
      },
    ]);

    res.status(200).json({
      username: profile[0].username,
      email: profile[0].email,
      phone: profile[0].phone,
      profilePic: profile[0].profilePic,
      coverPic: profile[0].coverPic,
      following: profile[0].following,
      followers: profile[0].followers,
      aboutUs: profile[0].aboutUs,
      name: profile[0].name,
      post,
      followingDetails: profile[0].followingDetails,
      followersDetails: profile[0].followersDetails,
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

const postLikedUser = async (req, res) => {
  try {
    const postLike = await postModel.findOne({ _id: req.query.id });
    if (!postLike) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }
    const userIds = postLike.likes.map((like) => like.userId);
    const likedUsers = await usermodel.find({ _id: { $in: userIds } });
    const users = likedUsers.map((user) => ({
      username: user.username,
      profilePic: user.profilePic,
    }));
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const postCommentedUser = async (req, res) => {
  try {
    const postComment = await postModel.findOne({ _id: req.query.id });
    if (!postComment) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    const comments = postComment.comments;
    const userIds = comments.map((comment) => comment.userId);

    const commentedUsers = await usermodel.find({ _id: { $in: userIds } });

    const usersWithComments = comments.map((comment) => {
      const user = commentedUsers.find((u) => u._id.equals(comment.userId));
      return {
        username: user.username,
        profilePic: user.profilePic,
        comment: comment.comment,
      };
    });
    res.status(200).json(usersWithComments);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const postComment = async (req, res) => {
  try {
    let { id, userId } = req.query;
    let { typecomment } = req.body;
    let post = await postModel.findOne({ _id: id });
    post.comments.push({
      userId: userId,
      comment: typecomment,
      timeStamp: new Date(),
    });
    await post.save();
    res.status(200).json("commented");
  } catch (err) {
    res.status(400).json(err.message);
  }
};

const followManagement = async (req, res) => {
  try {
    let { id, userId } = req.query;

    let user = await usermodel.findOne({ username: id });
    let ourUser = await usermodel.findOne({ _id: userId });
    if (user.followers.includes(userId)) {
      let indexOfFollow = user.followers.indexOf(userId);
      user.followers.splice(indexOfFollow, 1); // Remove 1 element at the found index
      await user.save();

      let indexoffollowing = ourUser.following.indexOf(user._id);
      ourUser.following.splice(indexoffollowing, 1);
      await ourUser.save();
      user = await usermodel.aggregate([
        {
          $match: { _id: user._id },
        },
        {
          $lookup: {
            from: "users",
            localField: "followers",
            foreignField: "_id",
            as: "followersDetails",
          },
        },
      ]);

      res.status(200).json({
        message: "unfollowed",
        followersDetails: user[0].followersDetails,
      });
    } else {
      user.followers.push(userId);
      await user.save();

      ourUser.following.push(user._id);
      await ourUser.save();
      user = await usermodel.aggregate([
        {
          $match: { _id: user._id },
        },
        {
          $lookup: {
            from: "users",
            localField: "followers",
            foreignField: "_id",
            as: "followersDetails",
          },
        },
      ]);
      res.status(200).json({
        message: "following",
        followersDetails: user[0].followersDetails,
      });
    }
  } catch (err) {
    res.status(400).json(err.message);
  }
};

const isBlocked = async (req, res) => {
  try {
    let user = await usermodel.findOne({ _id: req.user._id });
    if (user) {
      next();
    } else {
      res.status(400).json("The user in block");
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const search=async(req,res)=>{
  try {
    let users=await usermodel.find({username:{$regex:req.body.val,$options: 'i'}})
    let posts = await postModel.aggregate([
      
      {
        $match: {
          isBlocked: { $ne: true } },
        
      },
      {
        $match: {
          heading: {
            $regex: `\\b${req.body.val}`,
            $options: 'i', // 'i' for case-insensitive
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $project: {
          _id: 1,
          heading: 1,
          description: 1,
          service: 1,
          dateOfPosted: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$dateOfPosted",
              timezone: "Asia/Kolkata",
            },
          },
          media: 1,
          likes: 1,
          comments: 1,
          "user.username": 1,
          "user.profilePic": 1,
        },
      },
      {
        $sort: { dateOfPosted: -1 },
      },
    ]);
    let service = await postModel.aggregate([
      
      {
        $match: {
          isBlocked: { $ne: true } },
        
      },
      {
        $match: {
          service: {
            $regex: `\\b${req.body.val}`,
            $options: 'i', // 'i' for case-insensitive
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $project: {
          _id: 1,
          heading: 1,
          description: 1,
          service: 1,
          dateOfPosted: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$dateOfPosted",
              timezone: "Asia/Kolkata",
            },
          },
          media: 1,
          likes: 1,
          comments: 1,
          "user.username": 1,
          "user.profilePic": 1,
        },
      },
      {
        $sort: { dateOfPosted: -1 },
      },
    ]);
    res.status(200).json({users,posts,service})

  } catch (error) {
    res.status(400).json(error.message)
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
  googleLogin,
  // logout,
  uploadPost,
  editPost,
  getPostforHome,
  uploadCoverPic,
  getUserProfile,
  editProfile,
  postlike,
  otherUserProfile,
  followManagement,
  postComment,
  isBlocked,
  postLikedUser,
  postCommentedUser,
  search
};
