import { Request, Response } from "express";
import { PricingRule } from "../../models/PricingRule.js";
import { PlatformSettings } from "../../models/PlatformSettings.js";
import {
  createPricingRuleSchema,
  updatePricingRuleSchema,
  updatePlatformSettingsSchema
} from "../../validators/pricing.js";

export const getPricingRules = async (_req: Request, res: Response) => {
  const rules = await PricingRule.find().sort({ priority: 1, createdAt: -1 });
  res.json(rules);
};

export const createPricingRule = async (req: Request, res: Response) => {
  const parseResult = createPricingRuleSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({ errors: parseResult.error.format() });
  }

  const rule = await PricingRule.create(parseResult.data);
  res.status(201).json(rule);
};

export const updatePricingRule = async (req: Request, res: Response) => {
  const { ruleId } = req.params;
  const parseResult = updatePricingRuleSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({ errors: parseResult.error.format() });
  }

  const rule = await PricingRule.findByIdAndUpdate(ruleId, parseResult.data, {
    new: true,
    runValidators: true
  });

  if (!rule) {
    return res.status(404).json({ message: "Pricing rule not found" });
  }

  res.json(rule);
};

export const deletePricingRule = async (req: Request, res: Response) => {
  const { ruleId } = req.params;
  const rule = await PricingRule.findByIdAndDelete(ruleId);

  if (!rule) {
    return res.status(404).json({ message: "Pricing rule not found" });
  }

  res.status(204).send();
};

export const getPlatformSettings = async (_req: Request, res: Response) => {
  const settings = await PlatformSettings.findOne();

  if (!settings) {
    const defaultSettings = await PlatformSettings.create({
      providerCommissionPercentage: 15,
      platformBookingFee: 99
    });

    return res.json(defaultSettings);
  }

  res.json(settings);
};

export const updatePlatformSettings = async (req: Request, res: Response) => {
  const parseResult = updatePlatformSettingsSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({ errors: parseResult.error.format() });
  }

  const settings = await PlatformSettings.findOneAndUpdate(
    {},
    { ...parseResult.data, lastUpdatedBy: (req as any).user?.id ?? "" },
    {
      new: true,
      upsert: true,
      runValidators: true
    }
  );

  res.json(settings);
};
