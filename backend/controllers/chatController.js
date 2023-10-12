import usermodel from "../modals/userModal.js";
import chatRoomModel from "../modals/chatRoomModel.js";

const chatUser = async (req, res) => {
  try {
    console.log(req.user);
    const user = await usermodel.findOne({ _id: req.user });
    const users = await usermodel.aggregate([
        {
          $lookup: {
            from: "users", 
            localField: "following", 
            foreignField: "_id",     
            as: "followedUsers"      
          }
        },
        {
          $unwind: "$followedUsers" 
        },
        {
          $match: {
            "followedUsers.isBlocked": { $ne: true }, 
            // "followers": { $in: [followedUsers._id] }
          }
        },
        {
            $project:{
                "followedUsers._id":1,
                "followedUsers.username":1,
                "followedUsers.profilePic":1,
            }
        }
      ]);
      
    res.status(200).json(users)
  } catch (error) {
    res.status(400).json(error);
  }
};

export { chatUser };
