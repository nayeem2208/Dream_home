import mongoose from "mongoose";

const notificationSchema=mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users',
        required:true
    },
    recieverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users',
        required:true
    },
    action:{
        type:String,
    },
    timeStamp:{
        type:Date,
        required:true,
        default:Date.now
    },
    content:{
        type:String
    },
    isRead:{
        type:Boolean,
        default:false
    },
    postId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Posts'
    },
    commentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users'
    },
    comment:{
        type:String
    }
})

const notificationModel=mongoose.model('notification',notificationSchema)
export default notificationModel