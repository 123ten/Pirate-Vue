<!-- 菜单 -->
<script setup lang="ts">
import {storeToRefs} from "pinia";
import {useLayoutStore} from "@/store";

const store = useLayoutStore();
const {isMenuOutIn, isAsideMenu} = storeToRefs(store);

const onClose = () => {
  isMenuOutIn.value = false;
};

defineOptions({
  name: 'Sider'
})
</script>

<template>
  <a-drawer
    v-if="isAsideMenu"
    root-class-name="i-menu-mobile"
    placement="left"
    width="200"
    :open="isMenuOutIn"
    :closable="false"
    @close="onClose"
  >
    <sider-menu/>
  </a-drawer>
  <a-layout-sider
    v-else
    v-model:collapsed="isMenuOutIn"
    class="i-menu"
    collapsedWidth="64"
    collapsible
  >
    <sider-menu/>
  </a-layout-sider>
</template>

<style lang="less">
@import "./index.less";
</style>
