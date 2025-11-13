import { config } from "dotenv";

config();

const requiredVariables = ["MONGODB_URI", "JWT_SECRET"] as const;

type RequiredVariable = typeof requiredVariables[number];

type EnvConfig = {
  nodeEnv: string;
  port: number;
  mongoUri: string;
  jwtSecret: string;
  frontendUrl: string;
};

function getEnvVariable(key: RequiredVariable | string, defaultValue?: string) {
  const value = process.env[key];

  if ((requiredVariables as readonly string[]).includes(key) && !value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  if (!value && typeof defaultValue === "undefined") {
    return "";
  }

  return value ?? defaultValue ?? "";
}

export const env: EnvConfig = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 5000),
  mongoUri: getEnvVariable("MONGODB_URI"),
  jwtSecret: getEnvVariable("JWT_SECRET"),
  frontendUrl: getEnvVariable("FRONTEND_URL", "http://localhost:3000")
};
