import { Elysia } from "elysia";
import { RW } from "../plugins/ResponseSchema";

/**
 * 全局错误处理插件
 * 功能:
 * 1. 捕获所有路由抛出的错误
 * 2. 自动包装错误响应为统一格式
 * 3. 提供详细的错误日志记录
 * 4. 对不同类型错误进行分类处理
 * 5. 避免敏感错误信息泄露
 */
export const err_handler = new Elysia()
	.onError(({ error, code, path, request }) => {
		// 404 错误特殊处理 - 返回友好的错误信息
		if (code === "NOT_FOUND") {
			console.log(`🔍 [404] 路径未找到: ${path}`);
			return RW.error("请求的资源不存在", 404, {
				path,
				method: request.method,
			});
		}

		// 验证错误处理
		if (code === "VALIDATION") {
			console.log(`🔍 [VALIDATION] 参数验证失败: ${path}`);
			return RW.error("请求参数格式不正确", 400, error.message || null);
		}

		// 解析错误处理
		if (code === "PARSE") {
			console.log(`🔍 [PARSE] 请求解析失败: ${path}`);
			return RW.error("请求格式错误", 400, null);
		}

		// 通用错误处理 - 记录详细日志
		console.group(`🔴 [${code || "ERROR"}] ${path} 路由错误`);
		console.error("错误详情:", error.message);
		console.error("错误堆栈:", error.stack);
		console.error("请求方法:", request.method);
		console.error("请求路径:", path);
		console.groupEnd();

		// 开发环境返回详细错误信息，生产环境返回通用错误信息
		const isDev = process.env.NODE_ENV === "development";

		return RW.error(
			isDev ? error.message : "服务器内部错误",
			500,
			isDev
				? {
						stack: error.stack,
						path,
						method: request.method,
					}
				: null,
		);
	})
	.as("global");
