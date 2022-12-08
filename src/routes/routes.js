import { Router } from "express";
import categories from "./categoriesRouter";
import clients from "./ClientsRouter";
import games from "./gamesRouter";
import rents from "./rentsRouter";

const router = Router();

router.use(categories);
router.use(clients);
router.use(games);
router.use(rents);

export default router;