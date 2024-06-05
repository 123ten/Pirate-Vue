import {defineStore} from "pinia";
import {reactive, ref} from "vue";
import {RouteLocationNormalized} from "vue-router";

export default defineStore('navTabs', () => {
  /** navTab存储数据 */
  const tabList = ref<RouteLocationNormalized[]>([]);
  /** 当前选中下标 */
  const activeIndex = ref<number>(0);
  /** 当前选中路由 */
  const activeRoute = ref<RouteLocationNormalized>();

  /**
   * 添加 tab
   * @param route
   */
  const addTab = (route: RouteLocationNormalized) => {
    if (!route.meta.showNav) return;
    for (const key in tabList.value) {
      const navTab = tabList.value[key]
      if (navTab.path === route.path) {
        return
      }
    }
    tabList.value.unshift(route)
  }

  const assign = (routes: RouteLocationNormalized[]) => {
    console.log('routes', routes)
    tabList.value = routes
  }

  /**
   * 设置激活状态
   * @param route
   */
  const setActiveRoute = (route: RouteLocationNormalized) => {
    const currentRouteIndex = tabList.value.findIndex(tab => tab.path === route.path)
    if (currentRouteIndex === -1) return
    activeRoute.value = route
    activeIndex.value = currentRouteIndex
  }

  const closeTab = (route: RouteLocationNormalized) => {
    for (const key in tabList.value) {
      const navTab = tabList.value[key]
      if (navTab.path === route.path) {
        tabList.value.splice(+key, 1)
        return
      }
    }
  }

  return {
    tabList,
    activeIndex,
    activeRoute,
    addTab,
    closeTab,
    setActiveRoute,
    assign
  }
});
