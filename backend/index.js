import "dotenv/config.js"
import express from "express";
import cors from "cors";
import connectDb from "./config/dbConfig.js";
import AuthRoutes from "./routes/AuthRoutes.js";
const app = express();
connectDb();
const PORT = process.env.PORT;

const ALLOWED_ORIGIN = [
  "http://localhost:2000",
  "https://bharatdarshan-flame.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (ALLOWED_ORIGIN.includes(origin)) {
        return callback(null, origin); 
      }

      return callback(new Error("Not allowed by CORS")); 
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.use("/api/auth" , AuthRoutes);

app.listen(PORT , ()=>{
    console.log(`http://localhost:${PORT}`);
})