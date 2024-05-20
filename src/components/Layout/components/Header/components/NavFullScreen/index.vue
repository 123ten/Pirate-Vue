<!-- 全屏/取消全屏 -->
<script setup lang="ts">
import {
  defineOptions,
  onBeforeUnmount,
  onMounted,
  withDefaults,
} from "vue";
import { CompressOutlined, ExpandOutlined } from "@ant-design/icons-vue";
import { storeToRefs } from "pinia";
import { useLayoutStore } from "@/store";
import { fullScreen, exitFullScreen } from "@/utils/dom";

const store = useLayoutStore();
const { isFullScreen, isLayoutFullScreen } = storeToRefs(store);

interface IProps {
  init: () => void;
}

const props = withDefaults(defineProps<IProps>(), {
  init: () => {},
});

onMounted(() => {
  listenerChange(true);
});
onBeforeUnmount(() => {
  listenerChange(false);
});

// 展示全屏
const handleFullScreen = () => {
  isFullScreen.value = !isFullScreen.value;
  if (isFullScreen.value) {
    fullScreen();
  } else {
    exitFullScreen();
  }
};

// 监听全局事件
const listenerChange = (flag: boolean) => {
  const onResize = (event: any) => {
    isFullScreen.value = document.fullscreenElement !== null; // 当前是否全屏
    if (!document.fullscreenElement) {
      isLayoutFullScreen.value = false;
    }
    // 当视图宽度小于1200时 收起菜单栏
    props.init();
  };
  const onKeyDown = (event: any) => {
    if (event.keyCode === 122) {
      event.preventDefault(); // 取消默认事件
      handleFullScreen();
      // isLayoutFullScreen.value = false;
    }
  };
  if (flag) {
    // 监听页面事件
    window.addEventListener("resize", onResize);
    // 监听键盘事件
    window.addEventListener("keydown", onKeyDown);
  } else {
    // 取消监听页面事件
    window.removeEventListener("resize", onResize);
    // 取消监听键盘事件
    window.removeEventListener("keydown", onKeyDown);
  }
};

defineOptions({
  name: "NavFullScreen",
});
</script>

<template>
  <div
    class="nav-menu-item"
    @click="handleFullScreen"
    :title="isFullScreen ? '取消全屏' : '全屏'"
  >
    <div class="d-flex-center c-pointer user-select">
      <!-- 全屏 -->
      <compress-outlined v-show="isFullScreen" />
      <!-- 取消全屏 -->
      <expand-outlined v-show="!isFullScreen" />
    </div>
  </div>
</template>

<style lang="less" scoped>
@import "./index.less";
</style>
