<!-- layout 主体 -->
<script setup lang="ts">
import {storeToRefs} from "pinia";
import {useLayoutStore} from "@/store";

const store = useLayoutStore();
const {isLayoutFullScreen, isCurrentPageReload} = storeToRefs(store);
</script>

<template>
  <a-layout class="pirate-container xl:pt-4">
    <sider v-show="!isLayoutFullScreen"/>

    <a-layout class="layout">
      <Header v-if="!isLayoutFullScreen"/>
      <a-layout-content class="overflow-y-auto overflow-x-hidden">
        <router-view
          class="layout-view"
          :class="{fullScreen: isLayoutFullScreen}"
          v-slot="{ Component }"
        >
          <transition name="slide-right" mode="out-in">
            <component v-if="!isCurrentPageReload" :is="Component" :key="$route.fullPath"/>
          </transition>
        </router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style lang="less">
@import "./index.less";
</style>
