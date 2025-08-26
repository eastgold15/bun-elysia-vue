import { PrimeVueResolver } from "@primevue/auto-import-resolver";
import vue from "@vitejs/plugin-vue";
import { domco } from "domco";
import UnoCSS from "unocss/vite";

import Components from "unplugin-vue-components/vite";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [
		vue(),
		UnoCSS(), // add UnoCSS plugin
		domco(),
		Components({
			resolvers: [PrimeVueResolver()],
		}),
	],
});
