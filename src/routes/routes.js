import { Router } from "express";
import categories from "./categoriesRouter.js";
import clients from "./clientsRouter.js";
import games from "./gamesRouter.js";
import rentals from "./rentalsRouter.js";

const router = Router();

/* vericar a connetionstring */

router.use(categories);
router.use(clients);
router.use(games);
router.use(rentals);

export default router;