interface Menu {
  id?: string;
  title: string;
  path: string;
  name: string;
  icon: string;
  children?: Menu[];
}

export interface HeaderInterface {
  isMenuOutIn: boolean; // 是否收起左侧菜单栏 默认收起
  isFullScreen: boolean; // 是否全屏 默认 false
  isLayoutFullScreen: boolean; // 当前标签页全屏 引入地址 header 以及 tags
  isCurrentPageReload: boolean; // 重新加载当前页 默认不重新加载
  isAsideMenu: boolean; // 是否显示侧边栏抽屉 当 <= 1200 时 默认不显示
  menus: Menu[] | null; // 菜单列表
}
