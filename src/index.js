import express from "express";
import cors from "cors"
import {PORT, HOST} from "./config.js";
//rutas de la API
import indexRouter from "./routes/index.routes.js";
import chatbotRouter from "./routes/chatbot.routes.js";
import usersRouter from "./routes/users.routes.js";
import dialogsRouter from "./routes/dialogs.router.js";

const app = express();

//cors
app.use(cors())

//middleware para los request type app/json
app.use(express.json())


//rutas
app.use(indexRouter);
app.use("/api", chatbotRouter);
app.use("/api", usersRouter)
app.use("/api", dialogsRouter)

//middleware para endpoints no encontrados
app.use((req, res, next)=>{
    res.status(404).send({
        msg: "(404) endpoint not found"
    })
})

app.listen(PORT, HOST, ()=>{
    console.log("Server running on " + `http://${HOST}:${PORT}`);
})