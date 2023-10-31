import usermodel from "../modals/userModal.js";
import postModel from "../modals/postModel.js";
import notificationModel from "../modals/notification.js";

const uploadPost = async (req, res) => {
  try {
    const { _id, heading, description, service } = req.body;

    const currentDate = new Date();

    const post = await postModel.create({
      userId: _id,
      heading: heading,
      description: description,
      service: service,
      dateOfPosted: currentDate,
    });
    if (req.files) {
      const uploadedFiles = req.files;
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
    const { id } = req.query;
    const user = await usermodel.findOne({ _id: id });
    if (user.following.length > 0) {
      if (user) {
        const posts = await postModel.aggregate([
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
                {
                  "user._id": { $in: user.following },
                  isBlocked: { $ne: true },
                }, // Include posts from users the current user follows that are not blocked
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
                  format: "%Y-%m-%d %H:%M",
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
    } else {
      const posts = await postModel.aggregate([
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
              { isBlocked: { $ne: true } }, // Include posts from users the current user follows that are not blocked
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
                format: "%Y-%m-%d %H:%M",
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

const editPost = async (req, res) => {
  try {
    const post = await postModel.findOne({ _id: req.query.id });
    post.heading = req.body.heading;
    post.description = req.body.description;
    post.service = req.body.service;
    await post.save();
    console.log(post);
    res.status(200).json(post);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const deletePost = async (req, res) => {
  try {
    console.log(req.query.id);
    const postDelete = await postModel.deleteOne({ _id: req.query.id });
    console.log(postDelete);
    res.status(200).json("successfulll");
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const postlike = async (req, res) => {
  try {
    const { id, userId } = req.query;
    const post = await postModel.findOne({ _id: id });
    const indexOfLike = post.likes.findIndex(
      (like) => like.userId.toString() === userId
    );

    if (indexOfLike !== -1) {
      // User has already liked the post, so remove the like
      post.likes.splice(indexOfLike, 1);
      await post.save();
      await notificationModel.deleteOne({
        recieverId: post.userId,
        senderId: userId,
        postId: post._id,
        action: "like",
      });
      res.status(200).json("unliked");
    } else {
      // User has not liked the post, so add a new like
      post.likes.push({ userId: userId, timeStamp: new Date() });
      if (post.userId != userId) {
        await notificationModel.create({
          recieverId: post.userId,
          senderId: userId,
          postId: post._id,
          action: "like",
        });
      }
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
      res.status(404).json({ message: "Post not found" });
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
      res.status(404).json({ message: "Post not found" });
      return;
    }

    const comments = postComment.comments;
    const userIds = comments.map((comment) => comment.userId);

    const commentedUsers = await usermodel.find({ _id: { $in: userIds } });

    const usersWithComments = comments.map((comment) => {
      const user = commentedUsers.find((u) => u._id.equals(comment.userId));
      return {
        id: comment._id,
        username: user.username,
        profilePic: user.profilePic,
        comment: comment.comment,
        commentLikes: comment.likes,
      };
    });
    res.status(200).json(usersWithComments);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const postComment = async (req, res) => {
  try {
    const { id, userId } = req.query;
    const { typecomment } = req.body;
    const post = await postModel.findOne({ _id: id });
    post.comments.push({
      userId: userId,
      comment: typecomment,
      timeStamp: new Date(),
    });
    await post.save();
    // console.log(post.comments[post.comments.length-1]._id)
    if (post.userId != userId) {
       await notificationModel.create({
        recieverId: post.userId,
        senderId: userId,
        postId: post._id,
        action: "comment",
        commentId: post.comments[post.comments.length - 1]._id,
        comment: typecomment,
      });
    }
    res.status(200).json("commented");
  } catch (err) {
    res.status(400).json(err.message);
  }
};

const addCommentLike = async (req, res) => {
  try {
    const commentId = req.body.id;
    const userId = req.user._id;
    const post = await postModel.findOne({ "comments._id": commentId });
    if (!post) {
      res.status(400)
    } else {
      const comment = post.comments.find((comment) => comment._id == commentId);
      if (!comment) {
        res.status(400)
      } else {
        const likes = comment.likes;
        const userIndex = likes.findIndex((like) => {
          const likeIdString = like._id.toString();
          const userIdString = userId.toString();
          return likeIdString === userIdString;
        });
        if (userIndex === -1) {
          likes.push(userId);
        } else {
          likes.splice(userIndex, 1);
        }
        await post.save();
      }
    }
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

const commentDelete = async (req, res) => {
  try {
     await postModel.updateOne(
      { _id: req.query.postId },
      { $pull: { comments: { _id: req.query.id } } }
    );
     await notificationModel.deleteOne({
      commentId: req.query.id,
    });
    res.status(200).json("successfully deleted");
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const singlePostView = async (req, res) => {
  try {
    let post = await postModel.findOne({ _id: req.query.id });
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    const comments = post.comments;
    const userIds = comments.map((comment) => comment.userId);

    const commentedUsers = await usermodel.find({ _id: { $in: userIds } });

    const usersWithComments = comments.map((comment) => {
      const user = commentedUsers.find((u) => u._id.equals(comment.userId));
      return {
        id: comment._id,
        username: user.username,
        profilePic: user.profilePic,
        comment: comment.comment,
      };
    });

    res.status(200).json({ post, usersWithComments });
  } catch (error) {
    res.status(400).json(error);
  }
};

export {
  uploadPost,
  getPostforHome,
  editPost,
  deletePost,
  postlike,
  postComment,
  postLikedUser,
  postCommentedUser,
  commentDelete,
  singlePostView,
  addCommentLike,
};
