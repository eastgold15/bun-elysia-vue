import { Elysia } from "elysia";
import { afterHandlePlugin } from "./plugins/afterHandle";
import { loggerPlugin } from "./plugins/logger";
import { swaggerPlugin } from "./plugins/swagger";
import { userRoute } from "./routes/user";
import { err_handler } from './plugins/err.global'
export const api = new Elysia({ prefix: "/api" })
  .use(afterHandlePlugin)
  .use(swaggerPlugin)
  .use(loggerPlugin)
  .use(err_handler)

  .use(userRoute);

