import connection from "../database/database.js";

export async function getCategories(req, res) {
    const categories = await connection.query(`SELECT * FROM categories`);
    return res.send(categories.rows);
}

export async function postCategories(req, res) {
    const { name } = req.body;

    await connection.query(`INSERT INTO categories (name) VALUES ($1)`, [name]);
    
    return res.sendStatus(201);
}