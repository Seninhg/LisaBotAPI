import connectToDatabase from "../scripts/mongodb.js";
import {scheemaUser, idUserScheema} from "../scripts/validations.js";


//función que toma un esquema de modelo y luego valores a evaluar
function validate(scheema, values){
    const validate = scheema.validate(values);

    //si la validación retorna false entonces enviamos detalles
    if(validate.error != undefined){
        return {status: "fail", msg: validate.error.details[0]};
    }
    //sino simplemente un success
    return {status: "success"}
}

//obtener usuarios
export const getUsers = async (req, res)=>{
    try{
        const chatbotDb = await connectToDatabase();
        const usersCollection = chatbotDb.collection("users");

        const result = await (usersCollection.find({})).toArray()
        res.send(result);
    }catch(err){
        console.log(err)
        res.json(err);
    }
}
//obtener usuario por id
export const getUser = async (req, res)=>{
    //parámetro idUser
    const idUser = req.params.idUser;    
    //se valida con nuestra función el idUser
    const validar = validate(idUserScheema, {idUser})
    if(validar.status == "fail"){
        res.send(validar.msg)
        return;
    }

    try{
        const chatbotDb = await connectToDatabase();
        const usersCollection = chatbotDb.collection("users");

        const result = await (usersCollection.findOne({idUser}))
        res.send(result);
    }catch(err){
        console.log(err)
        res.json(err);
    }
}
//crear nuevo usuario
export const setNewUser = async (req, res)=>{
    const {idUser, userName, botName} = req.body;

    const validar = validate(scheemaUser,{
        userName, botName
    })

    //se verifica que los datos no sean inválidos
    if(validar.status == "fail"){
        res.send(validar.msg)
        return;
    }

    try{
        const chatbotDb = await connectToDatabase();
        const usersCollection = chatbotDb.collection("users");

        const result = await usersCollection.insertOne({
            idUser, userName, botName
        })

        res.send("usuario ingresado con éxito: \nInsertId:" + result.insertedId);
    }catch(err){
        console.log(err);
        res.json(err);
    }
    
}
//borrar un usuario
export const deleteUser = async (req, res)=>{
    const idUser = req.params.idUser;
    
    const validar = validate(idUserScheema, {idUser})
    if(validar.status == "fail"){
        res.send(validar.msg)
        return;
    }

    try{
        const chatbotDb = await connectToDatabase();
        const usersCollection = chatbotDb.collection("users");

        const result = await usersCollection.findOneAndDelete({idUser: idUser});
        if(result.value == null || result.value == undefined){
            res.send("No se encontró al usuario pipipi");
            return;
        }
        res.send("Usuario eliminado: \n" + JSON.stringify({
            idUser: result.value.idUser,
            userName: result.value.userName
        }))
    }catch(err){
        console.log(err);
        res.json(err);
    }
}