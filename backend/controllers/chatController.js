import usermodel from "../modals/userModal.js";
import chatRoomModel from "../modals/chatRoomModel.js";
import chatMessageModel from "../modals/chatMessage.js";

const chatUser = async (req, res) => {
  try {
    const currentUser = req.user._id;
    const user = await usermodel.findOne({ _id: currentUser });
    const chatRoom = await chatRoomModel.find({ participants: currentUser })
    const chatRoomsData = await Promise.all(
      chatRoom.map(async (chatRoom) => {
        try {
          // console.log(chatRoom)
          const otherParticipantId = chatRoom.participants.find(
            (participantId) => participantId.toString() !== currentUser.toString()
          );
          const otherParticipant = await usermodel.findById(
            otherParticipantId,
            "username profilePic"
          );
  
          // Find the latest message for the chat room
          const latestMessage = await chatMessageModel.findOne(
            { room: chatRoom._id },
            {},
            { sort: { createdAt: -1 } }
          ).lean();
  
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
    )
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

      res.status(200).json({followedUsers,chatRoomsData});

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
      let messages= await chatMessageModel.find({ room:chatRoom[0]._id });
  
      if (messages.length>0) {
        res.status(200).json({messages, userProfile});
      } else {
        res.status(200).json({messages,userProfile});
      }
    } else {
      let chatRoomCreate = await chatRoomModel.create({
        participants: [user, ourUser],
        messages: [],
      });
      res.status(200).json(chatRoomCreate);
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const sendMessage=async(req,res)=>{
  try {
    let user=req.body.chatUser._id
    let ourUser=req.user._id
    let chatRoom=await chatRoomModel.findOne({participants:{$all:[user,ourUser]}})
    
    let message=await chatMessageModel.create({room:chatRoom._id,senderId:ourUser,content:req.body.typeMessge})
    let fullChatmessage=await chatMessageModel.findOne({_id:message._id})
    res.status(200).json(fullChatmessage)
  } catch (error) {
    console.log(error.message)
    res.status(400).json(error)
  }
}

export { chatUser, selectChat,sendMessage };
