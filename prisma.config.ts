
// Prisma configuration file
// dotenv must be imported manually here because Prisma skips .env auto-loading when a config file is present
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
});
