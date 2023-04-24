// routes.ts
import { RouteRecordRaw } from "vue-router";
const Layout = () => import("@/components/Layout/index.vue");
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
    path: "",
    component: Layout,
    children: [
      {
        path: "/home",
        name: "home",
        meta: {
          title: "首页",
        },
        component: () => import("@/views/Home/index.vue"),
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
    ],
  },
];
