import { Router } from "express";
import { getCustomers, getOneCustomer, postCustomers, updateCustomers } from "../controllers/customersController.js";

const customers = Router();

customers.get("/customers", getCustomers);
customers.get("/customers/:id", getOneCustomer);
customers.post("/customers", postCustomers);
customers.put("/customers/:id", updateCustomers);

export default customers;