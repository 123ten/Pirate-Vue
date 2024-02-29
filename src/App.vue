<!-- App.vue -->
<script setup lang="ts">
import zhCN from "ant-design-vue/es/locale/zh_CN";
import enGB from "ant-design-vue/es/locale/en_GB";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import { useI18n } from "vue-i18n";
import { onMounted, ref, watch } from "vue";
const { locale } = useI18n();

const aLocale = ref(zhCN);

onMounted(() => {
  const theme = localStorage.getItem("theme");
  // 设置主题
  window.document.documentElement.setAttribute("data-theme", theme || "light");
  window.document.documentElement.setAttribute("data-animation", "default");
});

watch(
  () => locale.value,
  (val) => {
    if (val === "en") {
      dayjs.locale("en");
      aLocale.value = enGB;
    } else {
      dayjs.locale("zh-cn");
      aLocale.value = zhCN;
    }
  }
);
</script>

<template>
  <a-config-provider :locale="aLocale">
    <router-view />
  </a-config-provider>
</template>

<style lang="less"></style>
