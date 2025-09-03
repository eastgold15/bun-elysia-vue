/**
 * 错误处理使用示例
 * 演示业务错误和HTTP错误的区别
 */

import { Elysia } from "elysia";
import {
  AppError,
  NotFoundError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  ConflictError,
  InternalServerError,
} from "../decorators/base";
import { RW } from "../plugins/ResponseSchema";

/**
 * 错误处理示例路由
 * 展示不同类型错误的处理方式
 */
export const errorExampleRoutes = new Elysia({ prefix: "/examples/errors" })
  // 1. 业务错误示例 - 用户不存在
  .get("/user/:id", ({ params, set }) => {
    const userId = parseInt(params.id);
    
    // 模拟用户查找
    if (userId === 404) {
      // 抛出业务错误 - 全局错误处理器会:
      // 1. 设置 HTTP 状态码为 404
      // 2. 返回 RW.error() 包装的业务错误响应
      throw new NotFoundError("用户");
    }
    
    return { id: userId, name: "测试用户" };
  })
  
  // 2. 参数验证错误示例
  .post("/validate", ({ body, set }) => {
    const data = body as any;
    
    if (!data.email || !data.email.includes("@")) {
      // 业务错误 - 参数验证失败
      throw new ValidationError("email", "邮箱格式不正确");
    }
    
    return RW.success({ message: "验证通过" });
  })
  
  // 3. 认证错误示例
  .get("/protected", ({ headers, set }) => {
    const token = headers.authorization;
    
    if (!token) {
      // 业务错误 - 认证失败
      throw new AuthenticationError("缺少认证令牌");
    }
    
    return RW.success({ message: "访问成功" });
  })
  
  // 4. 权限错误示例
  .delete("/admin-only", ({ headers, set }) => {
    const userRole = headers["x-user-role"];
    
    if (userRole !== "admin") {
      // 业务错误 - 权限不足
      throw new AuthorizationError("删除资源");
    }
    
    return RW.success({ message: "删除成功" });
  })
  
  // 5. 冲突错误示例
  .post("/register", ({ body, set }) => {
    const data = body as any;
    
    // 模拟用户名冲突检查
    if (data.username === "admin") {
      // 业务错误 - 资源冲突
      throw new ConflictError("用户名", "username");
    }
    
    return RW.success({ message: "注册成功" });
  })
  
  // 6. 内部服务器错误示例
  .get("/server-error", ({ set }) => {
    try {
      // 模拟数据库连接失败
      throw new Error("数据库连接失败");
    } catch (error) {
      // 包装为内部服务器错误 (不暴露敏感信息)
      throw new InternalServerError("服务暂时不可用", {
        originalError: error instanceof Error ? error.message : "未知错误",
      });
    }
  })
  
  // 7. HTTP框架错误示例 (非业务错误)
  .get("/framework-error", ({ set }) => {
    // 直接设置HTTP状态码 - 这不是业务错误
    set.status = 503;
    return {
      error: "服务不可用",
      message: "系统维护中",
    };
  })
  
  // 8. 错误处理对比说明
  .get("/error-comparison", () => {
    return {
      message: "错误处理方式对比",
      businessErrors: {
        description: "业务错误 - 使用 AppError 子类",
        handling: [
          "1. 抛出 AppError 子类 (如 NotFoundError)",
          "2. 全局错误处理器捕获",
          "3. 设置对应的 HTTP 状态码 (set.status)",
          "4. 返回 RW.error() 包装的统一业务错误响应",
          "5. 响应体包含业务错误码和详细信息",
        ],
        example: {
          httpStatus: 404,
          responseBody: {
            code: 404,
            message: "用户未找到",
            data: {
              code: "NOT_FOUND",
              context: { resource: "用户" },
              timestamp: "2024-01-01T00:00:00.000Z",
            },
          },
        },
      },
      httpErrors: {
        description: "HTTP框架错误 - 直接设置状态码",
        handling: [
          "1. 直接设置 set.status",
          "2. 返回自定义响应体",
          "3. 不经过业务错误处理逻辑",
          "4. 适用于系统级错误 (如维护模式)",
        ],
        example: {
          httpStatus: 503,
          responseBody: {
            error: "服务不可用",
            message: "系统维护中",
          },
        },
      },
    };
  });

/**
 * 使用说明:
 * 
 * 1. 业务错误 (推荐方式):
 *    - 使用 AppError 子类 (NotFoundError, ValidationError 等)
 *    - 全局错误处理器自动处理 HTTP 状态码和响应格式
 *    - 统一的错误响应格式
 *    - 支持错误详情控制 (exposeDetails)
 * 
 * 2. HTTP框架错误 (特殊场景):
 *    - 直接设置 set.status
 *    - 返回自定义响应体
 *    - 适用于系统级错误或特殊需求
 * 
 * 3. 测试命令:
 *    curl http://localhost:3000/examples/errors/user/404
 *    curl -X POST http://localhost:3000/examples/errors/validate -d '{"email":"invalid"}'
 *    curl http://localhost:3000/examples/errors/protected
 *    curl -X DELETE http://localhost:3000/examples/errors/admin-only
 *    curl -X POST http://localhost:3000/examples/errors/register -d '{"username":"admin"}'
 *    curl http://localhost:3000/examples/errors/server-error
 *    curl http://localhost:3000/examples/errors/framework-error
 *    curl http://localhost:3000/examples/errors/error-comparison
 */