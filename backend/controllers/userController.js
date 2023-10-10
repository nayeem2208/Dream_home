import usermodel from "../modals/userModal.js";
import postModel from "../modals/postModel.js";
import notificationModel from "../modals/notification.js";

const uploadCoverPic = async (req, res) => {
  try {
    const { id } = req.body;
    const user = await usermodel.findOne({ _id: id });
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
    const { id } = req.query;

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
            "followersDetails.username": 1,
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
    const { id, username, Phone, email, AboutUs, name } = req.body;
    const user = await usermodel.findOne({ _id: id });
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

const followManagement = async (req, res) => {
  try {
    const { id, userId } = req.query;

    let user = await usermodel.findOne({ username: id });
    let ourUser = await usermodel.findOne({ _id: userId });
    if (user.followers.includes(userId)) {
      let indexOfFollow = user.followers.indexOf(userId);
      user.followers.splice(indexOfFollow, 1); // Remove 1 element at the found index
      await user.save();
      
      let indexoffollowing = ourUser.following.indexOf(user._id);
      ourUser.following.splice(indexoffollowing, 1);
      await ourUser.save();
      const notifications = await notificationModel.deleteOne({
        recieverId: user._id,
      });
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
      // console.log(user.username)
      
      ourUser.following.push(user._id);
      await ourUser.save();
      const notification = await notificationModel.create({
        recieverId: user._id,senderId:ourUser._id,
        action: "follow",
      });
      console.log(notification);
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
    const user = await usermodel.findOne({ _id: req.user._id });
    if (user) {
      next();
    } else {
      res.status(400).json("The user in block");
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const search = async (req, res) => {
  try {
    const users = await usermodel.find({
      username: { $regex: req.body.val, $options: "i" },
    });
    const posts = await postModel.aggregate([
      {
        $match: {
          isBlocked: { $ne: true },
        },
      },
      {
        $match: {
          heading: {
            $regex: `\\b${req.body.val}`,
            $options: "i", // 'i' for case-insensitive
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
    const service = await postModel.aggregate([
      {
        $match: {
          isBlocked: { $ne: true },
        },
      },
      {
        $match: {
          service: {
            $regex: `\\b${req.body.val}`,
            $options: "i", // 'i' for case-insensitive
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
    res.status(200).json({ users, posts, service });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const getNotification = async (req, res) => {
  try {
    let notification = await notificationModel.aggregate([
      {
        $match: {
          recieverId: req.user._id,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "senderId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "postId",
          foreignField: "_id",
          as: "Post",
        },
      },
      {
        $project: {
          "user.username": 1,
          "user.profilePic": 1,
          "Post.media": 1,
          "Post.likes": 1,
        },
      },
    ]);

    console.log(notification);
    res.status(200).json(notification);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

export {
  uploadCoverPic,
  getUserProfile,
  editProfile,
  otherUserProfile,
  followManagement,
  isBlocked,
  search,
  getNotification,
};
