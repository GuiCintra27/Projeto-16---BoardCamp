import { categoriesModel } from "../models/categoriesModel.js";
import connection from "../database/database.js";

export async function categoriesValidation(req, res, next){
    const { name } = req.body;

    const {error} = categoriesModel.validate(req.body, {abortEarly: false});

    if (error){
        const errors = error.details.map((detail) => detail.message);
        return res.status(400).send(errors);
    }

    const isName = await connection.query(`
    SELECT * 
    FROM categories 
    WHERE name = $1`,
    [name]);

    if (isName.rows.length > 0){
        return res.sendStatus(409);
    }

    next();
}