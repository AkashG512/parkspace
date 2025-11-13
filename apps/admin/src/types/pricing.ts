export type PricingScope =
  | "global"
  | "city"
  | "postalCodePrefix"
  | "listingType"
  | "feature";

export type AdjustmentType = "percentage" | "flat";

export interface Adjustment {
  label: string;
  type: AdjustmentType;
  amount: number;
  appliesTo?: string;
}

export interface PricingRule {
  _id: string;
  name: string;
  scope: PricingScope;
  description?: string;
  baseRate: number;
  priority: number;
  isActive: boolean;
  conditions: {
    cities?: string[];
    postalCodePrefixes?: string[];
    listingTypes?: string[];
    features?: string[];
  };
  adjustments: Adjustment[];
  createdAt: string;
  updatedAt: string;
}

export interface PlatformSettings {
  _id: string;
  providerCommissionPercentage: number;
  platformBookingFee: number;
  lastUpdatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePricingRuleInput {
  name: string;
  scope: PricingScope;
  description?: string;
  baseRate: number;
  priority?: number;
  isActive?: boolean;
  conditions?: {
    cities?: string[];
    postalCodePrefixes?: string[];
    listingTypes?: string[];
    features?: string[];
  };
  adjustments?: Adjustment[];
}

export interface UpdatePricingRuleInput extends Partial<CreatePricingRuleInput> {}

export interface UpdatePlatformSettingsInput {
  providerCommissionPercentage?: number;
  platformBookingFee?: number;
}
