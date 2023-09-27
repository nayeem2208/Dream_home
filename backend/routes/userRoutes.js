import express from "express";
import path from 'path'
import multer from 'multer'

import {
  registerUser,
  check,
  loginUser,
  forgotpassword,
  verifyOtp,
  resetPassword,
  googleAuth,
  googleLogin,
  logout,
  uploadPost,
  getPostforHome,
  uploadCoverPic,
  getUserProfile,
  editProfile,
  postlike,
  otherUserProfile,
  followManagement,
} from "../controllers/userController.js";
import authcheck from "../middlewares/auth.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination:(req,file,cb) => {
    cb(null, 'backend/public/images')
  },
  filename:(req,file,cb) => {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
  }
})


const upload = multer({ 
  storage: storage,

});


//-----authentication------ //
router.post("/login", loginUser);
router.post("/signup", registerUser);
router.post("/forgot", forgotpassword);
router.post("/verifyotp", verifyOtp);
router.post("/resetpassword", resetPassword);
router.post("/googleauth", googleAuth);
router.post("/googlelogin", googleLogin);
router.post('/logout',logout)

//----home page---//
router.get('/getpost',getPostforHome)
router.put('/uploadpost',upload.array('file'),uploadPost) 
router.put('/postlike',postlike)
router.put('/follow',followManagement)


//----Profile page-----//
router.put('/uploadcoverPic',upload.single('file'),uploadCoverPic)  //uploading cover pic in profile page
router.put('/editProfile',upload.single('file'),editProfile)
router.get('/getUserProfile',getUserProfile)       //getting user profile details to display
router.get('/othersProfile',otherUserProfile) 
router.get('/check',check)

export default router;
