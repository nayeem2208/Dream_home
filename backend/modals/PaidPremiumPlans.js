import mongoose from "mongoose";

const PremiumPaidPlans=mongoose.Schema({
    createdAT:{
        type:Date,
        default:Date.now
    },
    UserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users'
    },
    planId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Premiumplans'
    },
    Expiry:{
        type:Date
    },
    Amount:{
        type:Number
    }

})

const premiumPaidModel=mongoose.model('PaidPremiums',PremiumPaidPlans)
export default premiumPaidModel