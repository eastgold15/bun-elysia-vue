import Elysia from "elysia";
import { type CommonRes, RW } from "./ResponseSchema";

const afterHandlePlugin = new Elysia()
	.macro({
		commonRes(isCommonRes: boolean) {
			return {
				afterHandle: ({ response }) => {
					if (!isCommonRes) {
						return response;
					}

					console.log(`📎 [AutoWrap] 自动包装响应:`, response);

					// 处理错误响应
					if (error) {
						console.log(`🔴 [AutoWrap] 检测到错误:`, error);
						return RW.error(error.message || "内部服务器错误", 500, null);
					}

					// 如果响应已经是统一格式，跳过包装
					if (
						response &&
						typeof response === "object" &&
						"code" in response &&
						"message" in response &&
						"data" in response
					) {
						console.log(`📎 [AutoWrap] 响应已经是统一格式，跳过包装`);
						return response;
					}

					// 检测分页数据格式
					if (
						response &&
						typeof response === "object" &&
						"items" in response &&
						"meta" in response
					) {
						console.log(`📄 [AutoWrap] 检测到分页数据，使用分页包装`);
						return RW.page(response as any);
					}

					// // 检测错误状态（基于约定：包含error字段或isError标记）
					if (
						response &&
						typeof response === "object" &&
						("error" in response || "isError" in response)
					) {
						console.log(`🔴 [AutoWrap] 检测到错误响应，使用错误包装`);
						const errorData = response as any;
						return RW.error(
							errorData.message || errorData.error || "操作失败",
							errorData.code || 400,
							errorData.data || null,
						);
					}

					// 默认成功包装
					const wrappedResponse = RW.success(response);
					console.log(`📎 [AutoWrap] 包装后的响应:`, wrappedResponse);
					return wrappedResponse;
				},
			};
		},
	})
	.as("global");

export { afterHandlePlugin };
