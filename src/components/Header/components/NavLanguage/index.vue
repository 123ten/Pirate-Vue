<!-- 首页 -->
<script setup lang="ts">
import { ref, defineOptions } from "vue";
import { TranslationOutlined } from "@ant-design/icons-vue";

const isLanguagePopover = ref(false); // 语言

// 设置语言
const putLanguage = (type: number) => {
  isLanguagePopover.value = false;
};

defineOptions({
  name: "NavLanguage",
});
</script>

<template>
  <a-popover
    v-model="isLanguagePopover"
    :trigger="['click']"
    overlayClassName="i-popover-menu"
  >
    <template #content>
      <div class="i-popover-item" @click="putLanguage(1)">中文简体</div>
      <div class="i-popover-item" @click="putLanguage(2)">English</div>
    </template>
    <div class="nav-menu-item" title="切换语言">
      <translation-outlined style="font-size: 18px" />
    </div>
  </a-popover>
</template>

<style lang="less" scoped>
@import "./index.less";
</style>
