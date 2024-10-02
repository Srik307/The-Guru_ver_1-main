const {callFlash}=require("../flash");
const { login } = require("./AuthController");


const AIchat=async(req,res)=>{
    return new Promise(async(resolve,reject)=>{
        const {question}=req.body;
        const response=await callFlash(question);
        console.log(response);
        resolve(res.status(200).json({response:response}));
    })
}


module.exports={AIchat};