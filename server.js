import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors  from "cors";
import authRoutes from "./routes/authRoutes.js"
import videoRoutes from "./routes/videoRoutes.js"
import commentRoutes from "./routes/commentRoutes.js";
import { errorHandler } from "./middleware/errorMiddleware.js";


dotenv.config(); //load .env variable
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth",authRoutes);


// Videos Routes
app.use("/api/videos", videoRoutes);

// comment Router
app.use("/api/comments", commentRoutes);

//Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 8080

app.listen(PORT,()=>{
    console.log(`Server running on Port ${PORT}`)
});