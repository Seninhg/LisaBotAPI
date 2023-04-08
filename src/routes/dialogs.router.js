import {Router} from "express"
import { getDialogs, getDialog, deleteDialogs } from "../controllers/dialogs.controller.js";

const router = Router()

//-------------------rutas administrativas-------------------
router.get("/dialogs", getDialogs);

router.delete("/dialogs/:idUser", deleteDialogs);

router.get("/dialogs/:idUser", getDialog);


export default router;