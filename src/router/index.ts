// index.ts
import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from "vue-router";
import { routes } from "./routes";
import NProgress from "nprogress";
import "nprogress/nprogress.css"; // nprogress样式文件
import GlobalLoading from "@/views/Common/Loading";
let timer;

// const history = createWebHashHistory(); // hash history
const history = createWebHistory(); // hash history
const router = createRouter({
  history, // 历史记录
  routes, // 路由的映射
});
//当路由开始跳转时
router.beforeEach((to, from, next) => {
  document.title = to.meta.title as string;
  // 开启进度条
  NProgress.start();
  // 开启全局loading 100ms后 如果页面没有加载完毕则显示loading 如果加载完毕则不显示loading 100ms是为了防止页面加载过快loading闪烁
  timer = setTimeout(() => {
    GlobalLoading.show();
  }, 100);
  // 这个一定要加，没有next()页面不会跳转的。这部分还不清楚的去翻一下官网就明白了
  next();
});
//当路由跳转结束后
router.afterEach(() => {
  // 关闭进度条
  NProgress.done();
  GlobalLoading.hide();
  timer && clearTimeout(timer);
});

// 导出路由，便于挂载
export default router;
