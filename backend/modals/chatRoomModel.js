import mongoose from "mongoose";

const chatRoomSchema=mongoose.Schema({
    participants:[
        {type:mongoose.Schema.Types.ObjectId,ref:'Users'}
    ],
    messages:[{type:mongoose.Schema.Types.ObjectId,ref:'chatMessage'}],
    
})

let chatRoomModel=mongoose.model('chatRoom',chatRoomSchema)

export default chatRoomModel