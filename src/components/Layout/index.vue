<!-- layout 主体 -->
<script setup lang="ts">
import { onMounted, getCurrentInstance } from "vue";
import { message } from "ant-design-vue";
import { storeToRefs } from "pinia";
import { useMenuStore } from "@/store";
const store = useMenuStore();
const { isMenuOutIn, isLayoutFullScreen, isCurrentPageReload } =
  storeToRefs(store);
const { proxy } = getCurrentInstance() as any;
onMounted(() => {
  // message.info("This is a normal message");
});
</script>

<template>
  <a-layout class="container d-flex-default">
    <Menu v-show="!isLayoutFullScreen" />
    <a-layout class="layout">
      <Header v-show="!isLayoutFullScreen" />
      <router-view
        :class="isLayoutFullScreen ? 'fullScreen' : ''"
        class="layout-view"
        v-slot="{ Component }"
      >
        <Transition name="slide-right" mode="out-in">
          <component :is="Component" v-if="!isCurrentPageReload" />
        </Transition>
      </router-view>
    </a-layout>
  </a-layout>
</template>

<style lang="less" scoped>
@import "./index.less";
</style>
