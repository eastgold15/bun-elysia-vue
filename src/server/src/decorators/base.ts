import { ErrorMeta } from "./metadata";


@ErrorMeta({ statusCode: 10000, exposeDetails: false })
export class AppError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly context?: Record<string, unknown>
  ) {

    super(message);
    // this.name = "AppError";
    this.name = this.constructor.name; // 自动匹配子类名

    return Reflect.construct(Error, [code, message, context], this.constructor);
  }
}


// 业务错误类示例

// 404 资源未找到错误
@ErrorMeta({ statusCode: 10010, exposeDetails: true })
export class NotFoundUserError extends AppError {
  constructor(resource: string) {
    super('NOT_FOUND', `${resource} 未找到`, { resource });
  }
}

