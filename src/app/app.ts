import { createSSRApp } from "vue";
import {
  createMemoryHistory,
  createRouter,
  createWebHistory,
} from "vue-router";

import App from "./App.vue";
// 仅在客户端加载 UnoCSS 生成的样式
if (!import.meta.env.SSR) {
  await import("virtual:uno.css");
}
import Aura from "@primevue/themes/aura";
import PrimeVue from "primevue/config";
export const createApp = async () => {
  const app = createSSRApp(App);


  const router = createRouter({
    history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
    routes: [
      {
        path: "/",
        component: () => import("./layouts/default.vue"),
        redirect: "home",
        children: [
          {
            path: "home",
            name: "home",
            component: () => import("./pages/HomeView.vue"),
          },
          {
            path: "/users",
            name: "users",
            component: () => import("./pages/UserView.vue"),
          },
        ],
      },
    ],
  });

  app.use(PrimeVue, {
    theme: {
      preset: Aura,
    },
  });
  app.use(router);

  return { app, router };
};
