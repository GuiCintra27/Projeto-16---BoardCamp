import { Router } from "express";
import { getGames, postGames } from "../controllers/gamesController.js";
import {getGamesValidation, postGamesValidation} from "../middlewares/gamesValidation.js";

const games = Router();

games.get("/games", getGamesValidation, getGames);
games.post("/games", postGamesValidation,postGames);

export default games;