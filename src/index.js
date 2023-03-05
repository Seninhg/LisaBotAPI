import express from "express";
import {PORT, HOST} from "./config.js";
import indexRouter from "./routes/index.routes.js";
import chatbotRouter from "./routes/chatbot.routes.js";
import usersRouter from "./routes/users.routes.js";
import dialogsRouter from "./routes/dialogs.router.js";

const app = express();

//middleware para los request type app/json
app.use(express.json())


//rutas
app.use(indexRouter);
app.use("/api", chatbotRouter);
app.use("/api", usersRouter)
app.use("/api", dialogsRouter)

//middleware para endpoints no encontrados
app.use((req, res, next)=>{
    res.send({
        msg: "endpoint not found"
    })
})


app.listen(PORT, HOST, ()=>{
    console.log("Server running on " + `http://${HOST}:${PORT}`);
})