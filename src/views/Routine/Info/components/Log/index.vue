<!-- 个人资料 - 操作日志 -->
<script setup lang="ts">
import {reactive} from "vue";
import {IPages} from "@/types";

const pages = reactive<IPages>({
  size: 10,
  page: 1,
  total: 0,
});

</script>

<template>
  <a-timeline>
    <a-timeline-item color="gray">
      <p>登录</p>
      <p>2023-01-01 01:01:10</p>
    </a-timeline-item>
  </a-timeline>
  <a-pagination
      v-model:current="pages.page"
      show-quick-jumper
      :total="pages.total"
  />
</template>

<style lang="less" scoped>
@import "./index.less";
</style>
