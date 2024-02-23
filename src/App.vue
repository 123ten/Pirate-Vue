<!-- App.vue -->
<script setup lang="ts">
import zhCN from "ant-design-vue/es/locale/zh_CN";
import enGB from "ant-design-vue/es/locale/en_GB";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import { useI18n } from "vue-i18n";
import { ref, watch } from "vue";
const { locale } = useI18n();

const aLocale = ref(zhCN);

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

<style  lang="less">
</style>
