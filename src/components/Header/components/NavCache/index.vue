<!-- 个人信息 -->
<script setup lang="ts">
import { ref, defineOptions } from "vue";
import { notification } from "ant-design-vue";
import { DeleteOutlined } from "@ant-design/icons-vue";

const isCachePopover = ref(false); // 缓存

// 清楚缓存
const putCache = (type: number) => {
  isCachePopover.value = false;
  notification.success({
    message: "操作成功",
  });
};

defineOptions({
  name: "NavCache",
});
</script>

<template>
  <a-popover
    v-model:visible="isCachePopover"
    trigger="click"
    overlayClassName="i-popover-menu"
  >
    <template #content>
      <div class="i-popover-item" @click="putCache(1)">清理系统缓存</div>
      <div class="i-popover-item" @click="putCache(2)">清理浏览器缓存</div>
      <div class="i-popover-item" @click="putCache(3)">一键清理所有</div>
    </template>
    <div class="nav-menu-item" title="清楚缓存">
      <delete-outlined />
    </div>
  </a-popover>
</template>

<style lang="less" scoped>
@import "./index.less";
</style>
