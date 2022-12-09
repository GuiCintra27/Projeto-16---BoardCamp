import Joi from "joi";

export const gamesModel = Joi.object({
    name: Joi.string().required(),
    image: Joi.string().required(),
    stockTotal: Joi.number().positive().required(),
    categoryId: Joi.number().positive().required(),
    pricePerDay: Joi.number().positive().required()
});