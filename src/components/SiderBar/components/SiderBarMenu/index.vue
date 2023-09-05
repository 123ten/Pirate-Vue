<!-- 菜单 -->
<script setup lang="ts">
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
} from "@ant-design/icons-vue";

import { onMounted, ref, unref, watch } from "vue";
import { storeToRefs } from "pinia";

import { useMenuStore } from "@/store";

import { useRoute } from "vue-router";

import data from "../../data.json";
const route = useRoute();
const store = useMenuStore();
const { isMenuOutIn, isAsideMenu } = storeToRefs(store);

const openKeys = ref<string[]>([]);
const selectedKeys = ref<string[]>([]);

onMounted(() => {
  currentOpenMenu();
});
const currentOpenMenu = () => {
  if (!unref(isMenuOutIn) && !unref(isAsideMenu)) {
    openKeys.value = [route.meta.parentName as string];
  }
  selectedKeys.value = [route.name as string];
};
watch(
  () => route.path,
  () => {
    console.log(route.name, "route");
    currentOpenMenu();
  }
);
</script>

<template>
  <div class="menu-logo d-flex-center">
    <template v-if="!isMenuOutIn || isAsideMenu">
      <div class="logo-name d-flex-center">
        <img class="logo-img" src="@/assets/images/logo_piece.png" alt="" />
        <div class="website-name">Pirate Vue</div>
      </div>
    </template>
    <!-- 点击展开收起菜单 -->
    <div
      class="d-flex-center menu-icon c-pointer"
      @click="isMenuOutIn = !isMenuOutIn"
    >
      <!-- 展开 -->
      <MenuUnfoldOutlined
        v-show="isMenuOutIn"
        v-if="!isAsideMenu"
        style="font-size: 18px"
      />
      <!-- 收起 -->
      <MenuFoldOutlined v-show="!isMenuOutIn" style="font-size: 18px" />
    </div>
  </div>

  <div class="i-menu-content">
    <a-menu
      mode="inline"
      v-model:openKeys="openKeys"
      v-model:selectedKeys="selectedKeys"
    >
      <SiderBarItem :menu="data.data" />
    </a-menu>
  </div>
</template>

<style lang="less" scoped>
@import "./index.less";
</style>
