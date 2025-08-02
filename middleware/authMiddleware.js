import jwt from "jsonwebtoken";
import User from "../models/userModel.js";


export const protect = async (req, res, next) =>{
    let token;

    // Check if Authorization header exists and starts with 'Bearer'

    if(req.headers.authorization
         && req.headers.authorization.startsWith("Bearer")){
        try{
            // Get token from header
            token = req.headers.authorization.split(" ")[1];

            // verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from decoded token and attach to request
            req.user = await User.findById(decoded.id).select("-password");
            next();
        }catch(error){
            console.error("Invalid token: ",error.message);
            return res.status(401).json({message :"Not authorized token failed"});
        }
    }
    if(!token){
         return res.status(401).json({ message: "Not authorized, no token provided" });
    }
}