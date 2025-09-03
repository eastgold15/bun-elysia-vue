# 错误处理架构说明

## 概述

本项目采用装饰器模式实现了统一的错误处理架构，清晰区分**业务错误**和**HTTP框架错误**，提供类型安全和统一的错误响应格式。

## 架构组件

### 1. 错误元数据装饰器 (`metadata.ts`)

```typescript
@ErrorMeta({ statusCode: 404, exposeDetails: true })
export class NotFoundError extends AppError {
  // ...
}
```

**功能：**
- 为错误类添加元数据信息
- 控制HTTP状态码
- 控制错误详情是否暴露给客户端

### 2. 基础错误类 (`base.ts`)

```typescript
// 基础应用错误类
export class AppError extends Error {
  constructor(
    public readonly code: string,      // 业务错误码
    message: string,                   // 错误消息
    public readonly context?: Record<string, unknown> // 错误上下文
  )
}

// 预定义的业务错误类
export class NotFoundError extends AppError        // 404 资源未找到
export class ValidationError extends AppError     // 400 参数验证失败
export class AuthenticationError extends AppError // 401 认证失败
export class AuthorizationError extends AppError  // 403 权限不足
export class ConflictError extends AppError       // 409 资源冲突
export class InternalServerError extends AppError // 500 内部服务器错误
```

### 3. 全局错误处理器 (`err.global.ts`)

**处理流程：**

1. **HTTP框架级错误** (NOT_FOUND, VALIDATION, PARSE)
   - 设置HTTP状态码 (`set.status`)
   - 返回 `RW.error()` 包装的响应

2. **业务错误** (AppError子类)
   - 获取错误元数据
   - 设置HTTP状态码
   - 安全处理错误信息
   - 返回统一格式的业务错误响应

3. **未知错误**
   - 记录详细日志
   - 返回通用错误响应
   - 生产环境隐藏敏感信息

## 使用方式

### 业务错误 (推荐)

```typescript
// 在路由处理器中抛出业务错误
export const userRoutes = new Elysia()
  .get("/user/:id", ({ params }) => {
    const user = findUser(params.id);
    
    if (!user) {
      // 抛出业务错误 - 全局处理器会自动处理
      throw new NotFoundError("用户");
    }
    
    return user;
  })
  
  .post("/user", ({ body }) => {
    const data = body as any;
    
    if (!data.email?.includes("@")) {
      throw new ValidationError("email", "邮箱格式不正确");
    }
    
    if (userExists(data.username)) {
      throw new ConflictError("用户名", "username");
    }
    
    return createUser(data);
  });
```

**响应示例：**
```json
{
  "code": 404,
  "message": "用户未找到",
  "data": {
    "code": "NOT_FOUND",
    "context": { "resource": "用户" },
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

### HTTP框架错误 (特殊场景)

```typescript
// 直接设置HTTP状态码 - 适用于系统级错误
export const systemRoutes = new Elysia()
  .get("/health", ({ set }) => {
    if (isMaintenanceMode()) {
      set.status = 503;
      return {
        error: "服务不可用",
        message: "系统维护中",
        estimatedTime: "2小时"
      };
    }
    
    return { status: "healthy" };
  });
```

## 错误类型对比

| 特性 | 业务错误 (AppError) | HTTP框架错误 |
|------|-------------------|-------------|
| **使用方式** | `throw new NotFoundError()` | `set.status = 404` |
| **HTTP状态码** | 自动设置 | 手动设置 |
| **响应格式** | 统一 `RW.error()` 格式 | 自定义格式 |
| **错误日志** | 自动记录 | 需手动记录 |
| **安全处理** | 自动脱敏 | 需手动处理 |
| **适用场景** | 业务逻辑错误 | 系统级错误 |

## 安全特性

### 1. 错误信息脱敏

```typescript
function sanitizeError(error: Error, isDev: boolean) {
  // 开发环境：返回完整错误信息
  if (isDev) {
    return { message: error.message, stack: error.stack, name: error.name };
  }

  // 生产环境：根据 exposeDetails 控制信息暴露
  if (error instanceof AppError) {
    const meta = getErrorMeta(error);
    return {
      message: meta?.exposeDetails ? error.message : "操作失败",
      code: error.code,
      context: meta?.exposeDetails ? error.context : undefined,
    };
  }

  // 其他错误：返回通用消息
  return { message: "服务器内部错误" };
}
```

### 2. 错误详情控制

```typescript
// 暴露详情 - 用于客户端友好的错误
@ErrorMeta({ statusCode: 400, exposeDetails: true })
export class ValidationError extends AppError {}

// 隐藏详情 - 用于敏感的服务器错误
@ErrorMeta({ statusCode: 500, exposeDetails: false })
export class InternalServerError extends AppError {}
```

## 最佳实践

### 1. 错误分类

- **4xx 客户端错误**：使用 `exposeDetails: true`
- **5xx 服务器错误**：使用 `exposeDetails: false`

### 2. 错误码命名

```typescript
// 使用语义化的错误码
super('USER_NOT_FOUND', message);     // ✅ 好
super('ERROR_001', message);          // ❌ 不好
```

### 3. 上下文信息

```typescript
// 提供有用的上下文信息
throw new ValidationError('email', '邮箱格式不正确', {
  field: 'email',
  value: userInput.email,
  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
});
```

### 4. 错误处理层次

```typescript
// 服务层：抛出具体的业务错误
class UserService {
  async findUser(id: string) {
    const user = await db.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundError('用户');
    }
    return user;
  }
}

// 控制器层：处理服务层错误或添加额外上下文
const userController = new Elysia()
  .get('/user/:id', async ({ params }) => {
    try {
      return await userService.findUser(params.id);
    } catch (error) {
      if (error instanceof NotFoundError) {
        // 可以添加额外的上下文或重新抛出
        throw error;
      }
      // 包装未知错误
      throw new InternalServerError('查询用户失败');
    }
  });
```

## 测试示例

查看 `examples/error-usage.ts` 文件获取完整的使用示例和测试用例。

```bash
# 测试业务错误
curl http://localhost:3000/examples/errors/user/404

# 测试参数验证错误
curl -X POST http://localhost:3000/examples/errors/validate \
  -H "Content-Type: application/json" \
  -d '{"email":"invalid"}'

# 测试认证错误
curl http://localhost:3000/examples/errors/protected

# 查看错误处理对比说明
curl http://localhost:3000/examples/errors/error-comparison
```

## 总结

这个错误处理架构提供了：

1. **清晰的错误分类**：业务错误 vs HTTP框架错误
2. **统一的响应格式**：使用 `RW.error()` 包装
3. **类型安全**：基于 TypeScript 和装饰器
4. **安全性**：自动脱敏和详情控制
5. **可扩展性**：易于添加新的错误类型
6. **开发友好**：详细的日志和调试信息

通过这种设计，开发者可以专注于业务逻辑，而错误处理的复杂性被抽象到框架层面。