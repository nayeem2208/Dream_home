import express from "express";
import { registerUser, check ,loginUser} from "../controllers/userController.js";

const router = express.Router();

router.post("/login",loginUser);
router.post("/signup", registerUser);
// router.get('/check',check)

export default router;
