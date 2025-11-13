import { Router } from "express";
import {
  getPricingRules,
  createPricingRule,
  updatePricingRule,
  deletePricingRule,
  getPlatformSettings,
  updatePlatformSettings
} from "../../controllers/admin/pricingController.js";

const router = Router();

router.get("/rules", getPricingRules);
router.post("/rules", createPricingRule);
router.put("/rules/:ruleId", updatePricingRule);
router.delete("/rules/:ruleId", deletePricingRule);

router.get("/settings", getPlatformSettings);
router.put("/settings", updatePlatformSettings);

export default router;
