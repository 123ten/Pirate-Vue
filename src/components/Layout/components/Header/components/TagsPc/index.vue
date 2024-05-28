<!-- Tags 标签 -->
<script setup lang="ts">
import * as antIcons from "@ant-design/icons-vue";
import {CloseOutlined, DownOutlined} from "@ant-design/icons-vue";
import {defineOptions, nextTick, onMounted, reactive, ref, unref, watch,} from "vue";
import {useRoute, useRouter} from "vue-router";
import {storeToRefs} from "pinia";
import {useLayoutStore} from "@/store";
import {fullScreen} from "@/utils/dom";
import TagOverlay from "./components/Overlay/index.vue";

const store = useLayoutStore();

const {isLayoutFullScreen, isCurrentPageReload, isAsideMenu} =
  storeToRefs(store);
const router = useRouter();
const route = useRoute();

interface TagDataInterface {
  title: string;
  path: string;
}

interface MouseRightStateInterface {
  index: number;
  data: TagDataInterface;
}

enum OverlayEnum {
  'reload' = 1,
  'close',
  'fullScreen',
  'closeOther',
  'closeAll',
}

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
const tabList = ref<TagDataInterface[]>([]);
const currentTabIndex = ref<number>(0);
const isDelete = ref<boolean>(false); // 是否删除
const navTagsRef = ref<HTMLElement | null>(null);

onMounted(() => {
  // 默认初始化宽度
  unref(tabList).unshift({
    title: route.meta.title as string,
    path: route.path,
  });
  resetTagWidth(unref(tabList)[0].title.length);
});
watch(
  () => route.path,
  (newPath) => {
    // 删除标签时 不再执行路由监听
    if (isDelete.value) {
      isDelete.value = false;
      return;
    }
    const params: TagDataInterface = {
      title: route.meta.title as string,
      path: newPath,
    };
    // console.log(newPath, "newPathnewPath");
    // console.log(route.meta.title, "newPath");

    // 判断是否存在重复 tag
    const isRepeatTag = unref(tabList).some(
      (item) => item.path === params.path
    );
    // console.log(isRepeatTag, "isRepeatTag");
    if (!isRepeatTag) unref(tabList).unshift(params);

    // 获取下标 跳转到该下标
    const newTagIndex = unref(tabList).findIndex(
      (item) => item.path === params.path
    );
    // console.log(newTagIndex, "newTagIndex");

    handleTabItem(params, newTagIndex);
  }
);
/**
 * 重置 tag 背景宽度
 * @param length {number} 字体长度
 */
const resetTagWidth = (length: number) => {
  // 背景宽度 = 字体长度 * 字号大小 + (内外边距 + close 内外边距) + 路由图标宽度
  // 加上 x(icon) 49，不加上 x(icon) 32
  tagState.width = length * 14 + (unref(tabList).length !== 1 ? 49 : 32) + 18;
};
/**
 * @description 点击tab-item
 * @param data 跳转到的路由数据
 * @param index 点击 tab 下标
 */
const handleTabItem = (data: TagDataInterface, index: number) => {
  currentTabIndex.value = index;

  // 当小于1200px时
  if (isAsideMenu.value) {
    mouseRightState.index = index;
    mouseRightState.data = data;
  }
  // console.log(isDel, "isDelisDel");

  // console.log(length, index, isDel, "handleTabItem - index");
  // 偏移量 = 不包括自身 前面所有的宽度相加
  let count = 0;
  for (let i = 0; i < unref(tabList).length; i++) {
    const curLength = unref(tabList)[i].title.length;
    // console.log(curLength, i, "item");
    if (i === index) break;
    if (i < index) {
      count += curLength * 14 + 32 + 18; // 标题文字数量 * 字体大小 + 左右内边距 + 路由图标宽度
    }
  }
  tagState.x = count;

  if (data.path) {
    router.push(data.path);
  }

  resetTagWidth(data.title.length);
};
/**
 * @description 删除tab-item
 * @param index
 */
