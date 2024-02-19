<!-- 消息 -->
<script setup lang="ts">
import { defineOptions } from "vue";
import { BellOutlined } from "@ant-design/icons-vue";

defineOptions({
  name: "NavMsg",
});
</script>

<template>
  <div class="nav-menu-item" title="消息">
    <bell-outlined style="font-size: 18px" class="msg-icon" />
  </div>
</template>

<style lang="less" scoped>
@import "./index.less";
</style>
