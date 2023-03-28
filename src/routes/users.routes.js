import { Router } from "express";
import { deleteUser, getUser, getUsers, setNewUser, updateUser } from "../controllers/users.controller.js";


const router = Router();

//obtener todos los usuarios
router.get("/users", getUsers)
//obtener usuario por ID
router.get("/users/:idUser", getUser)
//crear nuevo usuario
router.post("/users", setNewUser)
//eliminar usuario
router.delete("/users/:idUser", deleteUser)
//modificar usuario
router.patch("/users", updateUser)


export default router