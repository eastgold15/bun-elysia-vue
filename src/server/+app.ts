import * as page from "client:page";
import { Elysia } from "elysia";
import { renderToString } from "vue/server-renderer";
import { createApp } from "@/app/app";
import { api } from "./src";



const app = new Elysia()
  .onRequest(async ({ request }) => {
    const { pathname } = new URL(request.url);

    const { app, router } = await createApp();

    // 如果是API路由，跳后端，不需要被前端拦截
    if (pathname.startsWith("/api")) {
      return;
    }

    const { matched } = router.resolve(pathname);
    if (!matched.length) return;

    await router.push(pathname);
    await router.isReady();

    const appHtml = await renderToString(app);
    return new Response(page.html.replace("%root%", appHtml), {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  })
  .use(api);

export default app;

export type EndApp = typeof app;
1

