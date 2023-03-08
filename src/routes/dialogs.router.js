import {Router} from "express"
import { getDialogs } from "../controllers/dialogs.controller.js";

const router = Router()

router.get("/dialogs", getDialogs);
router.get("/dialogs/:id", );

export default router;