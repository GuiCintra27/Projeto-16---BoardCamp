import { Router } from "express";
import { getRentals, returnRental, deleteRental, insertRental } from "../controllers/rentalsController.js";
import { deleteRentalValidation, getRentalsValidation, insertRentalValidation, returnRentalValidation } from "../middlewares/rentalsValidation.js";

const rentals = Router();

rentals.get("/rentals", getRentalsValidation, getRentals);
rentals.post("/rentals", insertRentalValidation, insertRental);
rentals.post("/rentals/:id/return", returnRentalValidation, returnRental);
rentals.delete("/rentals/:id", deleteRentalValidation, deleteRental);

export default rentals;