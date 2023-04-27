const mongoose=require("mongoose");

const userSchema=mongoose.Schema({
    Profile_picture:{type:String,require:true},
    Name:{type:String,require:true},
    Bio:{type:String,require:true},
    Phone:{type:Number,require:true},
    Email:{type:String,require:true},
    Password:{type:String,require:true},
})

const Usermodel=mongoose.model("user",userSchema);

module.exports={
    Usermodel
}