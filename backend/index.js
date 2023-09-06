import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import connectDB from './config/db.js'
import userRouter from './routes/userRoutes.js'
import cookieParser from 'cookie-parser'
const app=express()
connectDB()

const port=process.env.PORT || 3001

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use('/',userRouter)

app.listen(port,()=>{
  console.log(`server connected to ${port}`)
})