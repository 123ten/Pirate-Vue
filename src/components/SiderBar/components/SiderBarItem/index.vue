<!-- MenuItem -->
<script setup lang="ts">
import { onMounted, watch } from "vue";
import { storeToRefs } from "pinia";
import { useMenuStore } from "@/store";
import { RouteRecordName, useRouter } from "vue-router";

import data from "../../data.json";

import * as antIcons from "@ant-design/icons-vue";

interface IPropsMenuItem {
  menu: typeof data.data;
}

const props = withDefaults(defineProps<IPropsMenuItem>(), {
  menu: () => [],
});

const router = useRouter();
const store = useMenuStore();
const { isMenuOutIn } = storeToRefs(store);

// 跳转
const toRouter = (name: RouteRecordName) => {
  console.log(name, "name");
  router.push({
    name,
  });
  isMenuOutIn.value = false; // 跳转路由默认收起
};

onMounted(() => {
  console.log("props.menu", props.menu);
});
</script>

<template>
  <template v-for="item in props.menu" :key="item.name">
    <!-- 当存在子集 -->
    <template v-if="item.children && item.children.length">
      <a-sub-menu :key="item.name" :title="item.title">
        <template #icon>
          <component :is="antIcons[item.icon]" class="fontSize-icon" />
        </template>
        <a-menu-item
          v-for="children in item.children"
          :key="children.name"
          @click="toRouter(children.name)"
        >
          <component :is="antIcons[children.icon]" class="fontSize-icon" />
          <span>{{ children.title }}</span>
        </a-menu-item>
        <!-- <SiderBarItem :menu="item.children" /> -->
      </a-sub-menu>
    </template>
    <template v-else>
      <a-menu-item :key="item.name" @click="toRouter(item.name)">
        <template #icon>
          <component :is="antIcons[item.icon]" class="fontSize-icon" />
        </template>
        <span>{{ item.title }}</span>
      </a-menu-item>
    </template>
  </template>
</template>

<style lang="less" scoped>
@import "./index.less";
</style>
