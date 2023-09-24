import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import connectDB from './config/db.js'
import userRouter from './routes/userRoutes.js'
import adminRouter from './routes/adminRoutes.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
const app=express()
connectDB()

const port=process.env.PORT || 3001

app.use(express.static('backend/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.use('/',userRouter)
app.use('/admin',adminRouter)
const corsOptions = {
  origin: 'http://localhost:2000',
  // methods: ['GET', 'POST','PUT'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'], // Add 'Content-Type' to the list of allowed headers
};

app.use(cors(corsOptions));

app.listen(port,()=>{
  console.log(`server connected to ${port}`)
})