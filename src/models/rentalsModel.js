import DateExtension from '@joi/date';
import Joi from 'joi';
const JoiDate = Joi.extend(DateExtension);

export const insertRentalModel = Joi.object({
    customerId: Joi.number().positive().required(),
    gameId: Joi.number().positive().required(),
    daysRented: Joi.number().positive().required()
});