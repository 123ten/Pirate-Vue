<!-- Tags 标签 -->
<script setup lang="ts">
import * as antIcons from "@ant-design/icons-vue";
import {CloseOutlined, DownOutlined} from "@ant-design/icons-vue";
import {defineOptions, nextTick, onMounted, reactive, ref,} from "vue";
import {onBeforeRouteUpdate, RouteLocationNormalized, useRoute, useRouter} from "vue-router";
import {storeToRefs} from "pinia";
import {useLayoutStore} from "@/store";
import useNavTabs from "@/store/hooks/useNavTabs";
import {fullScreen} from "@/utils/dom";
import TagOverlay from "./components/Overlay/index.vue";
import {type OverlayType} from './components/Overlay/interface'

const layoutStore = useLayoutStore();
const {isLayoutFullScreen, isCurrentPageReload, isAsideMenu} = storeToRefs(layoutStore);
const navTabs = useNavTabs()

const router = useRouter();
const route = useRoute();

interface ITagItem {
  title: string;
  path: string;
}

interface MouseRightStateInterface {
  index: number;
  data: ITagItem;
}

enum OverlayEnum {
  'refresh' = 1,
  'close',
  'fullScreen',
  'closeOther',
  'closeAll',
}

const tabsRefs = ref();
const tabItemRefs = ref<HTMLDivElement[]>([])

const tagState = reactive({
  width: 2 * 14 + 32,
  x: 0,
});
const mouseRightState = reactive<MouseRightStateInterface>({
  index: 0,
  data: {
    title: "",
    path: "",
  },
});

const hoverIndex = ref<number>(-1);

onMounted(async () => {
  // 这里的数据不需要被响应式包裹
  // navTabs.set(cloneDeep(route))
  await updateTab(router.currentRoute.value)
});

onBeforeRouteUpdate(async to => {
  await updateTab(to)
})

const updateTab = async (to: RouteLocationNormalized) => {
  navTabs.addTab(to)
  navTabs.setActiveRoute(to)
  await nextTick()
  selectNavTab(tabItemRefs.value[navTabs.activeIndex])
}


/**
 * 修改x轴偏移量
 * @param index
 */
const changeOffsetLeft = async (index: number, type?: 'enter' | 'level') => {
  if (type === 'enter') {
    hoverIndex.value = index
  } else {
    hoverIndex.value = -1
  }
  await nextTick()
  selectNavTab(tabItemRefs.value[navTabs.activeIndex])
}
/**
 * @description 删除tab-item
 * @param index
 */
const closeTab = (index: number) => {
  const activeIndex = navTabs.activeIndex

  navTabs.tabList.splice(index, 1);

  if (activeIndex !== index) return
  console.log('closeTab --> index', index)

  if (navTabs.tabList[index]) {
    router.push(navTabs.tabList[index])
  } else if (navTabs.tabList[index - 1]) {
    router.push(navTabs.tabList[index - 1])
  } else if (navTabs.tabList[index + 1]) {
    router.push(navTabs.tabList[index + 1])
  } else {
    router.push("/home");
  }
};

// 鼠标右键点击时
const onMouseRight = (index: number, data: any) => {
  mouseRightState.index = index;
  mouseRightState.data = data;
};
/**
 * @description 鼠标右键菜单点击
 * @param {number} status  类型
 * 1.重新加载
 * 2.关闭标签
 * 3.当前标签全屏
 * 4.关闭其他标签
 * 5.关闭全部标签
 */
const onMouseRightMenu = (status: number) => {
  if (status === 1) {
    isCurrentPageReload.value = true;
    nextTick(() => {
      isCurrentPageReload.value = false;
    });
  } else if (status === 2) {
    closeTab(mouseRightState.index);
  } else if (status === 3) {
    fullScreen();
    isLayoutFullScreen.value = true;
    router.push(mouseRightState.data.path);
  } else if (status === 4) {
    const tabs = navTabs.tabList.filter((_tab: RouteLocationNormalized, index) => index === mouseRightState.index);
    navTabs.assign(tabs)
    router.push(mouseRightState.data.path);
  } else if (status === 5) {
    navTabs.assign([])
    router.push("/home");
  }
};

/*
 * 鼠标滚轮滚动
 */
