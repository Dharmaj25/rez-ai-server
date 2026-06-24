import mongoose from "mongoose";

// mongoose.set("debug", true);

const ConnectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.DB_URI, {
            dbName: process.env.DB_NAME
        });

        console.log(`Database Connected: ${conn.connection.host}`);
    } catch (err) {
        console.log("Error occurred while connecting to database:", err);
        process.exit(1);
    }
};

export default ConnectDB;