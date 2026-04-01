import path from "path"
import dotenv from "dotenv"
dotenv.config({path:path.resolve(__dirname,"../../../.env")});

import express from "express"
import AuthRouter from "./authRouter";
const PORT = 4002;
const app = express();

app.use(express.json());

app.use("/api/v1/auth",AuthRouter);

app.get("/ping",(req,res)=>{
    res.json({
        msg:"pong"
    })
})

app.listen(PORT,()=>{
    console.log("Server is running on port: ",PORT)
})