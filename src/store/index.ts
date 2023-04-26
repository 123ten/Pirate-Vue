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

interface IHeader {
  isMenuOutIn: boolean; // 是否收起左侧菜单栏 默认展开
  isFullScreen: boolean; // 是否全屏 默认 false
  isLayoutFullScreen: boolean; // 当前标签页全屏 引入地址 header 以及 tags
  isCurrentPageReload: boolean; // 重新加载当前页 默认不重新加载
}

export const useMenuStore = defineStore("menuStore", {
  state: (): IHeader => {
    return {
      isMenuOutIn: false,
      isFullScreen: false,
      isLayoutFullScreen: false,
      isCurrentPageReload: false,
    };
  },
  getters: {},
  actions: {},
});
