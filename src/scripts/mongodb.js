import {MongoClient } from "mongodb";
import { MONGO_HOST } from "../config.js";


const uri = MONGO_HOST;

async function connect(){
    const client = new MongoClient(uri);
    try{
        await client.connect()
        //console.log("conected to mongodb");
        return client.db("chatbot_db")
    }catch(err){        
        throw {msg: "No se pudo conectar a la base de datos", content: err};
    }
}

export default connect;