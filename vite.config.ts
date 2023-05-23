import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import Components from "unplugin-vue-components/vite";
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";

export default defineConfig({
  plugins: [
    vue(),
    Components({
      dirs: ["src/components"],
      resolvers: [AntDesignVueResolver()],
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  server: {
    host: true, // 指定服务器应该监听哪个 IP 地址。 如果将此设置为 0.0.0.0 或者 true 将监听所有地址，包括局域网和公网地址。
    open: true, // 在开发服务器启动时自动在浏览器中打开应用程序。
    port: 4000, // 指定开发服务器端口
    hmr: true, // 热更新
  },

  css: {
    preprocessorOptions: {
      less: {
        modifyVars: { hack: 'true; @import "@/common/less/theme.less"' },
        javascriptEnabled: true,
      },
    },
  },
});
