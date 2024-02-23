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
const { isMenuOutIn, isAsideMenu, menus } = storeToRefs(store);

const openKeys = ref<string[]>([]);
const selectedKeys = ref<string[]>([]);

onMounted(() => {
  getMenus();
});

watch(
  () => route.path,
  () => {
    currentOpenMenu();
  }
);

const getMenus = () => {
  menus.value = data.data;
  currentOpenMenu();
};

/**
 * @description 当前打开的菜单
 */
const currentOpenMenu = () => {
  if (!unref(isMenuOutIn) && !unref(isAsideMenu) && route.meta.parentName) {
    openKeys.value = (route.meta.parentName as string).split(",");
  }
  selectedKeys.value = [route.name as string];
};
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
      <menu-unfold-outlined v-show="isMenuOutIn" v-if="!isAsideMenu" />
      <!-- 收起 -->
      <menu-fold-outlined v-show="!isMenuOutIn" />
    </div>
  </div>
  <div class="i-menu-content">
    <a-menu mode="inline" :open-keys="openKeys" :selected-keys="selectedKeys">
      <sider-barItem :menu="menus" />
    </a-menu>
  </div>
</template>

<style lang="less" scoped>
@import "./index.less";
</style>
