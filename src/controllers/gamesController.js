import connection from "../database/database.js";

export async function getGames(req, res) {
    const games = await connection.query(
        `SELECT games.*, categories.name as categoryName 
        FROM games 
        JOIN categories 
        ON games.categoryId = categories.id;`
    );
    return res.send(games.rows);
}

export async function postGames(req, res) {
    const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

    await connection.query(
        `INSERT INTO 
        games (name, image, stockTotal, categoryId, pricePerDay) 
        VALUES ($1, $2, $3, $4, $5)`, 
        [name, image, stockTotal, categoryId, pricePerDay]
    );

    return res.sendStatus(201);
}