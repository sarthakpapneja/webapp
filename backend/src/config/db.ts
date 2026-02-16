import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

const connectDB = async () => {
    try {
        let uri = process.env.MONGO_URI;

        if (!uri) {
            if (process.env.NODE_ENV === 'production') {
                throw new Error('MONGO_URI is not defined in environment variables');
            }
            console.log('MONGO_URI not found, starting in-memory MongoDB...');
            const mongod = await MongoMemoryServer.create();
            uri = mongod.getUri();
            console.log(`MongoDB Memory Server started at ${uri}`);
        }

        const conn = await mongoose.connect(uri);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Error: ${error.message}`);
        } else {
            console.error(`Error: ${String(error)}`);
        }
        process.exit(1);
    }
};

export default connectDB;
