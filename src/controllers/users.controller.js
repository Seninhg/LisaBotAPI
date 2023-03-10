import connectToDatabase from "../scripts/mongodb.js";
import {scheemaUser, scheemaInputUser, scheemaPatchUser, validate} from "../scripts/validations.js";

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
    const validar = validate(scheemaInputUser, {idUser})
    if(validar.status == "fail"){
        res.send(validar.msg)
        return;
    }

    try{
        const chatbotDb = await connectToDatabase();
        const usersCollection = chatbotDb.collection("users");

        const result = await (usersCollection.findOne({idUser}))
        result == null?res.send({status: "fail", msg: "no se encuentra registrado dicho usuario"}):res.send(result);
    }catch(err){
        console.log(err)
        res.json(err);
    }
}
//crear nuevo usuario
/*El usuario se crea automáticamente con el uso de chatbotController, pero en caso de usarlo, esta ruta puede generarlo*/
export const setNewUser = async (req, res)=>{
    const {idUser, userName, botName} = req.body;

    const validar = validate(scheemaUser,{
        idUser, userName, botName
    })

    //se verifica que los datos no sean inválidos
    if(validar.status == "fail"){
        res.send(validar.msg)
        return;
    }
    try{
        const chatbotDb = await connectToDatabase();
        const usersCollection = chatbotDb.collection("users");
        //verificamos que no exista ya un usuario registrado con dicho id
        if(await usersCollection.findOne({idUser}) != null){
            res.send({status: "fail", msg: "El usuario ya se encuentra registrado"})
            return;
        }
        const result = await usersCollection.insertOne({
            idUser, userName, botName
        })
        res.send({status: "success",msg: "usuario ingresado con éxito: \nInsertId:" + result.insertedId});
    }catch(err){
        console.log(err);
        res.json(err);
    }
}
//borrar un usuario
export const deleteUser = async (req, res)=>{
    const idUser = req.params.idUser;
    const validar = validate(scheemaInputUser, {idUser})
    if(validar.status == "fail"){
        res.send(validar.msg)
        return;
    }
    try{
        const chatbotDb = await connectToDatabase();
        const usersCollection = chatbotDb.collection("users");

        const result = await usersCollection.findOneAndDelete({idUser: idUser});
        if(result.value == null || result.value == undefined){
            res.send({status: "fail", msg:"No se encontró al usuario pipipi"});
            return;
        }
        //si logra encontrarse y eliminar al usuario, podemos pasar a eliminar su enlace con LisaBot
        const lisaCollection = chatbotDb.collection("lisaBot");
        await lisaCollection.findOneAndDelete({idUser: idUser})
        /*No haria falta validar pues se supone que el usuario existe si llegó hasta acá*/
        const msg = {
            idUser: result.value.idUser,
            userName: result.value.userName
        };
        res.send({status: "success", msg})
    }catch(err){
        console.log(err);
        res.json(err);
    }
}

//modificar a un usuario
export const updateUser = async (req, res)=>{
    let {idUser, userName, botName} = req.body;
    const validar = validate(scheemaPatchUser, {
        idUser, userName, botName
    })
    if(validar.status == "fail"){
        res.send(validar.msg)
        return;
    }
    //reemplazo parcial de ciertos elementos
    try{
        const chatbotDb = await connectToDatabase();
        const usersCollection = chatbotDb.collection("users");
        
        //primero verificamos que exista el usuario que quieren modificar
        const originalUser = await usersCollection.findOne({idUser});
        if(originalUser == null){
            res.send({status: "fail", msg: "El usuario no se encuentra registrado"})
            return;
        }

        /*hasta ahora no encontré una mejor forma de hacerlo, en sql es mucho más facil :(*/
        if(userName == null){
            userName = originalUser.userName;
        }
        if(botName == null){
            botName = originalUser.botName;
        }
        
        //ahora sí  hacemos la actualización con los datos comprobados
        const result = await usersCollection.updateOne({idUser}, {
            $set: {userName, botName}
        })
        if(result.matchedCount == 1 && result.modifiedCount == 0){
            res.send({status: "fail", msg: "El usuario ya tiene esos datos 0_o"})
            return;
        }
        res.send({status: "succes", msg: "Usuario actualizado con éxito!"})
    }catch(err){
        console.log(err)
        res.json(err);
    }
}