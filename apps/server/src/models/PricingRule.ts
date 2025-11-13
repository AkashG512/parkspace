import mongoose, { Schema, Document, Model } from "mongoose";

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

export interface PricingRuleAttributes {
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
}

export interface PricingRuleDocument
  extends PricingRuleAttributes,
    Document {
  createdAt: Date;
  updatedAt: Date;
}

const AdjustmentSchema = new Schema<Adjustment>(
  {
    label: { type: String, required: true },
    type: {
      type: String,
      enum: ["percentage", "flat"],
      required: true
    },
    amount: { type: Number, required: true },
    appliesTo: { type: String }
  },
  { _id: false }
);

const PricingRuleSchema = new Schema<PricingRuleDocument>(
  {
    name: { type: String, required: true, index: true },
    scope: {
      type: String,
      enum: ["global", "city", "postalCodePrefix", "listingType", "feature"],
      required: true,
      default: "global"
    },
    description: { type: String },
    baseRate: { type: Number, required: true },
    priority: { type: Number, required: true, default: 100 },
    isActive: { type: Boolean, required: true, default: true },
    conditions: {
      cities: [{ type: String }],
      postalCodePrefixes: [{ type: String }],
      listingTypes: [{ type: String }],
      features: [{ type: String }]
    },
    adjustments: {
      type: [AdjustmentSchema],
      default: []
    }
  },
  { timestamps: true }
);

PricingRuleSchema.index({ priority: 1, scope: 1 });

export const PricingRule: Model<PricingRuleDocument> =
  mongoose.models.PricingRule ||
  mongoose.model<PricingRuleDocument>("PricingRule", PricingRuleSchema);
