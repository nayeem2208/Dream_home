import express from "express";
import { registerUser, check ,loginUser, forgotpassword, verifyOtp, resetPassword} from "../controllers/userController.js";

const router = express.Router();

router.post("/login",loginUser);
router.post("/signup", registerUser);
router.post('/forgot',forgotpassword)
router.post('/verifyotp',verifyOtp)
router.post('/resetpassword',resetPassword)
// router.get('/check',check)

export default router;
