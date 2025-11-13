import mongoose, { Schema, Document, Model } from "mongoose";

export interface PlatformSettingsAttributes {
  providerCommissionPercentage: number;
  platformBookingFee: number;
  lastUpdatedBy?: string;
}

export interface PlatformSettingsDocument
  extends PlatformSettingsAttributes,
    Document {
  createdAt: Date;
  updatedAt: Date;
}

const PlatformSettingsSchema = new Schema<PlatformSettingsDocument>(
  {
    providerCommissionPercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 15
    },
    platformBookingFee: {
      type: Number,
      required: true,
      min: 0,
      default: 99
    },
    lastUpdatedBy: {
      type: String
    }
  },
  { timestamps: true }
);

export const PlatformSettings: Model<PlatformSettingsDocument> =
  mongoose.models.PlatformSettings ||
  mongoose.model<PlatformSettingsDocument>(
    "PlatformSettings",
    PlatformSettingsSchema
  );
