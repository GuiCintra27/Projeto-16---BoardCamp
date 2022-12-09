import { Router } from "express";
import { getRentals, postRental, returnRental, deleteRental } from "../controllers/rentalsController.js";

const rentals = Router();

rentals.get("/rentals", getRentals);
rentals.post("/rentals", postRental);
rentals.post("/rentals/:id/return", returnRental);
rentals.delete("/rentals/:id", deleteRental);

export default rentals;