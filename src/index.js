import express from "express";
import {PORT, HOST} from "./config.js";
import indexRouter from "./routes/index.routes.js";
import chatbotRouter from "./routes/chatbot.routes.js";
import usersRouter from "./routes/users.routes.js";

const app = express();

//middleware para los request type app/json
app.use(express.json())


//rutas
app.use(indexRouter);
app.use("/api", chatbotRouter);
app.use("/api", usersRouter)


app.listen(PORT, HOST, ()=>{
    console.log("Server running on " + `http://${HOST}:${PORT}`);
})