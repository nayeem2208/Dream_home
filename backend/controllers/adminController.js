import adminModel from "../modals/adminModel.js";
import postModel from "../modals/postModel.js";
import postModal from "../modals/postModel.js";
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
    res.status(400).json({ error });
  }
};

const check = (req, res) => {
  console.log("angane vannu mooone");
  res.status(200).json("its working macha");
};

const userPost = async (req, res) => {
  try {
    let post = await postModel.aggregate([
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
    res.status(200).json( post );
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const postBlock=async(req,res)=>{
  try {
    let {postId}=req.query
    console.log(req.query)
    let post=await postModal.findOne({_id:postId})
    if(post.isBlocked){
      post.isBlocked=false
      await post.save()
      res.status(200).json('unblocked')
    }
    else{
      post.isBlocked=true
      await post.save()
      res.status(200).json('blocked')
    }
  } catch (error) {
    res.status(400).json(error.message)
  }
}

export { adminLogin, adminLogout, check, userPost,postBlock };
