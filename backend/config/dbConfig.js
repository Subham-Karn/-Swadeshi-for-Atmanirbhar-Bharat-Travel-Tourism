import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URL;

const connectDB = async () => {
    if (!MONGO_URI) {
        console.error("MONGO_URL is not defined in your .env file");
        process.exit(1);
    }

    try {
        
        const conn = await mongoose.connect(MONGO_URI, {
            family: 4, 
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error("Connection Error Detail:");
        console.error(error.message);
        
        if (error.message.includes('querySrv')) {
            console.log("\n TIP: Your ISP/Network is blocking SRV records.");
            console.log("Try using the 'Standard Connection String' from Atlas instead of the short one.\n");
        }
        
        process.exit(1);
    }
};

export default connectDB;