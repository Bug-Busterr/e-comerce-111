import mongoose from "mongoose";

export async function connectToDataBase(){
    const URL = process.env.MONGODB_URL;
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