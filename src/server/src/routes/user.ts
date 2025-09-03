import { eq } from "drizzle-orm";
import { Elysia } from "elysia";
import { db } from "../db/connection";
import { userSchema } from "../db/schema";
import { RW } from "../plugins/ResponseSchema";
import { UserRouteModel } from "./user.model";

/**
 * 用户相关路由模块
 *
 * 核心设计理念：统一返回格式对开发者透明
 * - 处理器只需要返回业务数据，无需关心统一格式包装
 * - afterHandlePlugin 会自动将返回值包装为 { code, message, data } 格式
 * - 错误处理由 err_handler 统一处理，自动包装错误响应
 * - 开发者专注业务逻辑，框架处理响应格式标准化
 *
 * 使用方式：
 * 1. 开启 commonRes: true 启用自动包装
 * 2. 处理器直接返回业务数据（原始类型）
 * 3. 抛出错误时，全局错误处理器会自动包装错误响应
 * 4. 分页数据返回 { items: [], meta: {} } 格式，自动识别并包装
 */

export const userRoute = new Elysia({ prefix: "/user" })

	.get("/", async () => {
		const user = await db.select().from(userSchema);
		return RW.success(user, "获取用户列表成功");
	})
	.model(UserRouteModel)

	.get(
		"/register",
		async ({ query }) => {
			try {
				const res = await db.insert(userSchema).values(query).returning();
				console.log(res);
				// // 结果和消息
				return RW.success(res, "注册成功");
			} catch (error) {
				console.log(error);
			}
		},
		{
			query: "registerDto",
		},
	)
	.post(
		"/login",
		async ({ body: { username } }) => {
			const user = await db
				.select()
				.from(userSchema)
				.where(eq(userSchema.username, username))
				.limit(1);

			console.log(user);

			if (!user) return RW.error("用户不存在", 404, null);

			return RW.success(user, "登录成功");
		},
		{
			body: "loginDto",
		},
	);
// 基本用户信息接口
// .get(
// 	"/",
// 	() => {
// 		return {
// 			name: "user",
// 			id: 1,
// 			email: "user@example.com",
// 			role: "user",
// 		};
// 	},
// 	{
// 		commonRes: true,
// 		// 使用类型生成器，大大简化了类型定义！
// 		// response: ResponseSchema.simple(UserSchema), // 自动包装时不需要定义响应类型
// 		detail: {
// 			tags: ["Users"],
// 			summary: "获取用户信息",
// 			description: "获取当前用户的详细信息",
// 		},
// 	},
// )

// // 分页数据示例
// .get(
// 	"/list",
// 	() => {
// 		// 返回分页数据格式，会被自动识别并包装
// 		return {
// 			items: [
// 				{ name: "张三", id: 1, email: "zhang@example.com", role: "user" },
// 				{ name: "李四", id: 2, email: "li@example.com", role: "admin" },
// 			],
// 			meta: {
// 				total: 2,
// 				page: 1,
// 				pageSize: 10,
// 				totalPages: 1,
// 			},
// 		};
// 	},
// 	{
// 		commonRes: true,
// 		response: RS.simple(RW.page(UserSchema)), // 自动包装时不需要定义响应类型
// 		detail: {
// 			tags: ["Users"],
// 			summary: "获取用户列表",
// 			description: "分页获取用户列表数据",
// 		},
// 	},
// )
