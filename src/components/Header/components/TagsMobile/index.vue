<!-- Tags 标签 -->
<script setup lang="ts">
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons-vue";
import { onMounted, reactive, ref, watch, nextTick, unref } from "vue";
import { storeToRefs } from "pinia";
import { useMenuStore } from "@/store";
const store = useMenuStore();
const { isMenuOutIn, isLayoutFullScreen, isCurrentPageReload } =
  storeToRefs(store);

onMounted(() => {});
</script>

<template>
  <!-- 点击展开收起菜单 -->
  <div
    class="d-flex-center menu-icon c-pointer"
    @click="isMenuOutIn = !isMenuOutIn"
  >
    <!-- 展开 -->
    <menu-unfold-outlined style="font-size: 18px" />
  </div>
</template>

<style lang="less" scoped>
@import "./index.less";
</style>
