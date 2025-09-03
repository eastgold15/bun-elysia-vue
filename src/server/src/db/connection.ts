import { SQL } from "bun";
import { drizzle } from "drizzle-orm/bun-sql";
import * as schema from "./schema/index.ts";
// Bun 内置的 SQL 客户端实例
const client = new SQL(process.env.DATABASE_URL!);
// 创建 Drizzle ORM 实例
export const db = drizzle({
  connection: {
    url: process.env.DATABASE_URL!,
  },
  schema,
  client,
  casing: "snake_case",
});

// - Bun SQL 提供了高性能的底层数据库连接
// - Drizzle ORM 提供了类型安全和查询构建功能
// - 这种结合让你既能享受 Bun 的性能优势，又能使用 Drizzle 的 ORM 功能
