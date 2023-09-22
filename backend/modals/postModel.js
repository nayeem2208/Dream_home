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
    }

})

const postModel=mongoose.model('Posts',postSchema)

export default postModel
