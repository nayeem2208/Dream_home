const express=require('express')
const app=express()

app.get('/',(req,res)=>{
    res.send('hello nayeem')
})

app.listen(3000,()=>{
    'server connected'
})