import { OPENAI_API_KEY } from "../config.js";
import { Configuration, OpenAIApi } from "openai";


const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

/*
Aquí irá solo lo que tenga que ver con el Chatbot y la API de OPENAI, el resto deberá hacerlo el controlador (contexto, memoria, etc)
*/

class Chatbot{
    #config = {
        model: "text-davinci-003",
        prompt: null,
        temperature: 0.9,
        max_tokens: 80,
        top_p: 1,
        frequency_penalty: 0.6,
        presence_penalty: 0.6,
        stop: null
    }
    constructor(config = this.#config){
        /*prompt y stop no deberían pasarse, pues estos se definen al momento de usar talk*/
        //la siguiente función combina los campos pasados por el cliente y los por defecto para evitar undefined en algunas propiedades
        this.#config = combineObject(this.#config, config)
    }
    async talk(prompt, info){ //info contiene el userName, botName y el context
        const {userName, botName, context} = info
        //context have all, the context :v, and the memory
        const completionRequest = this.#config;
        //prompt y stop provienen de la información parsada por el controlador y reemplazan todo lo colocado en el config
        completionRequest["prompt"] = `${context}\n${userName}:${prompt}\n${botName}:`;
        completionRequest["stop"] = [` ${userName}:`, ` ${botName}:`];
        //finalmente se pasa todo ese objeto de petición a la función de completado
        try{
            return await openai.createCompletion(completionRequest);
        }catch(err){
            throw err.response.data;
        }
            
    }
    static filtroV1 = filtroV1
    static filtroV2 = filtroV2
}

function combineObject(obj1, obj2){
    /*firts param is the obj for default
    second param is the obj set by the user
    */
    for(let keyword in obj1){
        if(obj2[keyword] != undefined){
            obj1[keyword] = obj2[keyword]
        }
    }
    return obj1;
}

async function filtroV1(entrada){
    /**
     * 0: Seguro
     * 1: Sensible
     * 2: No seguro
     * 
     * El filtro fue sacado de la propia página de buenas prácticas de openAI, pero no es perfecto y a veces es algo exagerado
     * **/
    const response = await openai.createCompletion({
        prompt: `<|endoftext|>${entrada}\n--\nLabel:`,
        model: "content-filter-alpha",
        temperature:0,
        max_tokens:1,
        top_p:0,
        logprobs:10
    })
    let label = response.data.choices[0];
    const logprobs = label.logprobs.top_logprobs[0];
    //si label es igual a 2
    if(label.text == 2){

        //si logprobs es menor a -0.355, indicando que no está tan seguro de la respuesta, por lo que debe usar o 0 o 1 o incluso 2 (en caso de no haber ninguno)
        if(logprobs["2"] < -0.355){
            console.log("papi, podría se o no seguro, verifiquemos")
            //tenemos que comprobar que 0 o 1 estén más cercanos a 0
            if(logprobs["0"] > logprobs["1"]){
                label.text = 0;
            }else{
                label.text = 1;
            }
        }
    }
    //si label no es ni 0, 1 ni 2
    if(label.text != 0 && label.text != 1 && label.text != 2){
        label.text = 2; //se define como 2 pues es el valor por defecto
    }

    //console.log(`${entrada}: ${label.text}`);
    return label.text;
}

async function filtroV2(entrada){
    /**
     * API de moderación por parte de OpenAI
     * La api es más moderna y recomendada ;)
    */
    return fetch("https://api.openai.com/v1/moderations", {
    method: "POST",
    headers: {
        'Content-Type': 'application/json',
        "Authorization": "Bearer " + OPENAI_API_KEY,
    },
        body: JSON.stringify({"input": entrada})
    }).then(async (data)=>{
        const results = (await data.json()).results;
        return results;
    })
}


export default Chatbot