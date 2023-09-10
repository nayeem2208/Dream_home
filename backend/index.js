import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import connectDB from './config/db.js'
import userRouter from './routes/userRoutes.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
const app=express()
connectDB()

const port=process.env.PORT || 3001

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use('/',userRouter)
app.use(cors({ origin: "http://localhost:2000", credentials: true }));

app.listen(port,()=>{
  console.log(`server connected to ${port}`)
})