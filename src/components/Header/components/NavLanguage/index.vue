<!-- 首页 -->
<script setup lang="ts">
import { ref, defineOptions } from "vue";
import { TranslationOutlined } from "@ant-design/icons-vue";
import { useI18n } from "vue-i18n";

const { locale } = useI18n();

const isLanguagePopover = ref(false); // 语言

// 设置语言
const putLanguage = (lang: string) => {
  isLanguagePopover.value = false;
  locale.value = lang;
  localStorage.setItem("lang", lang);
};

defineOptions({
  name: "NavLanguage",
});
</script>

<template>
  <a-popover
    v-model:visible="isLanguagePopover"
    :trigger="['click']"
    overlayClassName="i-popover-menu"
  >
    <template #content>
      <div
        class="i-popover-item"
        :class="{ active: locale === 'zh' }"
        @click="putLanguage('zh')"
      >
        中文简体
      </div>
      <div
        class="i-popover-item"
        :class="{ active: locale === 'en' }"
        @click="putLanguage('en')"
      >
        English
      </div>
    </template>
    <div class="nav-menu-item" title="切换语言">
      <translation-outlined style="font-size: 18px" />
    </div>
  </a-popover>
</template>

<style lang="less" scoped>
@import "./index.less";
</style>
