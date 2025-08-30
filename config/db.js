import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const URL = process.env.MONGODB_URL;

export async function connectToDataBase(){
    try{
        await mongoose.connect(URL);
        console.log('DataBase Connected Successfully');
    }
    catch (err){
        throw err;
    }
}

export async function disconnectFromDataBase(){
    try{
        await mongoose.connection.close();
    }
    catch(err){
        throw err;
    }
}