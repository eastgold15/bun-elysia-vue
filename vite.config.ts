import { PrimeVueResolver } from "@primevue/auto-import-resolver";
import vue from "@vitejs/plugin-vue";
import { domco } from "domco";
import UnoCSS from "unocss/vite";
import { adapter } from "@domcojs/vercel";
import Components from "unplugin-vue-components/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    // 基础插件
    UnoCSS(),
    vue(),
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
    // domco 相关插件放在最后，确保其他虚拟模块已准备好
    domco(),
    adapter(),
  ],
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        // 打印所有警告信息
        console.warn('Rollup warning:', warning);
        warn(warning);
      },
      external: ['bun'],
      // 添加更多构建选项来优化 SSR 构建过程
      output: {
        // 分块策略，可能有助于解决卡住的问题
        manualChunks: {
          // 将 drizzle 相关代码分离到独立的 chunk 中
          drizzle: ['drizzle-orm']
        }
      }
    },
    // 增加构建超时时间，避免因处理时间过长而中断
    chunkSizeWarningLimit: 1000
  },
  // 添加 SSR 配置，明确指定 SSR 外部依赖
  ssr: {
    external: ['bun', 'drizzle-orm'],
    noExternal: []
  }
});