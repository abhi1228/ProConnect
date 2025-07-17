import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import postsRouter from "./routes/posts.routes.js";
import userRouter from "./routes/user.routes.js";

dotenv.config();
const app =express();
app.use(cors());
app.use(express.static("uploads"));

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(userRouter);
app.use(postsRouter);





const start=()=>{
    const connect= mongoose.connect(process.env.DBURL);

    mongoose.connection.on("connected",()=>{
        console.log("MongoDB connected successfully");
    });

    app.listen(9080,()=>{
        console.log("Server is running on port 9080");
    })
};

start();