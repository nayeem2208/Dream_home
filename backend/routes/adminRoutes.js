import express from 'express'
import { adminLogin, adminLogout, check, postBlock, userPost } from "../controllers/adminController.js";
import adminAuthcheck from '../middlewares/adminauth.js';

const router=express.Router()

router.get('/',check)
router.post('/login',adminLogin)
router.post('/logout',adminLogout)

router.get('/getpost',adminAuthcheck,userPost)
router.put('/blockPost',adminAuthcheck,postBlock)

export default router
