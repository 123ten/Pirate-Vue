// store/index.ts
import { getTerminal } from "@/utils/common";
import { defineStore } from "pinia";
import type { HeaderInterface } from "./types";

export const useLayoutStore = defineStore("layoutStore", {
  state: (): HeaderInterface => {
    return {
      isMenuOutIn: false,
      isFullScreen: false,
      isLayoutFullScreen: false,
      isCurrentPageReload: false,
      isAsideMenu: false,
      menus: null,
    };
  },
  getters: {
    // 获取菜单列表，用于渲染左侧菜单栏，以及 tags，header，侧边栏抽屉，面包屑，路由，权限，动态路由，动态权限，动态菜单
    getMenus: (state) => {
      const menus = localStorage.getItem("BREADCRUMBKEYFORPM");
      return state.menus || menus || [];
    },
    // 获取终端类型 mobile pc
    terminalType: () => getTerminal(),
  },
  actions: {},
});
