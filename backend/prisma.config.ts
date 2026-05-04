import "dotenv/config";
import { defineConfig, env } from "prisma/config";
import { DATABASE_URL } from "./src/utils/constants";

export default defineConfig({
  schema: "prisma/",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: DATABASE_URL,
  },
});
