import { Router } from "express";
import categories from "./categoriesRouter.js";
import customers from "./customersRouter.js";
import games from "./gamesRouter.js";
import rentals from "./rentalsRouter.js";

const router = Router();

/* vericar a connetionstring */

router.use(categories);
router.use(customers);
router.use(games);
router.use(rentals);

export default router;