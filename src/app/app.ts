import { createSSRApp } from "vue";
import {
	createMemoryHistory,
	createRouter,
	createWebHistory,
} from "vue-router";
import App from "./App.vue";
import MainLayout from "./layouts/default.vue";
import CounterView from "./pages/CounterView.vue";
import HomeView from "./pages/HomeView.vue";
import UserView from "./pages/UserView.vue";
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
				component: MainLayout,
				redirect: "home",
				children: [
					{
						path: "home",
						name: "home",
						component: HomeView,
					},
					{
						path: "/counter",
						name: "counter",
						component: CounterView,
					},
					{
						path: "/users",
						name: "users",
						component: UserView,
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
