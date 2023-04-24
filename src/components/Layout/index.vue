<!-- layout 主体 -->
<script setup lang="ts">
import { onMounted, getCurrentInstance } from "vue";
import { message } from "ant-design-vue";
import { storeToRefs } from "pinia";
import { useMenuStore } from "@/store";
const store = useMenuStore();
const { isMenuOutIn, isLayoutFullScreen } = storeToRefs(store);
const { proxy } = getCurrentInstance() as any;
onMounted(() => {
  // message.info("This is a normal message");
});
</script>

<template>
  <a-layout class="container d-flex-default">
    <Menu />
    <a-layout class="layout" :style="{ left: `${isMenuOutIn ? 96 : 216}px` }">
      <Header />
      <Transition name="slide-right" mode="out-in">
        <router-view
          :class="isLayoutFullScreen ? 'fullScreen' : ''"
          class="layout-view"
        />
      </Transition>
    </a-layout>
  </a-layout>
</template>

<style lang="less" scoped>
@import "./index.less";
</style>
