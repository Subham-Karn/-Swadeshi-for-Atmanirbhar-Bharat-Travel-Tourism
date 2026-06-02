import "dotenv/config.js"
import express from "express";
import cors from "cors";
import connectDb from "./config/dbConfig.js";
import AuthRoutes from "./routes/AuthRoutes.js";
import PlaceRoutes from "./routes/PlaceRoute.js";
import DestinationRoutes from "./routes/DestinationRoute.js";
import StateRoutes from "./routes/StateRoutes.js";
import CitiesRoutes from "./routes/CityRoutes.js";
import HotelsRoutes from "./routes/HotelsRoutes.js";
import TransportRoutes from "./routes/TransportRoutes.js"
import TripsRoutes from "./routes/TripRoute.js";
import morgan from "morgan";
const app = express();
connectDb();
const PORT = process.env.PORT;

const ALLOWED_ORIGIN = process.env.FRONTEND_URL;

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (origin === ALLOWED_ORIGIN) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"))
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin && ALLOWED_ORIGIN.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
    } else if (origin) {
        return res.status(403).json({
            success: false,
            message: "CORS blocked: Unauthorized origin"
        });
    }
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }

    next();
});

app.get("/" , (req , res)=>{
    res.status(200).json({
        success: true,
        message: "Welcome to Bharat Darshan Server"
    })
})
app.use("/api/v1/auth" , AuthRoutes);
app.use("/api/v1/states" , StateRoutes);
app.use("/api/v1/cities" , CitiesRoutes);
app.use("/api/v1/places" , PlaceRoutes);
app.use("/api/v1/destinations", DestinationRoutes);
app.use("/api/v1/hotels", HotelsRoutes);
app.use("/api/v1/transports", TransportRoutes);
app.use("/api/v1/trips", TripsRoutes);

app.listen(PORT , ()=>{
    console.log(`http://localhost:${PORT}`);
})