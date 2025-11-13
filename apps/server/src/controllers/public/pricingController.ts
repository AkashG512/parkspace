import { Request, Response } from "express";
import { pricingEngine } from "../../services/pricingEngine.js";
import { calculatePriceSchema } from "../../validators/pricing.js";

export const calculatePrice = async (req: Request, res: Response) => {
  const parseResult = calculatePriceSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({ errors: parseResult.error.format() });
  }

  try {
    const quote = await pricingEngine.calculatePrice(parseResult.data);
    res.json(quote);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to calculate price";
    res.status(500).json({ message });
  }
};
