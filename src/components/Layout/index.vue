<!-- layout 主体 -->
<script setup lang="ts">
import {storeToRefs} from "pinia";
import {useMenuStore} from "@/store";

const store = useMenuStore();
const {isLayoutFullScreen, isCurrentPageReload} = storeToRefs(store);
</script>

<template>
  <a-layout class="container d-flex-default">
    <side-bar v-show="!isLayoutFullScreen"/>

    <a-layout class="layout">
      <Header v-show="!isLayoutFullScreen"/>
      <router-view
          :class="isLayoutFullScreen ? 'fullScreen' : ''"
          class="layout-view"
          v-slot="{ Component }"
      >
        <transition name="slide-right" mode="out-in">
          <component :is="Component" v-if="!isCurrentPageReload"/>
        </transition>
      </router-view>
    </a-layout>
  </a-layout>
</template>

<style lang="less" scoped>
@import "./index.less";
</style>
