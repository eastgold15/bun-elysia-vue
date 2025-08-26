import { Elysia } from "elysia";
import { afterHandlePlugin } from "./plugins/afterHandle";
import { loggerPlugin } from "./plugins/logger";
import { swaggerPlugin } from "./plugins/swagger";
import { userRoute } from "./routes/use";

export const api = new Elysia({ prefix: "/api" })
	.use(afterHandlePlugin)
	.use(swaggerPlugin)
	.use(loggerPlugin)

	.use(userRoute);

