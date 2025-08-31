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
      // 自动导入组件的目录
      dirs: ['src/app/components', 'src/app/layouts', 'src/app/pages'],
      // 生成类型定义文件
      dts: 'types/components.d.ts',
      // 深度搜索子目录
      deep: true,
      // 包含的文件扩展名
      extensions: ['vue'],
      // 解析器配置
      resolvers: [PrimeVueResolver()],
    }),
  ],
});
