import { Router } from "express";
import { lisaBot} from "../controllers/chatbot.controller.js";

const router = Router()

router.post("/lisaBot", lisaBot)

export default router;