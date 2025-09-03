import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";

// 加载环境变量
config({
  path: [".env"],
});

console.log(process.env.DATABASE_URL)
export default defineConfig({
  out: process.env.DEV_DRIZZLE_OUT || "src/server/drizzle/dev",
  schema: process.env.DEV_DRIZZLE_SCHEMA || "src/server/src/db/schema/index.ts",
  dialect: "postgresql",
  dbCredentials: {
    // url: "postgres://app_user:app_pass@localhost:5432/buy_db",
    url: process.env.DATABASE_URL! || "postgres://app_user:app_pass@localhost:5432/buy_db",
    // url: "postgres://app_user:TzzKkj3scdJjSJz6@47.109.24.194:5432/buy_db",
  },
});
