import { createSSRApp } from "vue";
import {
  createMemoryHistory,
  createRouter,
  createWebHistory,
} from "vue-router";
import App from "./App.vue";

import "virtual:uno.css";

import Aura from "@primevue/themes/aura";
import { createPinia } from "pinia";
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

  const pinia = createPinia();
  app.use(pinia);

  app.use(PrimeVue, {
    theme: {
      preset: Aura,
    },
  });
  app.use(router);

  return { app, router };
};
