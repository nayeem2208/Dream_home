import express from 'express'
import { adminLogin, adminLogout, check, postBlock, userPost } from "../controllers/adminController.js";

const router=express.Router()

router.get('/',check)
router.post('/login',adminLogin)
router.post('/logout',adminLogout)

router.get('/getpost',userPost)
router.put('/blockPost',postBlock)

export default router
