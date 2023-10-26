import mongoose from 'mongoose'

const postSchema=mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users'
    },
    heading:{
        type:String,
    },
    description:{
        type:String,
    },
    service:{
        type:String,
    },
    media:{
        type:Array
    },
    dateOfPosted:{
        type:Date
    },
    likes:[{
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:'Users'
        },
        timeStamp:{
            type:Date,
            required:true,
            default:Date.now
        }
    }],
    comments:[{
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Users',
            required:true
        },
        comment:{
            type:String,
            required:true
        },
        timeStamp:{
            type:Date,
            required:true,
            default:Date.now
        },
        likes:[{
            userId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'Users',
            }
        }]

    }],
    isBlocked:{
        type:Boolean,
        default:false
    }

})

const postModel=mongoose.model('Posts',postSchema)

export default postModel
