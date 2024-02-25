<!-- 黑/白 -->
<script setup lang="ts">
import { defineOptions, ref, onMounted } from "vue";

// 切换主题 黑/白 默认白 true; 黑 false
const visible = ref<boolean>(false);

onMounted(() => {
  const theme = localStorage.getItem("theme");
  visible.value = theme === "dark";
  // 设置主题
  window.document.documentElement.setAttribute("data-theme", theme || "light");
  window.document.documentElement.setAttribute("data-animation", "default");
});

const handleThemeChange = () => {
  visible.value = !visible.value;
  const theme = visible.value ? "dark" : "light";
  // 缓存主题
  localStorage.setItem("theme", theme);
  window.document.documentElement.setAttribute("data-theme", theme);
  window.document.documentElement.setAttribute("data-animation", "none");
  let animationTimer = setTimeout(() => {
    window.document.documentElement.setAttribute("data-animation", "default");
    clearTimeout(animationTimer);
  }, 1000);
};

defineOptions({
  name: "NavTheme",
});
</script>

<template>
  <div class="nav-menu-item" title="切换主题" @click="handleThemeChange">
    <sun-outlined v-if="visible" />
    <moon-outlined v-else />
  </div>
</template>

<style lang="less">
@import "./index.less";
</style>
