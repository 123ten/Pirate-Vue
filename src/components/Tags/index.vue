<!-- Tags 标签 -->
<script setup lang="ts">
import {
  CloseOutlined,
  SyncOutlined,
  ExpandOutlined,
  MinusOutlined,
  MinusSquareFilled,
} from "@ant-design/icons-vue";
import { onMounted, reactive, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useMenuStore } from "@/store";
import { fullScreen } from "@/utils/dom";
const store = useMenuStore();
const { isLayoutFullScreen } = storeToRefs(store);
const router = useRouter();
const route = useRoute();

interface ITagData {
  title: string;
  path: string;
}
interface IMouseRight {
  index: number;
  data: ITagData;
}
const tags = reactive({
  width: 2 * 14 + 49,
  x: 0,
});
const mouseRight = reactive<IMouseRight>({
  index: 0,
  data: {
    title: "",
    path: "",
  },
});
const tabList = ref<ITagData[]>([]);
const currentTabIndex = ref(0);
onMounted(() => {
  // 默认初始化宽度
  tabList.value.push({
    title: route.meta.title as string,
    path: route.path,
  });
  resetTagWidth(tabList.value[0].title.length, false);
});
watch(
  () => route.path,
  (newPath) => {
    const params: ITagData = {
      title: route.meta.title as string,
      path: newPath,
    };
    // console.log(newPath, "newPathnewPath");
    console.log(route.meta.title, "newPath");

    // 判断是否存在重复 tag
    const isRepeatTag = tabList.value.some((item) => item.path === params.path);
    // console.log(isRepeatTag, "isRepeatTag");
    if (!isRepeatTag) tabList.value.push(params);

    // 获取下标 跳转到该下标
    const newTagIndex = tabList.value.findIndex(
      (item) => item.path === params.path
    );
    // console.log(newTagIndex, "newTagIndex");

    handleTabItem(params, newTagIndex, tabList.value.length === 1);
  }
);
/**
 * 重置 tag 背景宽度
 * @param length {number}
 * @param isClose  {boolean} 是否有 close 有则加上 无则减去
 */
const resetTagWidth = (length: number, isClose: boolean = true) => {
  // 背景宽度 = 字体长度 * 字号大小 + (内外边距 + close 内外边距)
  tags.width = length * 14 + (isClose ? 49 : 32);
};
// 点击tab-item
const handleTabItem = (
  data: ITagData,
  index: number,
  isDel: boolean = false
) => {
  const length = data.title.length;
  // 当重复点击时, 不重复执行 且不为删除时
  if (currentTabIndex.value === index && !isDel) return false;
  currentTabIndex.value = index;
  // console.log(isDel, "isDelisDel");

  // console.log(length, index, isDel, "handleTabItem - index");
  resetTagWidth(length, !isDel);
  // 偏移量 = 不包括自身 前面所有的宽度相加
  let count = 0;
  for (let i = 0; i < tabList.value.length; i++) {
    const curLength = tabList.value[i].title.length;
    // console.log(curLength, i, "item");
    if (i === index) break;
    if (i < index) {
      count += curLength * 14 + 49;
    }
  }
  tags.x = count;

  if (data.path) router.push(data.path);
};
// 删除tab-item
const delTabItem = (index: number) => {
  console.log(currentTabIndex.value, index, "currentTabIndex.value");

  tabList.value.splice(index, 1);
  // 如点击最后一个 没有长度时 默认首页
  if (!tabList.value.length) {
    tabList.value.push({
      title: "首页",
      path: "/home",
    });
    return;
  }
  // 如点击下标为 0 的tab
  if (index === 0 && currentTabIndex.value === index) {
    console.log(tabList.value, "tabList.value");
    // handleTabItem(tabList.value[0], 0, true);
    resetTagWidth(tabList.value[0].title.length);
  } else if (currentTabIndex.value === index && index !== 0) {
    // 如点击自身

    // 拿到上一位的长度
    handleTabItem(tabList.value[index - 1], index - 1);
  } else if (currentTabIndex.value > index) {
    handleTabItem(
      tabList.value[currentTabIndex.value - 1],
      currentTabIndex.value - 1
    );
  }
  // 当长度为 1 时重新赋值长度
  // 背景宽度 = 字体长度 * 字号大小 + 内外边距
  if (tabList.value.length === 1) {
    const length = tabList.value[0].title.length;
    resetTagWidth(length, false);
  }
};
// 鼠标右键点击时
const onMouseRight = (index: number, data: any) => {
  mouseRight.index = index;
  mouseRight.data = data;
  console.log(mouseRight, currentTabIndex.value, 12312321);
};
/** TODO 鼠标右键菜单点击
 * @param {number} type  类型
 * 1.重新加载
 * 2.关闭标签
 * 3.当前标签全屏
 * 4.关闭其他标签
 * 5.关闭全部标签
 */
const onMouseRightMenu = (status: number) => {
  console.log(status, mouseRight, "type");
  const length = mouseRight.data.title.length;
  if (status === 2) {
    delTabItem(mouseRight.index);
  } else if (status === 3) {
    fullScreen();
    isLayoutFullScreen.value = true;
  } else if (status === 4) {
    tabList.value = tabList.value.filter(
      (item, index) => index === mouseRight.index
    );
    router.push(mouseRight.data.path);
    resetTagWidth(length, false);
    tags.x = 0;
  } else if (status === 5) {
    tabList.value = [];
    router.push("/home");
  }
};
</script>

<template>
  <!-- isLayoutFullScreen 点击全屏时 去除加载动画-->
  <a-dropdown :trigger="['contextmenu']" v-if="!isLayoutFullScreen">
    <div class="nav-tags d-flex-default">
      <div
        v-for="(item, index) in tabList"
        :key="item.title"
        class="nav-tag-item"
        @click="handleTabItem(item, index)"
        @click.right="onMouseRight(index, item)"
      >
        {{ item.title }}
        <CloseOutlined
          v-if="tabList.length !== 1"
          class="nav-tag-close"
          style="font-size: 10px"
          @click.stop="delTabItem(index)"
        />
      </div>
      <div
        class="nav-tabs-active-box"
        :style="{
          width: `${tags.width}px`,
          transform: `translateX(${tags.x}px)`,
        }"
      ></div>
    </div>
    <template #overlay>
      <a-menu>
        <a-menu-item
          key="1"
          @click="onMouseRightMenu(1)"
          :disabled="currentTabIndex !== mouseRight.index"
        >
          <SyncOutlined style="font-size: 12px" />
          重新加载
        </a-menu-item>
        <a-menu-item
          key="2"
          @click="onMouseRightMenu(2)"
          :disabled="tabList.length === 1"
        >
          <CloseOutlined style="font-size: 12px" />
          关闭标签
        </a-menu-item>
        <a-menu-item key="3" @click="onMouseRightMenu(3)">
          <ExpandOutlined style="font-size: 12px" />
          当前标签页全屏
        </a-menu-item>
        <a-menu-item
          key="4"
          @click="onMouseRightMenu(4)"
          :disabled="tabList.length === 1"
        >
          <MinusOutlined style="font-size: 12px" />
          关闭其他标签页
        </a-menu-item>
        <a-menu-item
          key="5"
          @click="onMouseRightMenu(5)"
          :disabled="tabList.length === 1"
        >
          <MinusSquareFilled style="font-size: 12px" />
          关闭全部标签页
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<style lang="less" scoped>
@import "./index.less";
</style>
