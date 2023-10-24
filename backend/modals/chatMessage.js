import mongoose from "mongoose";

const chatMessageSchema=mongoose.Schema({
    room:{type:mongoose.Schema.Types.ObjectId,ref:'chatRoom'},
    senderId:{type:mongoose.Schema.Types.ObjectId,ref:'Users'},
    content:{type:String},
    createdAt:{type:Date,default:Date.now},
    isREad:{type:Boolean,default:false}
})

const chatMessageModel=mongoose.model('chatMessage',chatMessageSchema)
export default chatMessageModel