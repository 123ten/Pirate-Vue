<!-- header 头部 -->
<script setup lang="ts">
import { onBeforeMount } from "vue";
import { storeToRefs } from "pinia";
import { useMenuStore } from "@/store";

const store = useMenuStore();
const { isMenuOutIn, isAsideMenu, isLayoutFullScreen } = storeToRefs(store);

onBeforeMount(() => {
  init();
});

const init = () => {
  const _innerWidth = window.innerWidth;
  const is1200 = _innerWidth <= 1200;
  if (is1200) {
    // 小于等 1200 mobile 模式 收起侧边栏
    isAsideMenu.value = true;
    isMenuOutIn.value = false;
  } else {
    // 小于等 1200 mobile 模式 展开侧边栏
    isAsideMenu.value = false;
    isMenuOutIn.value = _innerWidth > 1200 && _innerWidth < 1500;
  }
};
</script>

<template>
  <header
    v-if="!isLayoutFullScreen"
    class="nav-bar d-flex-sb"
    :style="{ left: `${isMenuOutIn ? 96 : 232}px` }"
  >
    <tags-mobile v-if="isAsideMenu" />
    <tags-pc v-else />

    <div class="nav-menus d-flex-center">
      <!-- 首页 -->
      <nav-home />
      <!-- 语言 -->
      <nav-language />
      <!-- 全屏/取消全屏 -->
      <nav-full-screen :init="init" />
      <!-- 消息 -->
      <nav-msg />
      <!-- 清楚缓存 -->
      <nav-cache />
      <!-- 个人信息 -->
      <nav-info />
    </div>
  </header>
  <tags-pc v-if="isAsideMenu" />
</template>

<style lang="less">
@import "./index.less";
</style>
