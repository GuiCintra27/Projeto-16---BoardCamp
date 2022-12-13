import connection from "../database/database.js";
import { customersModel, updateCustomerModel } from "../models/customersModel.js";

export async function getCustomersValidation(req, res, next) {
    const { cpf } = req.query;

    if (!cpf) {
        const customers = await connection.query(`
        SELECT * 
        FROM customers`);

        req.getCustomers = customers.rows;
    } else {
        const customers = await connection.query(`
        SELECT * 
        FROM customers
        WHERE cpf 
        LIKE $1`,
            [cpf + '%']
        );

        req.getCustomers = customers.rows;
    }

    next();
}

export async function getCustomersByIdValidation(req, res, next) {
    const { id } = req.params;

    const customers = await connection.query(`
    SELECT * 
    FROM customers
    WHERE id = $1`,
        [id]
    );

    if (customers.rows.length === 0) {
        return res.sendStatus(404);
    }

    req.getCustomersById = customers.rows[0];

    next();
}

export async function customerValidation(req, res, next) {
    const { cpf } = req.body;

    const { error } = customersModel.validate(req.body, { abortEarly: false });

    const cpfExists = await connection.query(`
    SELECT * 
    FROM customers
    WHERE cpf = $1`,
        [cpf]
    );

    if (error) {
        return res.sendStatus(400);
    } else if (cpfExists.rows.length > 0) {
        return res.sendStatus(409);
    }

    next();
}

export async function updateCustomerValidation(req, res, next) {
    const { cpf } = req.body;
    const { id } = req.params;

    const { error } = updateCustomerModel.validate(req.body, { abortEarly: false });

    const cpfExists = await connection.query(`
    SELECT *
    FROM customers
    WHERE cpf = $1 
    AND id <> $2`,
        [cpf, id]
    );

    if (error) {
        return res.sendStatus(400);
    } else if (cpfExists.rows.length > 0) {
        return res.sendStatus(409);
    }

    next();
}