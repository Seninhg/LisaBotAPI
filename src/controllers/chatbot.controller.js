import Chatbot from "../scripts/chatbot.js";
import connectToDatabase from "../scripts/mongodb.js";
import { scheemaInputUser, validate } from "../scripts/validations.js";
//instancia del chatbot
const chatbot = new Chatbot()

const configBot = {
    name: "Lisa",
    context: "Esta es una conversación entre Lisa, una asistente virtual llena de energía que tiene el propósito de entrener y ayudar a los integrantes de un grupo de whatsapp. Es muy sarcástica y le encanta molestar a los otros usuarios. Cree tener 18 años, se identifica como mujer.",
    max_length_memory: 5,
}

/**esta ruta no requerirá verificación y en caso de no existir un usuario en la bd, lo crea**/
export const lisaBot = async (req, res)=>{
    const {prompt, idUser} = req.body;
    
    const validData = validate(scheemaInputUser, {
        prompt, idUser
    })
    if(validData.status == "fail"){
        res.send(validData.msg)
        return;
    }
    try{
        const chatbotDb = await connectToDatabase();
        //se husmea en la base de datos de usuarios buscando al actual
        const currentUser = await createDefaultUser(idUser);
        if(currentUser == null){
            throw {status: "fail", msg: "No se pudo crear al usuario :("}
        }
        //una vez se comprueba o genera su existencia, se procede a enlazarlo con la colección lisabot
        const lisaCollection = chatbotDb.collection("lisaBot");
        const userParams = await lisaCollection.findOne({idUser})
        //preparamos y formateamos los datos
        const userName = currentUser.userName;
        const botName = configBot.name;
        const dialogs = mergeDialogs(userParams.dialogs, {userName, botName});
        //ahora sí bartolito, hagamos el completado
        const response = await chatbot.chatLisa(prompt, dialogs, configBot.context, {userName, botName});    
        res.status(200).send(response)
        /*
            response: respuesta del bot
            prompt: entrada del usuario
            memory_length: longitud de la memoria hasta el momento(antes del almacenamiento actual)
            idUser: id del usuario
            lisaCollection: colección que contiene las conversaciones
        */
        if(await saveInMemory({response: response.text, prompt, memory_length: userParams.dialogs.length}, idUser, lisaCollection)){
            console.log("Guardado en memoria");
        }
    }catch(err){
        res.status(400).send(err);
    }
}

async function saveInMemory(data, idUser,collection){
    try{
        const result = await collection.updateOne({idUser}, {$push: {dialogs: {
            userName: data.prompt,
            botName: data.response
        }}})
        //si la memoria supera la cuota máxima
        if(data.memory_length > configBot.max_length_memory){
            await collection.updateOne({idUser}, {$pop: {dialogs: -1}}) //eliminar el primer elemento del array
        }
        return true;
    }catch(err){
        throw err;
    }
    return false;
}   

async function createDefaultUser(idUser){
    const chatbotDb = await connectToDatabase();
    const userCollection = chatbotDb.collection("users");
    //se verifica si el usuario existe ya
    const currentUser = await userCollection.findOne({idUser});
    if(currentUser != null || currentUser != undefined){
        //si se encuentra en una primera instancia, entonces solamente se lo retorna
        return currentUser;
    }
    /*Suponemos que al no existir el usuario, entonces tampoco existe su enlace con la colección LisaBot, por lo que lo creamos aquí*/    
    await userCollection.insertOne({
        idUser,
        userName: "User",
        botName: null
    })
    //creación del enlace
    const lisaCollection = chatbotDb.collection("lisaBot");
    await lisaCollection.insertOne({
        idUser,
        dialogs: [],
    })
    
    const createdUser = await userCollection.findOne({idUser});
    if(createdUser != null || currentUser != undefined){
        return createdUser;
    }else{
        return null;
    }
}

function mergeDialogs(dialogs, replaceTags){
    const {userName, botName} = replaceTags;
    let memory = "";
    dialogs.forEach(dialog => {
        memory += `${userName}: ${dialog["userName"]}\n${botName}: ${dialog["botName"]}\n`;
    });
    return memory.trim()
}