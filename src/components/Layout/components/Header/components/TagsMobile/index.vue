<!-- Tags 标签 -->
<script setup lang="ts">
import {MenuUnfoldOutlined} from "@ant-design/icons-vue";
import {computed, defineOptions, onMounted} from "vue";
import {storeToRefs} from "pinia";
import {useLayoutStore} from "@/store";
import {useRoute} from "vue-router";

const router = useRoute();
const store = useLayoutStore();
const {isMenuOutIn, getMenus} = storeToRefs(store);

onMounted(() => {
  // console.log(router, "router");
  // console.log(getMenus.value);
  // console.log("routes", routes);
});

// 面包屑
const routes = computed(() => {
  const routers = router.matched.map((route) => {
    return {
      path: route.path,
      name: route.name || route.meta.name,
      breadcrumbName: route.meta.title,
    };
  });
  // 移除首页, 首页不需要重复显示
  if (routers[1].name === "home") {
    routers.splice(1, 1);
  }
  console.log('routers', routers)
  return routers;
});

defineOptions({
  name: "TagsMobile",
});
</script>

<template>
  <div class="menu-mobile d-flex-center">
    <!-- 点击展开收起菜单 -->
    <div
        class="d-flex-center menu-icon c-pointer mr_16"
        @click="isMenuOutIn = !isMenuOutIn"
    >
      <!-- 展开 -->
      <menu-unfold-outlined style="font-size: 18px"/>
    </div>
    <a-breadcrumb :routes="routes">
      <template #itemRender="{ route, params, routes, paths }">
        <span v-if="routes.indexOf(route) === routes.length - 1">
          {{ route.breadcrumbName }}
        </span>
        <router-link v-else :to="route.path">
          {{ route.breadcrumbName }}
        </router-link>
      </template>
    </a-breadcrumb>
  </div>
</template>

<style lang="less" scoped>
@import url("./index.less");
</style>
