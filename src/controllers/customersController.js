import connection from "../database/database.js";

export async function getCustomers(req, res) {
    const { cpf } = req.query;

    if (!cpf) {
        const customers = await connection.query(`SELECT * FROM customers`);

        return res.send(customers.rows);
    }

    const customers = await connection.query(
        `SELECT * 
            FROM customers
            WHERE cpf LIKE $1`,
            [cpf + '%']
    );

    return res.send(customers.rows);
}

export async function getOneCustomer(req, res) {
    const { id } = req.params;

    const customers = await connection.query(
        `SELECT * 
            FROM customers
            WHERE id = $1`,
        [id]
    );

    return res.send(customers.rows);
}

export async function postCustomers(req, res) {
    const { name, phone, cpf, birthday } = req.body;

    await connection.query(
        `INSERT 
        INTO customers (name, phone, cpf, birthday) 
        VALUES ($1, $2, $3, $4)`,
        [name, phone, cpf, birthday]
    );

    return res.sendStatus(201);
}

export async function updateCustomers(req, res) {
    const {id} = req.params;
    const { name, phone, cpf, birthday } = req.body;

    await connection.query(
        `UPDATE customers 
        SET name = $1, phone = $2, cpf = $3, birthday = $4
        WHERE id = $5`,
        [name, phone, cpf, birthday, id]
    );

    return res.sendStatus(200);
}