const handleTabsWheel = (event: any) => {
  onWheelDelta(event, (delta: any) => {
    if (tabsRefs.value === null) return;
    // 最大滚动距离
    const maxScrollLeft =
      tabsRefs.value.scrollWidth - tabsRefs.value.offsetWidth;
    // 当最大滚动距离小于等于0时，不再滚动 减少性能消耗
    if (maxScrollLeft <= 0) return;
    // console.log("handleTabsWheel", maxScrollLeft, event);
    if (delta > 0) {
      // 滚轮向上滚动
      tabsRefs.value.scrollLeft -= 50;
      if (tabsRefs.value.scrollLeft <= 0) {
        tabsRefs.value.scrollLeft = 0;
      }
    } else {
      // 滚轮向下滚动
      tabsRefs.value.scrollLeft += 50;
      if (tabsRefs.value.scrollLeft >= maxScrollLeft) {
        tabsRefs.value.scrollLeft = maxScrollLeft;
      }
    }
  });
};

/**
 * 鼠标滚轮滚动事件
 */
const onWheelDelta = (e: any, cb: any) => {
  if (!window.scrollY) {
    // 禁止页面滚动
    e.preventDefault();

    if (e.wheelDelta) {
      // 判断浏览器IE，谷歌滑轮事件
      cb(e.wheelDelta);
    } else if (e.detail) {
      // Firefox滑轮事件
      cb(e.detail);
    }
  }
};

/**
 * 禁用右键的menu选项
 * @param type
 */
const overLayDisabled = (type: OverlayType): boolean => {
  if (type === 'refresh') {
    return navTabs.activeIndex !== mouseRightState.index
  }
  if (['close', 'closeOther', 'closeAll'].includes(type)) {
    return navTabs.tabList.length === 1
  }
  return false
}

const handleTagOverlay = (type: OverlayType) => onMouseRightMenu(OverlayEnum[type])

const handleTabTo = (route: RouteLocationNormalized) => {
  router.push(route)
}

const selectNavTab = (dom: HTMLDivElement) => {
  if (!dom) return
  // console.log('dom -->', dom.offsetLeft, dom.clientWidth)

  tagState.x = dom.offsetLeft
  tagState.width = dom.clientWidth

  let scrollLeft = dom.offsetLeft + dom.clientWidth - tabsRefs.value.clientWidth
  if (dom.offsetLeft < tabsRefs.value.scrollLeft) {
    tabsRefs.value.scrollTo(dom.offsetLeft, 0)
  } else if (scrollLeft > tabsRefs.value.scrollLeft) {
    tabsRefs.value.scrollTo(scrollLeft, 0)
  }
}

/**
 * 手动设置 ref
 * @param el
 * @param index
 */
const setItemRefs = (el: HTMLDivElement | null, index: number) => {
  if (el) {
    tabItemRefs.value[index] = el;
  }
};

defineOptions({
  name: "TagsPc",
});
</script>

<template>
  <!-- isLayoutFullScreen 点击全屏时 去除加载动画-->
  <nav class="nav flex" v-if="!isLayoutFullScreen">
    <a-dropdown :trigger="['contextmenu']">
      <div
        ref="tabsRefs"
        class="nav-tags flex overflow-hidden"
      >
        <div
          class="nav-tabs-active-box"
          :style="{
            width: `${tagState.width}px`,
            transform: `translateX(${tagState.x}px)`,
          }"
        ></div>
        <div
          v-for="(item, index) in navTabs.tabList"
          :key="item.meta.title"
          :ref="el => setItemRefs(el as HTMLDivElement,index)"
          class="nav-tag-item flex"
          :class="{
            active: navTabs.activeIndex === index,
            activeClose: navTabs.tabList.length !== 1 && navTabs.activeIndex === index,
          }"
          @contextmenu.prevent="onMouseRight(index, item)"
          @click="handleTabTo(item)"
          @mouseenter="changeOffsetLeft(index,'enter')"
          @mouseleave="changeOffsetLeft(index,'level')"
        >
          <component
            :is="antIcons['HomeOutlined']"
            class="text-xs mr-1.5"
          />
          {{ item.meta.title }}
          <transition
            name="fade"
            @after-leave="selectNavTab(tabItemRefs[navTabs.activeIndex])"
            @after-enter="selectNavTab(tabItemRefs[navTabs.activeIndex])"
          >
            <close-outlined
              v-if="navTabs.tabList.length !== 1 && (navTabs.activeIndex === index || hoverIndex === index)"
              class="nav-tag-close"
              @click.stop="closeTab(index)"
            />
          </transition>
        </div>
      </div>
      <template #overlay>
        <tag-overlay
          :disabled="overLayDisabled"
          @click="handleTagOverlay"
        />
      </template>
    </a-dropdown>
    <a-dropdown v-if="isAsideMenu">
      <div class="more c-pointer d-flex-center">
        <span class="more-txt">更多</span>
        <down-outlined/>
      </div>
      <template #overlay>
        <tag-overlay
          :disabled="overLayDisabled"
          @click="handleTagOverlay"
        />
      </template>
    </a-dropdown>
  </nav>
</template>

<style lang="less" scoped>
@import "./index.less";
</style>
