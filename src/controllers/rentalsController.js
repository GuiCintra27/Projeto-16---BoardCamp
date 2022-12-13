import dayjs from "dayjs";
import connection from "../database/database.js";

const date = dayjs().format('YYYY-MM-DD');

export async function getRentals(req, res) {
    const rentals = req.getRentals;

    return res.send(rentals);
}

export async function insertRental(req, res) {
    const { customerId, gameId, daysRented } = req.body;

    const price = req.price;

    await connection.query(`
        INSERT 
        INTO rentals (
            "customerId", "gameId", "rentDate", "daysRented", "returnDate", 
            "originalPrice", "delayFee"
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [customerId, gameId, date, daysRented, null, price * daysRented, null]
    );

    return res.sendStatus(201);
}

export async function returnRental(req, res) {
    return res.sendStatus(200);
}

export async function deleteRental(req, res) {
    const { id } = req.params;

    await connection.query(`
        DELETE FROM rentals 
        WHERE id = $1`,
        [id]
    );

    return res.sendStatus(200);
}