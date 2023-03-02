import Chatbot from "../scripts/chatbot.js";
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

export const talk = async (req, res)=>{
    const {prompt, userName, botName, replaceTags, context, userId} = req.body
    //con el contexto pasado del cliente, reemplazamos aquellos campos proporcionados y especificados en replace tags
    const contextReplace = replaceNames(context, replaceTags)
    ///luego creamos un objeto que contendrá lo necesario para hacer el completado
    const info = {
        userName, botName, context: contextReplace
    }
    //finalmente le pasamos a nuestra función talk el prompt y la información y esperamos una respuesta, en caso de haber un error el catch lo captura y envía al usuario
    try{
        const result = await chatbot.talk(prompt, info);
        const {text} = result.data.choices[0];
        res.send(text)
    }catch(err){
        res.json(err);
    }
}