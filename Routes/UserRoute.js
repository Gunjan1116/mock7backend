
const express= require("express");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");
require("dotenv").config();
const {Usermodel} =require("../Models/UserModel");
const {authentication}=require("../Middlewares/authenticationMiddleware")
const userRoute=express.Router();

userRoute.get("/getProfile",authentication,async(req,res)=>{
    let userId=req.body.userId;

    try {
       let userDetails=await Usermodel.find({_id:userId});
       if(userDetails.length>0){
        res.json({"msg":`details of user id ${userId}`,"data":userDetails[0]})
       }else{
        res.json({"msg":`No data is there is database of id ${userId}`})
       }
    } catch (error) {
        console.log("error from getProfile route",error);
        res.json({"msg":"error in getting  a user details"})
    }
})

userRoute.post("/register",async(req,res)=>{
    const {Profile_picture,Name,Bio,Phone,Email,Password}=req.body;

    try {
        let reqData=await Usermodel.find({Email});
        if(reqData.length>0){
            return res.json({"msg":"You are already register"})
        }
        bcrypt.hash(Password,5,async(err,hash)=>{
            if(err){
                console.log("error from hashing password",err);
                res.json({"msg":"error from hashing password"})
            }else{
                let registerData=new Usermodel({Profile_picture,Name,Bio,Phone,Email,Password:hash});
                await registerData.save();
                res.json({"msg":"Successfully register"})
            }
        })
    } catch (error) {
        console.log("error from register route",error);
        res.json({"msg":"error in register a user"})
    }
})
userRoute.post("/login",async(req,res)=>{
    const {Email,Password}=req.body;
    try {
        let reqData=await Usermodel.find({Email});
        if(reqData.length==0){
            return res.json({"msg":"register first"})
        }else{
            bcrypt.compare(Password,reqData[0].Password,async(err,result)=>{
                if(result){
                    let token=jwt.sign({userId:reqData[0]._id},process.env.Key);
                    res.json({"msg":"Login Success","token":token})
                }else{
                    res.json({"msg":"Wrong Credentials"})
                }
            })
        }

    } catch (error) {
        console.log("error from login route",error);
        res.json({"msg":"error in login a user"})
    }
})

userRoute.patch("/editProfile",authentication,async(req,res)=>{
    let userId=req.body.userId;
    let Password1=req.body.Password;
    let payload=req.body;
    //console.log(payload)
    try {
        if(Password1!=undefined){
            
            bcrypt.hash(Password1,5,async(err,hash)=>{
                if(err){
                    console.log("error from hashing password in edit profile",err);
                    res.json({"msg":"error from hashing password in edit profile"})
                }else{
                    payload.Password=hash
                    await Usermodel.findByIdAndUpdate({_id:userId},payload)
                    res.json({"msg":"Successfully Updated the data"})
                }
            })
        }else{
            await Usermodel.findByIdAndUpdate({_id:userId},payload)
            res.json({"msg":"Successfully Updated the data"})
        }
        
    } catch (error) {
        console.log("error from edit user route",error);
        res.json({"msg":"error in editing a user details"})
    }
})

module.exports={
    userRoute
}

// "Profile_picture":"https://avatars.githubusercontent.com/u/112754725?v=4",
//     "Name":"gunjan",
//     "Bio":"student",
//     "Phone":999999999,
//     "Email":"g@gmail.com",
//     "Password":"1234"