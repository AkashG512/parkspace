import { Router } from "express";
import { calculatePrice } from "../../controllers/public/pricingController.js";

const router = Router();

router.post("/quote", calculatePrice);

export default router;
