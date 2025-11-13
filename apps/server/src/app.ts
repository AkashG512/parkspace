import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";

import adminPricingRoutes from "./routes/admin/pricingRoutes.js";
import publicPricingRoutes from "./routes/public/pricingRoutes.js";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true
  })
);
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/admin/pricing", adminPricingRoutes);
app.use("/api/pricing", publicPricingRoutes);

app.use(errorHandler);

export default app;
