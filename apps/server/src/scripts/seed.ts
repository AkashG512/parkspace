import mongoose from "mongoose";
import { env } from "../config/env.js";
import { PlatformSettings } from "../models/PlatformSettings.js";
import { PricingRule } from "../models/PricingRule.js";

async function seed() {
  try {
    await mongoose.connect(env.mongoUri);
    console.log("Connected to MongoDB");

    await PlatformSettings.deleteMany({});
    await PricingRule.deleteMany({});

    await PlatformSettings.create({
      providerCommissionPercentage: 15,
      platformBookingFee: 99
    });
    console.log("✅ Created default platform settings");

    await PricingRule.create({
      name: "Global Base Rate",
      scope: "global",
      description: "Default pricing for all locations",
      baseRate: 5,
      priority: 100,
      isActive: true,
      conditions: {},
      adjustments: []
    });
    console.log("✅ Created global pricing rule");

    await mongoose.disconnect();
    console.log("✅ Seeding complete");
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
}

seed();
