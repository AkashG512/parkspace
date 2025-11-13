import { z } from "zod";

export const createPricingRuleSchema = z.object({
  name: z.string().min(1, "Rule name is required"),
  scope: z.enum(["global", "city", "postalCodePrefix", "listingType", "feature"]),
  description: z.string().optional(),
  baseRate: z.number().positive("Base rate must be positive"),
  priority: z.number().int().default(100),
  isActive: z.boolean().default(true),
  conditions: z.object({
    cities: z.array(z.string()).optional(),
    postalCodePrefixes: z.array(z.string()).optional(),
    listingTypes: z.array(z.string()).optional(),
    features: z.array(z.string()).optional()
  }).default({}),
  adjustments: z.array(
    z.object({
      label: z.string().min(1, "Adjustment label is required"),
      type: z.enum(["percentage", "flat"]),
      amount: z.number(),
      appliesTo: z.string().optional()
    })
  ).default([])
});

export const updatePricingRuleSchema = createPricingRuleSchema.partial();

export const updatePlatformSettingsSchema = z.object({
  providerCommissionPercentage: z
    .number()
    .min(0, "Commission must be at least 0")
    .max(100, "Commission cannot exceed 100"),
  platformBookingFee: z.number().min(0, "Booking fee must be at least 0")
});

export const calculatePriceSchema = z.object({
  city: z.string().optional(),
  postalCode: z.string().optional(),
  listingType: z.string().optional(),
  features: z.array(z.string()).optional(),
  durationHours: z.number().positive("Duration must be positive")
});
