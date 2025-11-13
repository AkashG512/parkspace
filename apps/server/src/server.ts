import http from "http";
import app from "./app.js";
import { env } from "./config/env.js";
import { connectDatabase } from "./database/connection.js";

async function bootstrap() {
  await connectDatabase();

  const server = http.createServer(app);

  server.listen(env.port, () => {
    console.log(`🚀 Server running on port ${env.port}`);
  });
}

bootstrap().catch((error) => {
  console.error("Failed to bootstrap application", error);
  process.exit(1);
});
