import Joi from "joi";

export const categoriesModel = Joi.object({
    name: Joi.string().required()
});