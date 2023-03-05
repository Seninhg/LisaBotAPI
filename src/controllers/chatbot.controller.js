import Chatbot from "../scripts/chatbot.js";
import connectToDatabase from "../scripts/mongodb.js";
//instancia del chatbot
const chatbot = new Chatbot()

function replaceNames(prompt, replaceInfo){
    //tokenizado a lo loco pa
    const tokens = prompt.split(" ");
    for (let token in tokens){
        for (let replaceTag in replaceInfo){
            tokens[token] = tokens[token].replace(`{${replaceTag}}`, replaceInfo[replaceTag]);
        }
    }
    //se los termina fucionando de nuevo
    return tokens.join(" ")
}

const max_length_memory = 5;

async function saveInMemory(data, usersCollection){
    const {prompt, text, idUser, length_memory} = data;
    try {
        //-------Almacenamiento en la memoria del bot--------
        await usersCollection.updateOne({idUser}, {
            $push: {conversations: {
                userName: prompt,
                botName: text
            }}
        })
        
        //verificación para el límite de memoria
        if(length_memory >= max_length_memory){
            const result = await usersCollection.updateOne({idUser}, {$pop: {conversations: -1}});
            if(result.modifiedCount == 1){
                console.log("Memory cleaned");
            }
        }    
    } catch (error) {
        throw error;
    }
}

function joinMemory(conversations, roles){
    let memory = "";
    conversations.forEach((conversation)=>{
        memory += `${roles.userName}: ${conversation.userName}\n${roles.botName}: ${conversation.botName}\n`;
    })
    return memory;
}

export const talk = async (req, res)=>{
    const {prompt, replaceTags, context, idUser} = req.body

    /* 
        Instrucciones:
        context debe por obligación al menos incluir el userName y botName
            estos 2 podemos obtenerlos de la base de datos a partir del idUser
            Una vez obtenidos se asignan a context
        userName y botName ya no se pasarán desde el cliente
        replaceTags contendrá opcionalmente ciertas etiquetas o variables para algunos nombres o datos que se pasarán al context, algo extraño pero funcional. Pero obligatoriamente se pasarán los datos obtenidos de la db a replaceTags para poder crear un buen context
    */

    try{
        const connect = await connectToDatabase();
        const usersCollection = connect.collection("users");

        //se hace la búsqueda del usuario por id
        const userFind = await usersCollection.findOne({idUser})
        //se añaden los nombres correspondientes
        replaceTags["userName"] = userFind.userName;
        replaceTags["botName"] = userFind.botName;

        //con el contexto pasado del cliente, reemplazamos aquellos campos proporcionados y especificados en replace tags
        const contextReplace = replaceNames(context, replaceTags)
        const {userName, botName} = replaceTags;

        //se obtiene la memoria de la consulta y se la formatea adecuadamente
        const memory = joinMemory(userFind.conversations, {userName, botName});

        ///luego creamos un objeto que contendrá lo necesario para hacer el completado
        const info = {
            userName: userName, botName: botName, context: contextReplace, memory
        }

        //finalmente le pasamos a nuestra función talk el prompt y la información y esperamos una respuesta, en caso de haber un error el catch lo captura y envía al usuario
        const result = await chatbot.talk(prompt, info);
        const {text} = result.data.choices[0];
        
        //se almacena en la memoria los datos necesarios
        await saveInMemory({prompt, text, idUser, length_memory: userFind.conversations.length}, usersCollection);

        //de ir todo bien, se envía la respuesta/texto al usuario
        res.send(text);


    }catch(err){
        console.log(err)
        res.json(err);
    }

}