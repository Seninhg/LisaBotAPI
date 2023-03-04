import Joi from "joi";

export const scheemaUser = Joi.object({
    userName: Joi.string().min(3).alphanum().required(),
    botName: Joi.string().min(3).alphanum().required(),
    conversations: Joi.array().items(Joi.object({
        user: Joi.string(),
        bot: Joi.string()
    }))
});

export const idUserScheema = Joi.object({
    idUser: Joi.string().min(9).required()
})