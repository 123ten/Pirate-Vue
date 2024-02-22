<!-- Tags 标签 -->
<script setup lang="ts">
import {
  CloseOutlined,
  DownOutlined,
  SyncOutlined,
  ExpandOutlined,
  MinusOutlined,
  MinusSquareFilled,
} from "@ant-design/icons-vue";
import * as antIcons from "@ant-design/icons-vue";
import {
  defineOptions,
  onMounted,
  reactive,
  ref,
  watch,
  nextTick,
  unref,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useMenuStore } from "@/store";
import { fullScreen } from "@/utils/dom";
const store = useMenuStore();
const { isLayoutFullScreen, isCurrentPageReload, isAsideMenu } =
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
    console.log(route.meta.title, "newPath");

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
      (item, index) => index === mouseRightState.index
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

defineOptions({
  name: "TagsPc",
});
</script>

<template>
  <!-- isLayoutFullScreen 点击全屏时 去除加载动画-->
  <nav class="nav d-flex-default" v-if="!isLayoutFullScreen">
    <a-dropdown :trigger="['contextmenu']">
      <div class="nav-tags d-flex-default">
        <div
          v-for="(item, index) in tabList"
          :key="item.title"
          class="nav-tag-item d-flex-default"
          :class="{
            active: currentTabIndex === index,
            activeClose: tabList.length !== 1 && currentTabIndex === index,
          }"
          @contextmenu.prevent="onMouseRight(index, item)"
          @click="handleTabItem(item, index)"
        >
          <component
            :is="antIcons['HomeOutlined']"
            style="font-size: 12px; margin-right: 6px"
          />
          {{ item.title }}
          <close-outlined
            v-if="tabList.length !== 1 && currentTabIndex === index"
            class="nav-tag-close"
            style="font-size: 10px"
            @click.stop="delTabItem(index)"
          />
        </div>
        <div
          class="nav-tabs-active-box"
          :style="{
            width: `${tagState.width}px`,
            transform: `translateX(${tagState.x}px)`,
          }"
        ></div>
      </div>
      <template #overlay>
        <a-menu>
          <a-menu-item
            key="1"
            @click="onMouseRightMenu(1)"
            :disabled="currentTabIndex !== mouseRightState.index"
          >
            <sync-outlined style="font-size: 12px" />
            重新加载
          </a-menu-item>
          <a-menu-item
            key="2"
            @click="onMouseRightMenu(2)"
            :disabled="tabList.length === 1"
          >
            <close-outlined style="font-size: 12px" />
            关闭标签
          </a-menu-item>
          <a-menu-item key="3" @click="onMouseRightMenu(3)">
            <expand-outlined style="font-size: 12px" />
            当前标签页全屏
          </a-menu-item>
          <a-menu-item
            key="4"
            @click="onMouseRightMenu(4)"
            :disabled="tabList.length === 1"
          >
            <minus-outlined style="font-size: 12px" />
            关闭其他标签页
          </a-menu-item>
          <a-menu-item
            key="5"
            @click="onMouseRightMenu(5)"
            :disabled="tabList.length === 1"
          >
            <minus-square-filled style="font-size: 12px" />
            关闭全部标签页
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
    <a-dropdown v-if="isAsideMenu">
      <div class="more c-pointer d-flex-center">
        <span class="more-txt">更多</span>
        <down-outlined />
      </div>
      <template #overlay>
        <a-menu>
          <a-menu-item
            key="1"
            @click="onMouseRightMenu(1)"
            :disabled="currentTabIndex !== mouseRightState.index"
          >
            <sync-outlined style="font-size: 12px" />
            重新加载
          </a-menu-item>
          <a-menu-item
            key="2"
            @click="onMouseRightMenu(2)"
            :disabled="tabList.length === 1"
          >
            <close-outlined style="font-size: 12px" />
            关闭标签
          </a-menu-item>
          <a-menu-item key="3" @click="onMouseRightMenu(3)">
            <expand-outlined style="font-size: 12px" />
            当前标签页全屏
          </a-menu-item>
          <a-menu-item
            key="4"
            @click="onMouseRightMenu(4)"
            :disabled="tabList.length === 1"
          >
            <minus-outlined style="font-size: 12px" />
            关闭其他标签页
          </a-menu-item>
          <a-menu-item
            key="5"
            @click="onMouseRightMenu(5)"
            :disabled="tabList.length === 1"
          >
            <minus-square-filled style="font-size: 12px" />
            关闭全部标签页
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
  </nav>
</template>

<style lang="less" scoped>
@import "./index.less";
</style>
