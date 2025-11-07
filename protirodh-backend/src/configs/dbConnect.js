import mongoose from "mongoose";
import dotenv from "dotenv";
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI || !process.env.DB_NAME) {
            
            throw new Error('MongoDB connection URL or DB_NAME not found in environment variables');
        }

        // Remove any existing database name from MONGO_URI if present
        
        
        console.log(`Attempting to connect to database: ${process.env.DB_NAME}`);

        const connectionInfo = await mongoose.connect(process.env.MONGO_URI, {
            dbName: process.env.DB_NAME // Explicitly set database name
        });

        if (connectionInfo.connection.db.databaseName !== process.env.DB_NAME) {
            throw new Error(`Connected to wrong database: ${connectionInfo.connection.db.databaseName}`);
        }

        console.log(`\n MongoDB Connected Successfully!`);
        console.log(`DBHOST: ${connectionInfo.connection.host}`);
        console.log(`Database: ${connectionInfo.connection.db.databaseName}`);

    } catch (error) {
        console.error("DB Connection failed:", error.message);
        process.exit(1);
    }
};

export default connectDB;