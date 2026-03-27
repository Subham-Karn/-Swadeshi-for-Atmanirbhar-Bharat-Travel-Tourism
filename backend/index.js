import "dotenv/config.js"
import express from "express";
import cors from "cors";

const app = express();

const PORT = process.env.PORT;

const ALLOWED_ORIGIN = [
   "http://localhost:2000",
];

app.use(cors({
    origin: function (origin , callback){
        if(!origin) return callback(null , true)
        if(ALLOWED_ORIGIN.includes(origin)){
            return callback(null , true)
        }
        console.warn(`This ${origin} tried to access your server`)
        return callback(null , false)
    }
}));

app.use((req , res , next)=>{
    const origin = req.headers.origin;
    if(origin && !ALLOWED_ORIGIN.includes(origin)){
        return res.status(403).json({
            success:false,
            message: "CORS blocked: Unauthorized origin"
        })
    }
    next()
})

app.get("/" , (req , res)=>{
    res.status(200).json({
        success: true,
        message: "Welcome to Bharat Darshan Server"
    })
})

app.listen(PORT , ()=>{
    console.log(`http://localhost:${PORT}`);
})