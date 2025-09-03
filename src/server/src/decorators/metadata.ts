import 'reflect-metadata'
const ERROR_METADATA_KEY = Symbol('ElysiaError')


type ErrorMetadata = {
  statusCode: number,
  exposeDetails?: boolean // 是否在响应中暴露错误详情
}

/**
 * ErrorMeta 是一个装饰器工厂函数，它接受一个 metadata 参数并返回一个实际的装饰器数。
 * 这允许你在应用装饰器时传递配置参数。
 * @param metadata 
 * @returns 
 */
export function ErrorMeta(metadata: ErrorMetadata) {
  return (target: Function) => {
    Reflect.defineMetadata(ERROR_METADATA_KEY, metadata, target);
  }
}

/**
 * 用于从错误实例中提取之前存储的元数据：
   如果找不到元数据则返回 null
   使用 ?? 空值合并运算符确保返回 null 而不是 undefined
 * @param error 
 * @returns 
 * 通过 error.constructor 获取到类构造函数，并从中读取之前设置的元数据。
 */
export function getErrorMeta(error: Error): ErrorMetadata | null {
  return Reflect.getMetadata(ERROR_METADATA_KEY, error.constructor) ?? null;
}



// 装饰器是一种特殊类型的声明，可以被附加到类、方法、访问符、属性或参数上，用于扩展或修改目标的行为。在 TypeScript 中，装饰器是实验性特性，需要启用 experimentalDecorators 编译选项。