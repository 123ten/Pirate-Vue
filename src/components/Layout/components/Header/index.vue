<!-- header 头部 -->
<script setup lang="ts">
import {defineOptions, onBeforeMount} from "vue";
import {storeToRefs} from "pinia";
import {useLayoutStore} from "@/store";

const store = useLayoutStore();
const {isMenuOutIn, isAsideMenu, isLayoutFullScreen} = storeToRefs(store);

onBeforeMount(() => {
  init();
});

const init = () => {
  const _innerWidth = window.innerWidth;
  isMenuOutIn.value = isAsideMenu.value = _innerWidth <= 1200;
  if (isMenuOutIn.value && isAsideMenu.value) {
    isMenuOutIn.value = false;
  }
};

defineOptions({
  name: "Header",
});
</script>

<template>
  <header
      v-if="!isLayoutFullScreen"
      class="nav-bar d-flex-sb"
      :style="{ left: `${isMenuOutIn ? 96 : 232}px` }"
  >
    <tags-mobile v-if="isAsideMenu"/>
    <tags-pc v-else/>

    <div class="nav-menus d-flex-center">
      <!-- 首页 -->
      <nav-home/>
      <!-- 切换主题 -->
      <nav-theme/>
      <!-- 语言 -->
      <nav-language/>
      <!-- 全屏/取消全屏 -->
      <nav-full-screen :init="init"/>
      <!-- 消息 -->
      <nav-msg/>
      <!-- 清楚缓存 -->
      <nav-cache/>
      <!-- 个人信息 -->
      <nav-info/>
    </div>
  </header>
  <tags-pc v-if="isAsideMenu"/>
</template>

<style lang="less">
@import "./index.less";
</style>
