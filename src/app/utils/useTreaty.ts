import { treaty } from "@elysiajs/eden";
import type { EndApp } from "@/server/+app";


// 创建Eden Treaty客户端
export const client = treaty<EndApp>(import.meta.env.VITE_BASE_URL || "http://localhost:9004");


