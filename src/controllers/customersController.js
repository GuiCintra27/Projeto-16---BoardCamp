import connection from "../database/database.js";

export async function getCustomers(req, res) {
    const customers = req.getCustomers

    return res.send(customers);
}

export async function getCustomersById(req, res) {
    const customers = req.getCustomersById;

    return res.send(customers);
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