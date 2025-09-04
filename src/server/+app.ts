
// import { api } from "./src"; // 移除静态导入，避免在 Node 环境（prerender/SSR 构建）解析到 Bun 专属依赖
import { Elysia } from "elysia";
import { renderToString } from "vue/server-renderer";
import { createApp } from "@/app/app";
import * as page from "client:page";

const app = new Elysia()
  .onRequest(async ({ request }) => {
    const { pathname } = new URL(request.url);

    const { app, router } = await createApp();

    // // 如果是API路由，跳后端，不需要被前端拦截
    // if (pathname.startsWith("/api")) {
    //   return;
    // }

    const { matched } = router.resolve(pathname);
    if (!matched.length) return;

    await router.push(pathname);
    await router.isReady();

    const appHtml = await renderToString(app);
    return new Response(page.html.replace("%root%", appHtml), {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  });

// 仅在 Bun 运行时动态加载 API（避免 SSR 构建阶段被 Vite/Rollup 静态解析）
const isBunRuntime = typeof (globalThis as any).Bun !== "undefined";
if (isBunRuntime) {
  // 使用 vite-ignore 防止预处理器/打包器尝试在构建期解析该导入
  const { api } = await import(/* @vite-ignore */ "./src");
  app.use(api);
}

export default app;
export type EndApp = typeof app;
