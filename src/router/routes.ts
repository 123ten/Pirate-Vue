// routes.ts
import {RouteRecordRaw} from "vue-router";
import {dynamicRouter} from './dynamicRoutes'

export const routes: Array<RouteRecordRaw> = [
  {
    path: "",
    redirect: "/home",
  },
  {
    path: "/admin/login",
    meta: {
      name: "login",
      title: "登录页",
    },
    component: () => import("@/views/Login/index.vue"),
  },
  {
    // 404
    path: "/404",
    name: "notFound",
    component: () => import("@/views/Common/Error/404/404.vue"),
    meta: {
      name: "notFound",
      title: "404 Not Found", // 页面不存在
    },
  },
  {
    // 404 其他不存在的页面都重定向到404
    path: "/:pathMatch(.*)",
    redirect: "/404",
  },
  {
    path: "",
    meta: {
      name: "layout",
      title: "首页",
    },
    component: () => import("@components/Layout/index.vue"),
    children: dynamicRouter,
  },
];
