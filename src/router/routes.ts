// routes.ts
import { RouteRecordRaw } from "vue-router";
const Layout = () => import("@components/Layout/index.vue");
export const routes: Array<RouteRecordRaw> = [
  {
    path: "",
    redirect: "/home",
  },
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/admin/login",
    meta: {
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
      title: "404 Not Found", // 页面不存在
    },
  },
  {
    path: "",
    component: Layout,
    children: [
      {
        path: "/home",
        name: "home",
        meta: {
          title: "首页",
        },
        component: () => import("@/views/Home/Index/index.vue"),
      },
      {
        path: "/auth",
        redirect: "group",
        children: [
          {
            path: "group",
            name: "group",
            meta: {
              parentName: "auth",
              title: "角色组管理",
            },
            component: () => import("@/views/Auth/Group/index.vue"),
          },
          {
            path: "admin",
            name: "admin",
            meta: {
              parentName: "auth",
              title: "管理员管理",
            },
            component: () => import("@/views/Auth/Admin/index.vue"),
          },
          {
            path: "menu",
            name: "menu",
            meta: {
              parentName: "auth",
              title: "菜单规则管理",
            },
            component: () => import("@/views/Auth/Menu/index.vue"),
          },
          {
            path: "adminLog",
            name: "adminLog",
            meta: {
              parentName: "auth",
              title: "管理员日志管理",
            },
            component: () => import("@/views/Auth/AdminLog/index.vue"),
          },
        ],
      },
      {
        path: "/user",
        redirect: "index",
        children: [
          {
            path: "index",
            name: "index",
            meta: {
              parentName: "user",
              title: "会员管理",
            },
            component: () => import("@/views/User/Index/index.vue"),
          },
          {
            path: "group",
            name: "/user/group",
            meta: {
              parentName: "user",
              title: "会员分组管理",
            },
            component: () => import("@/views/User/Group/index.vue"),
          },
          {
            path: "rule",
            name: "rule",
            meta: {
              parentName: "user",
              title: "会员规则管理",
            },
            component: () => import("@/views/User/UserRule/index.vue"),
          },
          {
            path: "userLog",
            name: "userLog",
            meta: {
              parentName: "user",
              title: "会员日志管理",
            },
            component: () => import("@/views/User/UserLog/index.vue"),
          },
        ],
      },
      {
        path: "/routine",
        redirect: "config",
        children: [
          {
            path: "config",
            name: "config",
            meta: {
              parentName: "routine",
              title: "系统配置",
            },
            component: () => import("@/views/Routine/Config/index.vue"),
          },
          {
            path: "annex",
            name: "annex",
            meta: {
              parentName: "routine",
              title: "附件管理",
            },
            component: () => import("@/views/Routine/Annex/index.vue"),
          },
          {
            path: "info",
            name: "info",
            meta: {
              parentName: "routine",
              title: "个人资料",
            },
            component: () => import("@/views/Routine/Info/index.vue"),
          },
        ],
      },
      {
        path: "/module",
        name: "module",
        meta: {
          title: "模块市场",
        },
        component: () => import("@/views/Module/Index/index.vue"),
      },
    ],
  },
];
