import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path, { resolve } from "path";
import fs from "fs";
import Components from "unplugin-vue-components/vite";
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";
import mkcert from "vite-plugin-mkcert";

export default defineConfig({
  plugins: [
    vue(),
    Components({
      dirs: ["src/components"],
      resolvers: [AntDesignVueResolver()],
    }),
    mkcert(),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@assets": resolve(__dirname, "src/assets"),
      "@component": resolve(__dirname, "src/component"),
    },
  },
  server: {
    host: true, // 指定服务器应该监听哪个 IP 地址。 如果将此设置为 0.0.0.0 或者 true 将监听所有地址，包括局域网和公网地址。
    open: true, // 在开发服务器启动时自动在浏览器中打开应用程序。
    port: 4000, // 指定开发服务器端口
    hmr: true, // 热更新
    https: {
      // 主要是下面两行的配置文件，不要忘记引入 fs 和 path 两个对象
      cert: fs.readFileSync(path.join(__dirname, "src/ssl/cert.crt")),
      key: fs.readFileSync(path.join(__dirname, "src/ssl/cert.key")),
    },
  },

  css: {
    preprocessorOptions: {
      less: {
        modifyVars: { hack: 'true; @import "@/common/less/theme.less"' },
        javascriptEnabled: true,
        fileAsync: true,
      },
    },
  },

  build: {
    assetsInlineLimit: 8192, // 小于 8KB 的图片会被转换成 base64 编码的 Data URI 格式
    rollupOptions: {},
    assetsDir: "static", // 静态目录
  },
});
