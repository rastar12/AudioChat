import express from "express";
import cors from "cors";
import authRoutes from './router/Auth.router.js'

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


/*
import express from 'express';
import mongoose from 'mongoose';
import authRouter from './router/Auth.router.js'
import cookieParser from 'cookie-parser';

mongoose.connect("mongodb+srv://eugenechanzu:12345@cluster0.u4cht0m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(()=>{
  console.log("connected to mongodb");
}).catch((err)=>{
  console.log(err);
})
const app=express ();
app.use(express.json());
app.use(cookieParser());

app.listen(3000,()=>{ 
  console.log("connected to port 3000");
}
);

app.use('/api/auth',authRouter);
*/