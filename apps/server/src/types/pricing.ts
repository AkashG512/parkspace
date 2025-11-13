export interface PricingContext {
  city?: string;
  postalCode?: string;
  listingType?: string;
  features?: string[];
  durationHours: number;
}

export interface AppliedAdjustment {
  label: string;
  type: "percentage" | "flat";
  amount: number;
  valueImpact: number;
}

export interface PricingQuote {
  baseRatePerHour: number;
  durationHours: number;
  baseCost: number;
  adjustments: AppliedAdjustment[];
  adjustedBaseCost: number;
  providerCommissionPercentage: number;
  providerEarnings: number;
  platformBookingFee: number;
  ownerTotal: number;
}
