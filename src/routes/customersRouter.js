import { Router } from "express";
import { getCustomers, getCustomersById, postCustomers, updateCustomers } from "../controllers/customersController.js";
import { customerValidation, getCustomersByIdValidation, getCustomersValidation, updateCustomerValidation } from "../middlewares/customersValidation.js";

const customers = Router();

customers.get("/customers", getCustomersValidation, getCustomers);
customers.get("/customers/:id", getCustomersByIdValidation, getCustomersById);
customers.post("/customers", customerValidation, postCustomers);
customers.put("/customers/:id", updateCustomerValidation, updateCustomers);

export default customers;