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

router.post("/login", loginUser);
router.post("/signup", registerUser);
router.post("/forgot", forgotpassword);
router.post("/verifyotp", verifyOtp);
router.post("/resetpassword", resetPassword);
router.post("/googleauth", googleAuth);
router.post("/googlelogin", googleLogin);
router.post('/logout',logout)
router.get('/getpost',authcheck,getPostforHome)
router.put('/uploadpost',upload.array('file'),uploadPost)
router.get('/check',check)

export default router;
