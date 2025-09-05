import { domco } from "@pori15/domco";
import { PrimeVueResolver } from "@primevue/auto-import-resolver";
import vue from "@vitejs/plugin-vue";
import UnoCSS from "unocss/vite";
import Components from "unplugin-vue-components/vite";
import { defineConfig } from "vite";
import { adapter } from '@domcojs/vercel'

export default defineConfig({
  plugins: [
    domco({ adapter: adapter() }),
    UnoCSS(),
    vue(),
    Components({
      // 自动导入组件的目录
      dts: 'types/components.d.ts',
      // 深度搜索子目录
      deep: true,

      resolvers: [PrimeVueResolver()],
    }),
  ]
});