#环境变量 基础配置
APP_PORT=4000
JWT_SECRET=your-jwt-secret-key-here
COOKIE_SECRET=your-cookie-secret-key-here

DEV_DRIZZLE_OUT=src/server/drizzle/dev
DEV_DRIZZLE_SCHEMA=src/server/src/db/schema/index.ts
# DB_USER=app_user
# DB_PASSWORD=app_pass
# DB_HOST=localhost
# DB_PORT=7755
# DB_NAME=buy_db

bun  i


bun  run  docker:dev

bun run dev 


bun run build 卡住了
