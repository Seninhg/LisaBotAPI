import Joi from "joi";

export const scheemaUser = Joi.object({
    idUser: Joi.string().min(9).required(),
    userName: Joi.string().min(3).max(12).alphanum().required(),
    botName: Joi.string().min(3).max(12).alphanum().required()
});

export const scheemaInputUser = Joi.object({
    idUser: Joi.string().min(9).required(),
    prompt: Joi.string().min(1).max(70)
})

export const scheemaPatchUser = Joi.object({
    idUser: Joi.string().min(9).required(),
    userName: Joi.string().min(3).max(12).alphanum(),
    botName: Joi.string().min(3).max(12).alphanum()
});


//función que toma un esquema de modelo y luego valores a evaluar
export function validate(scheema, values){
    const validate = scheema.validate(values);
    //si la validación retorna false entonces enviamos detalles
    if(validate.error != undefined){
        return {status: "fail", msg: validate.error.details[0]};
    }
    //sino simplemente un success
    return {status: "success"}
}
