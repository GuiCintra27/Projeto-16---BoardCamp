import connection from "../database/database.js";
import { gamesModel } from "../models/gamesModel.js";

export async function getGamesValidation(req, res, next) {
    const { name } = req.query;

    if (name) {
        const games = await connection.query(`
            SELECT games.*, 
            categories.name as categoryName 
            FROM games 
            JOIN categories 
            ON games.categoryId = categories.id
            WHERE LOWER(games.name) LIKE $1`,
            [name + '%']
        );

        req.getGames = games.rows;
    } else {
        const games = await connection.query(`
            SELECT games.*, categories.name as categoryName 
            FROM games 
            JOIN categories 
            ON games.categoryId = categories.id;`
        );

        req.getGames = games.rows;
    }

    next();
}

export async function postGamesValidation(req, res, next){
    const { name, categoryId } = req.body;

    const categoryIdExists = await connection.query(`
    SELECT * 
    FROM categories
    WHERE id = $1`,
    [categoryId]
    );

    const {error} = gamesModel.validate(req.body, {abortEarly: false});

    if (error || categoryIdExists.rows.length === 0){
        return res.sendStatus(400);
    }

    const nameExists = await connection.query(`
    SELECT * 
    FROM games
    WHERE LOWER(name) = LOWER($1)`,
    [name]
    );

    if (nameExists.rows.length > 0){
        return res.sendStatus(409);
    }

    next();
}