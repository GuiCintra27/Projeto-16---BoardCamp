import dayjs from "dayjs";
import connection from "../database/database.js";

const date = dayjs().format('YYYY-MM-DD');

export async function getRentals(req, res) {
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

    if(customerId && gameId){
        const rentals = await connection.query(`
        SELECT * 
        FROM rentals
        WHERE customerId = $1
        AND gameId = $2`,
        [customerId, gameId]
        );

        await findData(rentals);
    }else if (customerId) {
        const rentals = await connection.query(`
        SELECT * 
        FROM rentals
        WHERE customerId = $1`,
        [customerId]
        );

        await findData(rentals);
    }else if (gameId){
        const rentals = await connection.query(`
        SELECT * 
        FROM rentals
        WHERE gameId = $1`,
        [gameId]
        );

        await findData(rentals);
    }else{
        const rentals = await connection.query(`SELECT * FROM rentals`);
    
        await findData(rentals);
    }


    return res.send(fetchData);
}

export async function postRental(req, res) {
    const { customerId, gameId, daysRented } = req.body;

    let price = await connection.query(`SELECT pricePerDay FROM games WHERE id = $1`, [gameId]);

    price = price.rows[0].priceperday;

    await connection.query(`
        INSERT 
        INTO rentals (
            customerId, gameId, rentDate, daysRented, returnDate, 
            originalPrice, delayFee
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [customerId, gameId, date, daysRented, null, price * daysRented, null]
    );

    return res.sendStatus(201);
}

export async function returnRental(req, res) {
    const { id } = req.params;

    let rental = await connection.query(`
        SELECT rentDate 
        FROM rentals 
        WHERE id = $1`,
        [id]
    );

    const rentDate = String(rental.rows[0].rentdate);

    const isFalse = rentDate.substring(8, 10) === date.substring(8, 10);

    console.log(isFalse)
    if (!isFalse) {
        const dayrented = Number(rentDate.substring(8, 10));
        const day = Number(date.substring(8, 10));

        console.log(dayrented)

        await connection.query(`
            UPDATE rentals
            SET returnDate = $1, delayFee = $2
            WHERE id = $3`,
            [date, id]
        );

        return res.send(200);
    }

    await connection.query(`
        UPDATE rentals
        SET returnDate = $1, delayFee = 0
        WHERE id = $2`,
        [date, id]
    );

    return res.send(200);
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