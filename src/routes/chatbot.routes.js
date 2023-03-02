import { Router } from "express";
import { talk } from "../controllers/chatbot.controller.js";

const router = Router()

router.post("/talk", talk)

export default router;