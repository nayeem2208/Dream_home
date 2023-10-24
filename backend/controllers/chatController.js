import usermodel from "../modals/userModal.js";
import chatRoomModel from "../modals/chatRoomModel.js";
import chatMessageModel from "../modals/chatMessage.js";
import mongoose from "mongoose";
import premiumPaidModel from "../modals/PaidPremiumPlans.js";
const ObjectId = mongoose.Types.ObjectId;

const chatUser = async (req, res) => {
  try {
    const currentUser = req.user._id;
    const user = await usermodel.findOne({ _id: currentUser });
    const chatRoom = await chatRoomModel.find({ participants: currentUser });
    const chatRoomsData = await Promise.all(
      chatRoom.map(async (chatRoom) => {
        try {
          // console.log(chatRoom)
          const otherParticipantId = chatRoom.participants.find(
            (participantId) =>
              participantId.toString() !== currentUser.toString()
          );
          const otherParticipant = await usermodel.findById(
            otherParticipantId,
            "username profilePic"
          );

          // Find the latest message for the chat room
          const latestMessage = await chatMessageModel
            .findOne({ room: chatRoom._id }, {}, { sort: { createdAt: -1 } })
            .lean();

          return {
            _id: chatRoom._id,
            otherParticipant,
            messages: chatRoom.messages,
            lastMessage: latestMessage, // Include the latest message
          };
        } catch (error) {
          console.error("Error in chatRoom mapping:", error);
          throw error;
        }
      })
    );
    chatRoomsData.sort((a, b) => {
      if (a.lastMessage && b.lastMessage) {
        return b.lastMessage.createdAt - a.lastMessage.createdAt;
      }
      return 0;
    });

    const followedUserIds = user.followers;
    const followedUsers = await usermodel.find({
      _id: { $in: followedUserIds },
    });

    res.status(200).json({ followedUsers, chatRoomsData });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const selectChat = async (req, res) => {
  try {
    const user = req.body.id;
    const ourUser = req.user._id;
    let userProfile = await usermodel.findOne({ _id: user });
    let chatRoom = await chatRoomModel.find({
      participants: { $all: [user, ourUser] },
    });

    if (chatRoom.length > 0) {
      let messages = await chatMessageModel.find({ room: chatRoom[0]._id });

      if (messages.length > 0) {
        res.status(200).json({ messages, userProfile ,chatRoomId:chatRoom[0]._id});
      } else {
        res.status(200).json({ messages, userProfile ,chatRoomId:chatRoom[0]._id});
      }
    } else {
      let chatRoomCreate = await chatRoomModel.create({
        participants: [user, ourUser],
        messages: [],
      });
      res.status(200).json({chatRoomCreate,chatRoomId:chatRoom._id});
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const sendMessage = async (req, res) => {
  try {
    let user = req.body.chatUser._id;
    let ourUser = req.user._id;
    let chatRoom = await chatRoomModel.findOne({
      participants: { $all: [user, ourUser] },
    });

    let message = await chatMessageModel.create({
      room: chatRoom._id,
      senderId: ourUser,
      content: req.body.typeMessge,
    });
    let fullChatmessage = await chatMessageModel.findOne({ _id: message._id });
    res.status(200).json(fullChatmessage);
  } catch (error) {
    console.log(error.message);
    res.status(400).json(error);
  }
};

const messageFromProfile = async (req, res) => {
  try {
    const user = req.query.userId;
    const ourUser = req.user._id;

    let chatRoom = await chatRoomModel.findOne({
      participants: { $all: [user, ourUser] },
    });
    console.log(chatRoom, "chatRoom");
    //checking weather is chatroom is already exist or not
    if (chatRoom) {
      res.status(200).json({chatRoom:chatRoom});
    } else {
      let followercheck = await usermodel.aggregate([
        {
          $match: {
            _id: req.user._id,
            followers: { $in: [new ObjectId(req.query.userId)] }, //for converting the userId string to object Id
          },
        },
      ]);
      //checking weather is user in followers list or not
      if (followercheck.length > 0) {
        //If they the user in follower list creating a chatRoom
        let chatRoomCreate = await chatRoomModel.create({
          participants: [user, ourUser],
          messages: [],
        });
        res.status(200).json({chatRoom:chatRoomCreate});
      } else {
        //checking weather the premium is exists or not
        const currentDate = new Date();
        let paidPlans = await premiumPaidModel.find({
          UserId: req.user._id,
          Expiry: { $gt: currentDate },
        });
        if (paidPlans.length > 0) {
          //creating a chatRoom if he has a premium paln
          let chatRoomCreate = await chatRoomModel.create({
            participants: [user, ourUser],
            messages: [],
          });
          res.status(200).json({chatRoom:chatRoomCreate});
        } else {
          res.status(200).json({
            message:
              "Unlock the ability to message anyone, even if they are not following you, by using Premium. ",
          });
        }
      }
    }
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
};

const addMessageNotification=async(req,res)=>{
  try {
    console.log('haaaaaai')
    console.log(req.query)
  } catch (error) {
    console.log(error)
  }
}

export { chatUser, selectChat, sendMessage, messageFromProfile,addMessageNotification };