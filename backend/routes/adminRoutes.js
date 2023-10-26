import express from 'express'
import { AddpremiumPlans, EditPremiumPlan, ToggleAcitveDeactivatePlan, adminLogin, adminLogout, check, getAllSales, getPremiumPlan, getUser, postBlock, userPost, userblockmanagement } from "../controllers/adminController.js";
import adminAuthcheck from '../middlewares/adminauth.js';

const router=express.Router()

router.get('/',check)
router.post('/login',adminLogin)
router.post('/logout',adminLogout)

router.get('/getpost',adminAuthcheck,userPost)
router.put('/blockPost',adminAuthcheck,postBlock)
router.get('/getUser',adminAuthcheck,getUser)
router.put('/userblockmanagement',adminAuthcheck,userblockmanagement)
router.get('/getPremium',adminAuthcheck,getPremiumPlan)
router.put('/addPremiumPlan',adminAuthcheck,AddpremiumPlans)
router.patch('/editPremiumPlan',adminAuthcheck,EditPremiumPlan)
router.post('/activateDeactivatePlan',adminAuthcheck,ToggleAcitveDeactivatePlan)
router.get('/getAllSales',adminAuthcheck,getAllSales)

export default router
