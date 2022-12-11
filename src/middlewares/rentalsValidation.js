import dayjs from "dayjs";
import connection from "../database/database.js";
import { insertRentalModel } from "../models/rentalsModel.js";

const date = dayjs().format('YYYY-MM-DD');

export async function getRentalsValidation(req, res, next) {
    const { customerId, gameId } = req.query;
    const fetchData = [];

    async function findData(rentals) {
        for (let i = 0; i < rentals.rows.length; i++) {
            const customer = await connection.query(`
            SELECT id, name 
            FROM customers
            WHERE id = $1`,
                [rentals.rows[i].customerid]
            );

            const game = await connection.query(`
            SELECT games.id, games.name, games.categoryId, 
            categories.name AS categoryName 
            FROM games 
            JOIN categories 
            ON games.categoryId = categories.id
            WHERE games.id = $1`,
                [rentals.rows[i].gameid]
            );

            const data = await { ...rentals.rows[i], customer: customer.rows[0], game: game.rows[0] };

            fetchData.push(data)
        }
    }

    if (customerId && gameId) {
        const rentals = await connection.query(`
        SELECT * 
        FROM rentals
        WHERE customerId = $1
        AND gameId = $2`,
            [customerId, gameId]
        );

        await findData(rentals);
    } else if (customerId) {
        const rentals = await connection.query(`
        SELECT * 
        FROM rentals
        WHERE customerId = $1`,
            [customerId]
        );

        await findData(rentals);
    } else if (gameId) {
        const rentals = await connection.query(`
        SELECT * 
        FROM rentals
        WHERE gameId = $1`,
            [gameId]
        );

        await findData(rentals);
    } else {
        const rentals = await connection.query(`SELECT * FROM rentals`);

        await findData(rentals);
    }

    req.getRentals = fetchData;

    next();
}

export async function insertRentalValidation(req, res, next) {
    const { customerId, gameId } = req.body;

    const curstomerExists = await connection.query(`
    SELECT *
    FROM customers
    WHERE id = $1`,
        [customerId]
    );

    const gameExists = await connection.query(`
    SELECT *
    FROM games
    WHERE id = $1`,
        [gameId]
    );

    const { error } = insertRentalModel.validate(req.body, { abortEarly: false });

    if (error ||
        curstomerExists.rows.length === 0 ||
        gameExists.rows.length === 0) {
        return res.sendStatus(400);
    }

    const gameStock = gameExists.rows[0].stocktotal;

    const rentedGames = await connection.query(`
    SELECT 
    COUNT(*)
    FROM rentals
    WHERE gameId = $1`,
        [gameId]
    );

    if (rentedGames.rows[0].count >= gameStock) {
        return res.sendStatus(400);
    }

    let price = await connection.query(`SELECT pricePerDay FROM games WHERE id = $1`, [gameId]);

    price = price.rows[0].priceperday;

    req.price = price;

    next();
}

export async function returnRentalValidation(req, res, next) {
    const { id } = req.params;

    const rental = await connection.query(`
        SELECT rentDate, daysRented, gameId 
        FROM rentals 
        WHERE id = $1`,
        [id]
    );

    if (rental.rows.length === 0) {
        return res.sendStatus(400);
    }

    const dateNow = new Date(date);
    const rentDate = new Date(rental.rows[0].rentdate);
    const difference = Math.abs(dateNow.getTime() - rentDate.getTime());
    const daysUsed = Math.ceil(difference / (1000 * 60 * 60 * 24));

    if (daysUsed > rental.rows[0].daysrented) {
        const daysExceeded = daysUsed - rental.rows[0].daysrented;

        const pricePerDay = await connection.query(`
        SELECT pricePerDay
        FROM games
        WHERE id = $1`,
            [rental.rows[0].gameid]
        );

        const fine = pricePerDay.rows[0].priceperday;

        await connection.query(`
            UPDATE rentals
            SET returnDate = $1, delayFee = $2
            WHERE id = $3`,
            [date, fine*daysExceeded, id]
        );
    }else{
        await connection.query(`
            UPDATE rentals
            SET returnDate = $1, delayFee = 0
            WHERE id = $2`,
            [date, id]
        );
    }


    next();
}

export async function deleteRentalValidation(req, res, next) {
    const { id } = req.params;

    const rentalExists = await connection.query(`
    SELECT *
    FROM rentals 
    WHERE id = $1`,
        [id]
    );

    if (rentalExists.rows.length === 0) {
        return res.sendStatus(404);
    } else if (rentalExists.rows[0].returndate === null) {
        return res.sendStatus(400);
    }

    next();
}