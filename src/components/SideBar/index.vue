<!-- 菜单 -->
<script setup lang="ts">
import {storeToRefs} from "pinia";
import {useMenuStore} from "@/store";

const store = useMenuStore();
const {isMenuOutIn, isAsideMenu} = storeToRefs(store);

const onClose = () => {
  isMenuOutIn.value = false;
};
</script>

<template>
  <a-drawer
      v-if="isAsideMenu"
      placement="left"
      :closable="false"
      :visible="isMenuOutIn"
      @close="onClose"
      class="i-menu-mobile"
      width="200"
  >
    <side-bar-menu/>
  </a-drawer>
  <a-layout-sider
      v-else
      v-model:collapsed="isMenuOutIn"
      collapsible
      class="i-menu"
      collapsedWidth="64"
  >
    <side-bar-menu/>
  </a-layout-sider>
</template>

<style lang="less" scoped>
@import "./index.less";
</style>
