import { PricingRule } from "../models/PricingRule.js";
import { PlatformSettings } from "../models/PlatformSettings.js";
import {
  PricingContext,
  PricingQuote,
  AppliedAdjustment
} from "../types/pricing.js";

export class PricingEngine {
  async calculatePrice(context: PricingContext): Promise<PricingQuote> {
    const rules = await PricingRule.find({ isActive: true }).sort({
      priority: 1
    });
    const settings = await PlatformSettings.findOne();

    if (!settings) {
      throw new Error("Platform settings not initialized");
    }

    let applicableRule = rules.find((rule) => {
      if (rule.scope === "global") return true;

      if (
        rule.scope === "city" &&
        context.city &&
        rule.conditions.cities?.includes(context.city)
      ) {
        return true;
      }

      if (
        rule.scope === "postalCodePrefix" &&
        context.postalCode &&
        rule.conditions.postalCodePrefixes?.some((prefix) =>
          context.postalCode!.startsWith(prefix)
        )
      ) {
        return true;
      }

      if (
        rule.scope === "listingType" &&
        context.listingType &&
        rule.conditions.listingTypes?.includes(context.listingType)
      ) {
        return true;
      }

      return false;
    });

    if (!applicableRule) {
      applicableRule = rules.find((rule) => rule.scope === "global");
    }

    if (!applicableRule) {
      throw new Error("No pricing rules configured");
    }

    const baseRatePerHour = applicableRule.baseRate;
    const baseCost = baseRatePerHour * context.durationHours;

    const appliedAdjustments: AppliedAdjustment[] = [];
    let adjustedBaseCost = baseCost;

    for (const adjustment of applicableRule.adjustments) {
      let shouldApply = false;

      if (adjustment.appliesTo === "listingType") {
        shouldApply = adjustment.appliesTo === context.listingType;
      } else if (adjustment.appliesTo && context.features?.length) {
        shouldApply = context.features.includes(adjustment.appliesTo);
      } else {
        shouldApply = true;
      }

      if (shouldApply) {
        let valueImpact = 0;

        if (adjustment.type === "percentage") {
          valueImpact = (adjustedBaseCost * adjustment.amount) / 100;
        } else {
          valueImpact = adjustment.amount * context.durationHours;
        }

        adjustedBaseCost += valueImpact;

        appliedAdjustments.push({
          label: adjustment.label,
          type: adjustment.type,
          amount: adjustment.amount,
          valueImpact
        });
      }
    }

    const providerCommissionPercentage =
      settings.providerCommissionPercentage;
    const commissionAmount =
      (adjustedBaseCost * providerCommissionPercentage) / 100;
    const providerEarnings = adjustedBaseCost - commissionAmount;
    const platformBookingFee = settings.platformBookingFee / 100;
    const ownerTotal = adjustedBaseCost + platformBookingFee;

    return {
      baseRatePerHour,
      durationHours: context.durationHours,
      baseCost: Math.round(baseCost * 100) / 100,
      adjustments: appliedAdjustments,
      adjustedBaseCost: Math.round(adjustedBaseCost * 100) / 100,
      providerCommissionPercentage,
      providerEarnings: Math.round(providerEarnings * 100) / 100,
      platformBookingFee,
      ownerTotal: Math.round(ownerTotal * 100) / 100
    };
  }
}

export const pricingEngine = new PricingEngine();
