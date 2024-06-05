<!-- 菜单 -->
<script setup lang="ts">
import {MenuFoldOutlined, MenuUnfoldOutlined,} from "@ant-design/icons-vue";

import {onMounted, ref, watch} from "vue";
import {storeToRefs} from "pinia";

import {useLayoutStore} from "@/store";

import {useRoute} from "vue-router";

import data from "../../data.json";

const route = useRoute();
const store = useLayoutStore();
const {isMenuOutIn, isAsideMenu, menus} = storeToRefs(store);

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
  if (!isMenuOutIn.value && !isAsideMenu.value && route.meta.parentName) {
    openKeys.value = (route.meta.parentName as string).split(",");
  }
  selectedKeys.value = [route.name as string];
};


defineOptions({
  name: 'SiderMenu'
})
</script>

<template>
  <div class="menu-logo flex items-center">
    <template v-if="!isMenuOutIn || isAsideMenu">
      <div class="logo-name flex items-center">
        <img class="logo-img" src="@/assets/images/logo_piece.png" alt="Pirate Admin"/>
        <div class="website-name">Pirate Admin</div>
      </div>
    </template>
    <!-- 点击展开收起菜单 -->
    <div
      class="flex items-center menu-icon cursor-pointer text-xl"
      @click="isMenuOutIn = !isMenuOutIn"
    >
      <!-- 展开 -->
      <menu-unfold-outlined v-show="isMenuOutIn" v-if="!isAsideMenu"/>
      <!-- 收起 -->
      <menu-fold-outlined v-show="!isMenuOutIn"/>
    </div>
  </div>
  <div class="i-menu-content">
    <a-menu mode="inline" :open-keys="openKeys" :selected-keys="selectedKeys">
      <sider-item :menu="menus"/>
    </a-menu>
  </div>
</template>

<style lang="less" scoped>
@import "./index.less";
</style>
