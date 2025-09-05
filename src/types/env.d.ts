/// <reference types="vite/client" />
/// <reference types="domco/env" />
/// <reference types="unocss/vite" />

interface ImportMetaEnv {
  readonly VITE_BASE_URL: string

  // 服务器配置
  readonly APP_PORT: number
  readonly JWT_SECRET: string
  readonly COOKIE_SECRET: string
  readonly FRONTEND_URL: string

  // 数据库配置
  readonly DB_USER: string
  readonly DB_PASSWORD: string
  readonly DB_HOST: string
  readonly DB_PORT: number
  readonly DB_NAME: string
  readonly DATABASE_URL: string

  // 文件上传配置
  readonly UPLOAD_DIR: string
  readonly MAX_FILE_SIZE: number

  // 开发工具配置
  readonly DEV_DRIZZLE_OUT: string
  readonly DEV_DRIZZLE_SCHEMA: string

  // OSS 配置
  readonly HUAWEI_ACCESS_KEY_ID: string
  readonly HUAWEI_SECRET_ACCESS_KEY: string
  readonly HUAWEI_BUCKET: string
  readonly HUAWEI_ENDPOINT: string
  readonly HUAWEI_REGION: string

  // OAuth 配置
  readonly GOOGLE_CLIENT_ID: string
  readonly GOOGLE_CLIENT_SECRET: string
  readonly GOOGLE_REDIRECT_URI: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // 服务器配置
      APP_PORT: string
      JWT_SECRET: string
      COOKIE_SECRET: string
      FRONTEND_URL: string

      // 数据库配置
      DB_USER: string
      DB_PASSWORD: string
      DB_HOST: string
      DB_PORT: string
      DB_NAME: string
      DATABASE_URL: string

      // 文件上传配置
      UPLOAD_DIR: string
      MAX_FILE_SIZE: string

      // 开发工具配置
      DEV_DRIZZLE_OUT: string
      DEV_DRIZZLE_SCHEMA: string

      // OSS 配置
      HUAWEI_ACCESS_KEY_ID: string
      HUAWEI_SECRET_ACCESS_KEY: string
      HUAWEI_BUCKET: string
      HUAWEI_ENDPOINT: string
      HUAWEI_REGION: string

      // OAuth 配置
      GOOGLE_CLIENT_ID: string
      GOOGLE_CLIENT_SECRET: string
      GOOGLE_REDIRECT_URI: string

      // 前端环境变量
      VITE_BASE_URL: string
    }
  }

}







declare module "bun" {
  interface Env {
    // 服务器配置
    APP_PORT: string
    JWT_SECRET: string
    COOKIE_SECRET: string
    FRONTEND_URL: string

    // 数据库配置
    DB_USER: string
    DB_PASSWORD: string
    DB_HOST: string
    DB_PORT: string
    DB_NAME: string
    DATABASE_URL: string

    // 文件上传配置
    UPLOAD_DIR: string
    MAX_FILE_SIZE: string

    // 开发工具配置
    DEV_DRIZZLE_OUT: string
    DEV_DRIZZLE_SCHEMA: string

    // OSS 配置
    HUAWEI_ACCESS_KEY_ID: string
    HUAWEI_SECRET_ACCESS_KEY: string
    HUAWEI_BUCKET: string
    HUAWEI_ENDPOINT: string
    HUAWEI_REGION: string

    // OAuth 配置
    GOOGLE_CLIENT_ID: string
    GOOGLE_CLIENT_SECRET: string
    GOOGLE_REDIRECT_URI: string

    // 前端环境变量
    VITE_BASE_URL: string
  }
}