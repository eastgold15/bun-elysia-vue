import { type TSchema, t } from "elysia";

// 统一API响应接口
interface CommonRes<T = any> {
	code: number;
	message: string;
	data: T;
}

interface pageResponse<T> {
	items: T[];
	meta: {
		total: number;
		page: number;
		pageSize: number;
		totalPages: number;
	};
}

/**
 * 统一响应类型生成器
 * 简化 API 响应类型定义，支持自动包装
 */
export const ResponseSchema = {
	/**
	 * 简单响应类型 - 只定义数据类型，自动包装为统一格式
	 * @param dataSchema 数据部分的类型定义
	 * @returns 统一响应格式的类型定义
	 */
	simple<T extends TSchema>(dataSchema: T) {
		return t.Object({
			code: t.Number({ description: "响应状态码", example: 200 }),
			message: t.String({ description: "响应消息", example: "操作成功" }),
			data: dataSchema,
		});
	},

	/**
	 * 完整响应类型 - 包含多种状态码的响应定义
	 * @param dataSchema 成功响应的数据类型
	 * @returns 包含多状态码的响应类型定义
	 */
	full<T extends TSchema>(dataSchema: T) {
		return {
			200: t.Object({
				code: t.Number({ description: "响应状态码", example: 200 }),
				message: t.String({ description: "响应消息", example: "操作成功" }),
				data: dataSchema,
			}),
			400: t.Object({
				code: t.Number({ description: "响应状态码", example: 400 }),
				message: t.String({ description: "错误消息", example: "请求参数错误" }),
				data: t.Null({ description: "错误时数据为空" }),
			}),
			500: t.Object({
				code: t.Number({ description: "响应状态码", example: 500 }),
				message: t.String({
					description: "错误消息",
					example: "服务器内部错误",
				}),
				data: t.Null({ description: "错误时数据为空" }),
			}),
		};
	},

	/**
	 * 分页响应类型
	 * @param itemSchema 分页项的类型定义
	 * @returns 分页响应的类型定义
	 */
	page<T extends TSchema>(itemSchema: T) {
		return t.Object(
			{
				items: t.Array(itemSchema, { description: "分页数据列表" }),
				meta: t.Object(
					{
						total: t.Number({ description: "总数据量", example: 100 }),
						page: t.Number({ description: "当前页码", example: 1 }),
						pageSize: t.Number({ description: "每页大小", example: 10 }),
						totalPages: t.Number({ description: "总页数", example: 10 }),
					},
					{ description: "分页元信息" },
				),
			},
			{ description: "分页数据结构" },
		);
	},

	/**
	 * 错误响应类型
	 * @returns 错误响应的类型定义
	 */
	error() {
		return t.Object({
			code: t.Number({ description: "错误状态码", example: 500 }),
			message: t.String({ description: "错误消息", example: "服务器内部错误" }),
			data: t.Null({ description: "错误时数据为空" }),
		});
	},
} as const;

// 响应包装器
export const ResponseWrapper = {
	success<T>(
		data: T,
		message: string = "操作成功",
		code: number = 200,
	): CommonRes<T> {
		return {
			code,
			message,
			data,
		};
	},

	page<T>(
		pageData: pageResponse<T>,
		message: string = "操作成功",
		code: number = 200,
	) {
		return {
			code,
			message,
			data: pageData,
		};
	},

	error(message: string, code: number = 500, data: any = null): CommonRes {
		return {
			code,
			message,
			data,
		};
	},

	created<T>(
		data: T,
		message: string = "创建成功",
		code: number = 200,
	): CommonRes<T> {
		return {
			code,
			message,
			data,
		};
	},
} as const;

// 导出便捷的类型别名
export const RS = ResponseSchema; // 更简短的别名
export const RW = ResponseWrapper;// 更简短的别名