const delTabItem = (index: number) => {
  const _currentTabIndex = unref(currentTabIndex);

  // 删除当前标签时，不再执行路由监听
  if (_currentTabIndex === index) {
    isDelete.value = true;
  }

  // console.log(currentTabIndex.value, index, "currentTabIndex.value");
  // console.log("unref(tabList) -->", unref(tabList));

  unref(tabList).splice(index, 1);
  // 如点击最后一个 没有长度时 默认首页
  if (!unref(tabList).length) {
    unref(tabList).push({
      title: "首页",
      path: "/home",
    });
    return;
  }

  if (index === 0 && _currentTabIndex === index) {
    // 如点击下标为 0 的tab
    handleTabItem(unref(tabList)[index], index);
  } else if (_currentTabIndex === index && index !== 0) {
    // 如点击自身
    // 拿到上一位的长度
    handleTabItem(unref(tabList)[index - 1], index - 1);
  } else if (_currentTabIndex > index) {
    handleTabItem(unref(tabList)[_currentTabIndex - 1], _currentTabIndex - 1);
  } else {
    // 关闭非选中标签
    handleTabItem(unref(tabList)[index - 1], index - 1);
  }
};
// 鼠标右键点击时
const onMouseRight = (index: number, data: any) => {
  mouseRightState.index = index;
  mouseRightState.data = data;
  // console.log(mouseRightState, unref(currentTabIndex), 12312321);
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
  // console.log(status, mouseRightState, "type");
  const length = mouseRightState.data.title.length;
  if (status === 1) {
    isCurrentPageReload.value = true;
    nextTick(() => {
      isCurrentPageReload.value = false;
    });
  } else if (status === 2) {
    delTabItem(mouseRightState.index);
  } else if (status === 3) {
    fullScreen();
    isLayoutFullScreen.value = true;
    router.push(mouseRightState.data.path);
  } else if (status === 4) {
    tabList.value = tabList.value.filter(
      (_tab: TagDataInterface, index) => index === mouseRightState.index
    );
    currentTabIndex.value = 0;
    router.push(mouseRightState.data.path);
    resetTagWidth(length);
    tagState.x = 0;
  } else if (status === 5) {
    tabList.value = [];
    router.push("/home");
  }
};

/*
 * 鼠标滚轮滚动
 */
const onNavTagsWhell = (event: any) => {
  onWheelDelta(event, (delta: any) => {
    if (navTagsRef.value === null) return;
    // 最大滚动距离
    const maxScrollLeft =
      navTagsRef.value.scrollWidth - navTagsRef.value.offsetWidth;
    // 当最大滚动距离小于等于0时，不再滚动 减少性能消耗
    if (maxScrollLeft <= 0) return;
    // console.log("onNavTagsWhell", maxScrollLeft, event);
    if (delta > 0) {
      // 滚轮向上滚动
      navTagsRef.value.scrollLeft -= 50;
      if (navTagsRef.value.scrollLeft <= 0) {
        navTagsRef.value.scrollLeft = 0;
      }
    } else {
      // 滚轮向下滚动
      navTagsRef.value.scrollLeft += 50;
      if (navTagsRef.value.scrollLeft >= maxScrollLeft) {
        navTagsRef.value.scrollLeft = maxScrollLeft;
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

const overLayDisabled = (type: string): boolean => {
  if (type === 'reload') {
    return currentTabIndex.value !== mouseRightState.index
  }
  if (['close', 'closeOther', 'closeAll'].includes(type)) {
    return tabList.value.length === 1
  }
  return false
}

defineOptions({
  name: "TagsPc",
});
</script>

<template>
  <!-- isLayoutFullScreen 点击全屏时 去除加载动画-->
  <nav class="nav flex" v-if="!isLayoutFullScreen">
    <a-dropdown :trigger="['contextmenu']">
      <div
        class="nav-tags flex"
        ref="navTagsRef"
        @wheel="onNavTagsWhell"
      >
        <div
          class="nav-tabs-active-box"
          :style="{
            width: `${tagState.width}px`,
            transform: `translateX(${tagState.x}px)`,
          }"
        ></div>
        <div
          v-for="(item, index) in tabList"
          :key="item.title"
          class="nav-tag-item flex"
          :class="{
            active: currentTabIndex === index,
            activeClose: tabList.length !== 1 && currentTabIndex === index,
          }"
          @contextmenu.prevent="onMouseRight(index, item)"
          @click="handleTabItem(item, index)"
        >
          <component
            :is="antIcons['HomeOutlined']"
            class="text-xs mr-1.5"
          />
          {{ item.title }}
          <close-outlined
            v-if="tabList.length !== 1 && currentTabIndex === index"
            class="nav-tag-close text-[10px]"
            @click.stop="delTabItem(index)"
          />
        </div>
      </div>
      <template #overlay>
        <tag-overlay
          :disabled="overLayDisabled"
          @click="(type:string) => onMouseRightMenu(OverlayEnum[type])"
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
          @click="(type:string) => onMouseRightMenu(OverlayEnum[type])"
        />
      </template>
    </a-dropdown>
  </nav>
</template>

<style lang="less" scoped>
@import "./index.less";
</style>
