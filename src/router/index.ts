// index.ts
import { createRouter, createWebHashHistory } from "vue-router";
import { routes } from "./routes";
import NProgress from "nprogress";
import "nprogress/nprogress.css"; // nprogress样式文件

const history = createWebHashHistory(); // hash history
const router = createRouter({
  history, // 历史记录
  routes, // 路由的映射
});
//当路由开始跳转时
router.beforeEach((to, from, next) => {
  // 开启进度条
  NProgress.start();
  // 这个一定要加，没有next()页面不会跳转的。这部分还不清楚的去翻一下官网就明白了
  next();
});
//当路由跳转结束后
router.afterEach(() => {
  // 关闭进度条
  NProgress.done();
});

// 导出路由，便于挂载
export default router;
