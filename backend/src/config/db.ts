import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

const connectDB = async () => {
    try {
        const mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();

        console.log(`MongoDB Memory Server started at ${uri}`);

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
