import express from 'express'
import { adminLogin, adminLogout, check, getUser, postBlock, userPost, userblockmanagement } from "../controllers/adminController.js";
import adminAuthcheck from '../middlewares/adminauth.js';

const router=express.Router()

router.get('/',check)
router.post('/login',adminLogin)
router.post('/logout',adminLogout)

router.get('/getpost',adminAuthcheck,userPost)
router.put('/blockPost',adminAuthcheck,postBlock)
router.get('/getUser',adminAuthcheck,getUser)
router.put('/userblockmanagement',adminAuthcheck,userblockmanagement)

export default router
