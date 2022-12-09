import { Router } from "express";
import { getCategories, postCategories } from "../controllers/categoriesController.js";
import { categoriesValidation } from "../middlewares/categoriesValidation.js";

const categories = Router();

categories.get("/categories", getCategories);
categories.post("/categories", categoriesValidation ,postCategories);

export default categories;