import asyncHandler from 'express-async-handler'
import usermodel from '../modals/userModal'

const registerUser=asyncHandler(async(req,res)=>{
    try {
        const {username,email,phone,password}=req.body
    
        let userExist= await usermodel.findOne({email})
        if(userExist){
            res.status(400)
            throw new error('user already exist')
        }
        const user=await usermodel.create({
            username,
            email,
            phone
        })
        
    } catch (error) {
        
    }

})