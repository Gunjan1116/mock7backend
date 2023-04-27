const express=require("express");
require("dotenv").config();
const { connection } = require("./Config/db");
const { userRoute } = require("./Routes/UserRoute");
const cors=require("cors");

const app=express();

app.use(cors());

app.use(express.json());

app.get("/",(req,res)=>{
    req.headers.authorization
    res.send("Welcome to User Api")
})

app.use("/",userRoute)

app.listen(process.env.Port,async()=>{
    try {
        await connection;
        console.log("Connected to DB");
    } catch (error) {
        console.log("Error while connecting to DB");
        console.log(error);
    }
    console.log(`Server is running at port ${process.env.Port}`)
})