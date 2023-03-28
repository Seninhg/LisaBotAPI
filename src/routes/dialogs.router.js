import {Router} from "express"
import { getDialogs, getDialog } from "../controllers/dialogs.controller.js";

const router = Router()

//ruta administrativa
router.get("/dialogs", getDialogs);
//ruta para usuarios
router.get("/dialogs/:idUser", getDialog);

export default router;