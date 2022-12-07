const express=require('express')
const app=express();
app.get('/show',(req,res)=>{
    console.log(req.query);
    res.send("hello World!")
});
app.listen(3000,()=>{
    console.log("LIs");
})