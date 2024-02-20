// store/index.ts
import { defineStore } from "pinia";
export const useStore = defineStore("main", {
  state: () => {
    return {
      count: 0,
    };
  },
  getters: {},
  actions: {},
});

interface Menu {
  id?: string;
  title: string;
  path: string;
  name: string;
  icon: string;
  children?: Menu[];
}

interface HeaderInterface {
  isMenuOutIn: boolean; // 是否收起左侧菜单栏 默认收起
  isFullScreen: boolean; // 是否全屏 默认 false
  isLayoutFullScreen: boolean; // 当前标签页全屏 引入地址 header 以及 tags
  isCurrentPageReload: boolean; // 重新加载当前页 默认不重新加载
  isAsideMenu: boolean; // 是否显示侧边栏抽屉 当 <= 1200 时 默认不显示
  menus: Menu[] | null; // 菜单列表
}

export const useMenuStore = defineStore("menuStore", {
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
  },
  actions: {},
});
