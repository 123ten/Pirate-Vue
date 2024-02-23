<!-- 黑/白 -->
<script setup lang="ts">
import { defineOptions, ref } from "vue";

// 切换主题 黑/白 默认白 true; 黑 false
const visible = ref<boolean>(false);

const handleThemeChange = () => {
  visible.value = !visible.value;
  // 缓存主题
  localStorage.setItem("theme", visible.value ? "dark" : "light");
};

defineOptions({
  name: "NavTheme",
});
</script>

<template>
  <div class="nav-menu-item" title="切换主题" @click="handleThemeChange">
    <sun-outlined v-if="visible" />
    <moom-outlined v-else />
  </div>
</template>

<style lang="less">
@import "./index.less";
</style>
