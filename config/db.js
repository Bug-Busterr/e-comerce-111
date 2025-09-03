import mongoose from "mongoose";

export async function connectToDataBase(){
    const URL = process.env.MONGODB_URL;
    
    const options = {
        serverSelectionTimeoutMS: 30000, // 30 seconds
        socketTimeoutMS: 45000, // 45 seconds
        bufferMaxEntries: 0,
        maxPoolSize: 10,
        minPoolSize: 5,
        maxIdleTimeMS: 30000,
        retryWrites: true,
        w: 'majority'
    };

    try{
        await mongoose.connect(URL, options);
        console.log('DataBase Connected Successfully');
        
        // Handle connection events
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });
        
        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });
        
        mongoose.connection.on('reconnected', () => {
            console.log('MongoDB reconnected');
        });
        
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err);
        throw err;
    }
}

export async function disconnectFromDataBase(){
    try{
        await mongoose.connection.close();
        console.log('Database disconnected successfully');
    } catch(err) {
        console.error('Error disconnecting from database:', err);
        throw err;
    }
}