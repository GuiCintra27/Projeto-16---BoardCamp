import DateExtension from '@joi/date';
import Joi from 'joi';
const JoiDate = Joi.extend(DateExtension);

export const customersModel = Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().pattern(new RegExp('^[0-9]{10,11}$')),
    cpf: Joi.string().pattern(new RegExp('^[0-9]{11}$')),
    birthday: JoiDate.date().format('YYYY-MM-DD').required()
});

export const updateCustomerModel = Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().pattern(new RegExp('^[0-9]{10,11}$')),
    cpf: Joi.string().pattern(new RegExp('^[0-9]{11}$')),
    birthday: JoiDate.date().required()
});