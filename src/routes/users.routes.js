import { Router } from "express";
import { deleteUser, getUser, getUsers, setNewUser } from "../controllers/users.controller.js";


const router = Router();

router.get("/users", getUsers)
router.get("/users/:idUser", getUser)
router.post("/users", setNewUser)
router.delete("/users/:idUser", deleteUser)


export default router