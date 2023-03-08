import Joi from "joi";

export const scheemaUser = Joi.object({
    userName: Joi.string().min(3).alphanum().required(),
    botName: Joi.string().min(3).alphanum().required()
});

export const idUserScheema = Joi.object({
    idUser: Joi.string().min(9).required()
})
