// import { Elysia } from "elysia";
// import { RW } from "./ResponseSchema";

import { Elysia } from "elysia";

// import { AppError } from "../decorators/base";
// import { getErrorMeta } from "../decorators/metadata";

// /**
//  * 错误信息安全处理函数
//  * @param error 原始错误对象
//  * @param isDev 是否为开发环境
//  * @returns 安全的错误信息
//  */
// function sanitizeError(error: Error, isDev: boolean) {
//   // 开发环境返回完整错误信息
//   if (isDev) {
//     return {
//       message: error.message,
//       stack: error.stack,
//       name: error.name,
//     };
//   }

//   // 生产环境只返回安全的错误信息
//   if (error instanceof AppError) {
//     const meta = getErrorMeta(error);
//     return {
//       message: meta?.exposeDetails ? error.message : "操作失败",
//       code: error.code,
//       context: meta?.exposeDetails ? error.context : undefined,
//     };
//   }

//   // 其他错误返回通用消息
//   return {
//     message: "服务器内部错误",
//   };
// }

// /**
//  * 全局错误处理插件
//  * 功能:
//  * 1. 捕获所有路由抛出的错误
//  * 2. 区分业务错误(RW.error)和HTTP错误(set.status)
//  * 3. 自动包装错误响应为统一格式
//  * 4. 提供详细的错误日志记录
//  * 5. 对不同类型错误进行分类处理
//  * 6. 避免敏感错误信息泄露
//  */
// export const err_handler = new Elysia()
//   .onError(({ error, code, path, request, status }) => {

//     const isDev = process.env.NODE_ENV === "development";

//     // 类型保护：确保传入 sanitizeError 的是标准 Error 对象
//     const safeError = error instanceof Error ? error : new Error(String(error));
//     const sanitized = sanitizeError(safeError, isDev);

//     // 1. 优先处理业务错误 (自定义AppError)
//     if (error instanceof AppError) {
//       const meta = getErrorMeta(error);

//       console.log(`💼 [BUSINESS] 业务错误: ${error.code} - ${error.message} (上下文: ${JSON.stringify(error.context)})`);

//       // 业务错误使用 RW.error 统一响应格式
//       return RW.error(
//         error.message, // 错误消息
//         meta?.statusCode,
//         error.context // 可选的上下文信息
//       );
//     }

//     // 详细错误日志记录 (非业务错误)
//     console.log(`🚨 [${code}] 框架错误发生:`, {
//       path,
//       method: request.method,
//       error: sanitized,
//       timestamp: new Date().toISOString(),
//     });
//   })

export const err_handler = new Elysia()
	.onError(({ error, path, code, set }) => {
		// 忽略 Chrome DevTools 的特定路由错误
		if (path === "/.well-known/appspecific/com.chrome.devtools.json") {
			set.status = 404;
			return { message: "Not Found" };
		}

		console.groupCollapsed(`🔴 ${path} 路由错误`);
		console.trace(error); // 显示调用栈
		console.groupEnd();
	})
	.as("global");
