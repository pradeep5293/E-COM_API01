
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const url = process.env.DB_URL;
console.log("URL: "+url);

let client;
export const connectToMongoDB = ()=>{
    MongoClient.connect(url)
        .then(clientInstance=>{
            client=clientInstance
            console.log("Mongodb is connected");
            createCounter(client.db());
            createIndexes(client.db());
        })
        .catch(err=>{
            console.log(err);
        })
    
}
export const getClient=()=>{
    return client;
}

export const getDB = ()=>{
    return client.db();
}

const createCounter = async(db)=>{
    const existingCounter=await db.collection("counters").findOne({_id:'cartItemId'});
    if(!existingCounter){
        await db.collection("counters").insertOne({_id:'cartItemId', value:0});
    }
}
const createIndexes=async(db)=>{
try{
    await db.collection("products").createIndex({price:1})    //single base indexes
    await db.collection("products").createIndex({name:1,category:-1})   //compound based indexes
    await db.collection("products").createIndex({desc:"text"})        //text based indexes
}catch(err){
    console.log(err);
}
console.log("Index is created");
}