import express from 'express'
const app=express()
import dotenv from 'dotenv'
dotenv.config()
import connectDB from './config/db.js'

connectDB()

const port=process.env.PORT || 3001
app.get('/',(req,res)=>{
    res.send('hello nayeem')
})

app.listen(port,()=>{
  console.log(`server connected to ${port}`)
})