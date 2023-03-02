import { config } from "dotenv";
config();

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "localhost";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || null;


export {PORT, HOST, OPENAI_API_KEY}