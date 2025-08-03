import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

export const registerUser = async(req,res,next)=>{
    try{
        const {name,email,password} = req.body;

        const userExist = await User.findOne({email});
        if(userExist){
            return res.status(400).json({field: "email", message: "Email already registered"});

        }

        const user = await User.create({name,email,password});

       return res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            avatar:user.avatar,
            token:generateToken(user._id),
        });
    }catch(error){
        next(error); //error handler middleware ko handover karo
    }
};


// Login controller

export const loginUser = async(req,res,next)=>{
    try{
        const {email,password} = req.body;
        
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({field:"email",message:"Email not found"});
        }

        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(401).json({field:"password",message:"Incorrect password"});
        }

        return res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            token: generateToken(user._id),
        });
    }catch(error){
        next(error);
    }
};