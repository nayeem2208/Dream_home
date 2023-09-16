import express from 'express'
import { adminLogin, adminLogout, check } from "../controllers/adminController.js";

const router=express.Router()

router.get('/',check)
router.post('/login',adminLogin)
router.post('/logout',adminLogout)

export default router
