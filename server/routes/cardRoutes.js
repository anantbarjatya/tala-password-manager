import express from "express";
import protect from "../middleware/authMiddleware.js";
import { getCards, addCard, revealCard, deleteCard } from "../controllers/cardController.js";

const router = express.Router();

router.use(protect);

router.get("/",           getCards);
router.post("/",          addCard);
router.get("/:id/reveal", revealCard);
router.delete("/:id",     deleteCard);

export default router;