import { config } from "dotenv";
config();

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "localhost";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || null;
const MONGO_HOST = process.env.MONGO_HOST || "mongodb://127.0.0.1:27017";


export {PORT, HOST, OPENAI_API_KEY, MONGO_HOST}