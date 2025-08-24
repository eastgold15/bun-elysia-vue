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
import "virtual:uno.css";
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
				],
			},
		],
	});

	app.use(router);

	return { app, router };
};
