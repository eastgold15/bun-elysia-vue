import { Elysia, t } from "elysia";
import { RS } from "../plugins/ResponseSchema";

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

// 定义用户数据类型
const UserSchema = t.Object({
	name: t.String({ description: "用户姓名", example: "张三" }),
	id: t.Number({ description: "用户ID", example: 1 }),
	email: t.String({ description: "邮箱地址", example: "user@example.com" }),
	role: t.String({ description: "用户角色", example: "user" }),
});

export const userRoute = new Elysia({ prefix: "/user" })
	// 基本用户信息接口
	.get(
		"/",
		() => {
			return {
				name: "user",
				id: 1,
				email: "user@example.com",
				role: "user",
			};
		},
		{
			commonRes: true,
			// 使用类型生成器，大大简化了类型定义！
			// response: ResponseSchema.simple(UserSchema), // 自动包装时不需要定义响应类型
			detail: {
				tags: ["Users"],
				summary: "获取用户信息",
				description: "获取当前用户的详细信息",
			},
		},
	)
	// 错误处理示例
	.get(
		"/error",
		() => {
			// 返回错误数据，会被自动包装为错误响应

			throw new Error("用户不存在");
			// return {
			// 	error: "用户不存在",
			// 	code: 404,
			// 	message: "找不到指定的用户"
			// };
		},
		{
			commonRes: true,
			// response: ResponseSchema.full(t.Null()), // 自动包装时不需要定义响应类型
			detail: {
				tags: ["Users"],
				summary: "错误处理示例",
				description: "展示如何使用自动错误包装功能",
			},
		},
	)
	// 分页数据示例
	.get(
		"/list",
		() => {
			// 返回分页数据格式，会被自动识别并包装
			return {
				items: [
					{ name: "张三", id: 1, email: "zhang@example.com", role: "user" },
					{ name: "李四", id: 2, email: "li@example.com", role: "admin" },
				],
				meta: {
					total: 2,
					page: 1,
					pageSize: 10,
					totalPages: 1,
				},
			};
		},
		{
			commonRes: true,
			// response: ResponseSchema.simple(ResponseSchema.page(UserSchema)), // 自动包装时不需要定义响应类型
			detail: {
				tags: ["Users"],
				summary: "获取用户列表",
				description: "分页获取用户列表数据",
			},
		},
	)
	// 简单消息响应示例
	.post(
		"/simple",
		() => {
			return "Operation completed successfully";
		},
		{
			commonRes: true,
			// response: ResponseSchema.simple(t.String()), // 自动包装时不需要定义响应类型
			detail: {
				tags: ["Users"],
				summary: "简单操作",
				description: "返回简单的字符串消息",
			},
		},
	);
