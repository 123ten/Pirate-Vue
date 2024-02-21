<!-- App.vue -->
<script setup lang="ts">
import zhCN from "ant-design-vue/es/locale/zh_CN";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import { ref } from "vue";
dayjs.locale("zh-cn");
const locale = ref(zhCN);

</script>

<template>
  <a-config-provider :locale="locale">
    <router-view />
  </a-config-provider>
</template>

<style scoped lang="less"></style>
