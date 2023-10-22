import mongoose from "mongoose";

const premiumSchema=mongoose.Schema({
    Heading:{
        type:String,
        required:true
    },
    Amount:{
        type:Number,
        required:true
    },
    Discount:{
        type:Number
    },
    isActive:{
        type:Boolean,
        default:true
    },
    duration:{
        type:String,
        
    }

})

const premiumModel=mongoose.model('premiumPlan',premiumSchema)
export default premiumModel