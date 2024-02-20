<!-- 语言 -->
<script setup lang="ts">
import { ref, defineOptions } from "vue";
import { DesktopOutlined } from "@ant-design/icons-vue";

defineOptions({
  name: "NavHome",
});
</script>

<template>
  <div class="nav-menu-item" title="首页">
    <desktop-outlined style="font-size: 18px" />
  </div>
</template>

<style lang="less" scoped>
@import "./index.less";
</style>
