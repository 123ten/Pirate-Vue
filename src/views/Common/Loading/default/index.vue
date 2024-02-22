<!-- 默认全屏加载界面 -->
<script setup lang="ts">
import { defineExpose, ref } from "vue";

// 是否显示加载界面
const loading = ref<boolean>(false);

const show = () => {
  loading.value = true;
};

const hide = () => {
  loading.value = false;
};

// 全局加载界面
defineExpose({
  show,
  hide,
});
</script>

<template>
  <div v-if="loading" id="global_loading">
    <span class="item1"></span>
    <span class="item2"></span>
    <span class="item3"></span>
    <span class="item4"></span>
    <span class="item5"></span>
    <span class="item6"></span>
    <span class="item7"></span>
    <div class="loading">
      <img class="img" src="@/assets/images/loading_small-plane.jpg" />
    </div>
  </div>
</template>

<style lang="less" scoped>
@import "./index.less";
</style>
