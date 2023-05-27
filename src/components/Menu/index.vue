<!-- 菜单 -->
<script setup lang="ts">
import { HomeOutlined } from "@ant-design/icons-vue";
import { onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useMenuStore } from "@/store";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  TeamOutlined,
  UserOutlined,
  MenuOutlined,
  FileDoneOutlined,
} from "@ant-design/icons-vue";
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();
const store = useMenuStore();
const { isMenuOutIn } = storeToRefs(store);

const keys = reactive({
  parentKey: "",
  key: "",
});

onMounted(() => {
  // const innerWidth = document.documentElement.clientWidth;
  // resize(innerWidth);
  // window.addEventListener("resize", resize);
  currentOpenMenu();
});
onBeforeUnmount(() => {
  // window.removeEventListener("resize", resize);
});
// const resize = (event: any) => {
//   let innerWidth = 0;
//   if (typeof event === "number") {
//     innerWidth = event;
//   } else {
//     innerWidth = event.target.innerWidth;
//   }
//   //   console.log(innerWidth, "event");
//   // 更改导航栏布局
//   if (innerWidth <= 400) {
//     mode.value = "horizontal";
//   } else {
//     mode.value = "inline";
//   }
// };
//
// 跳转
const toRouter = (name: string) => {
  console.log(name, "name");

  router.push({
    name,
  });
  // keys.key = name as string;
  // keys.parentKey = route.meta.parentName as string;
  console.log(keys, "keys");
};
const currentOpenMenu = () => {
  keys.key = route.name as string;
  keys.parentKey = route.meta.parentName as string;
};
watch(
  () => route.path,
  () => {
    console.log(route.name, "route");
    currentOpenMenu();
  }
);
</script>

<template>
  <a-layout-sider
    v-model:collapsed="isMenuOutIn"
    collapsible
    class="i-menu"
    collapsedWidth="64"
  >
    <div class="menu-logo d-flex-center">
      <template v-if="!isMenuOutIn">
        <img class="logo-img" src="../../assets/images/logo.svg" alt="" />
        <div class="website-name">Vite演示站</div>
      </template>
      <!-- 点击展开收起菜单 -->
      <div
        class="d-flex-center menu-icon c-pointer"
        @click="isMenuOutIn = !isMenuOutIn"
      >
        <!-- 展开 -->
        <MenuUnfoldOutlined v-show="isMenuOutIn" style="font-size: 18px" />
        <!-- 收起 -->
        <MenuFoldOutlined v-show="!isMenuOutIn" style="font-size: 18px" />
      </div>
    </div>
    <a-menu mode="inline" :selectedKeys="[keys.key]">
      <!-- :openKeys="[keys.parentKey]" -->
      <a-menu-item key="home" @click="toRouter('home')">
        <template #icon>
          <HomeOutlined class="fontSize-icon" />
        </template>
        <span>首页</span>
      </a-menu-item>
      <a-sub-menu key="auth" title="权限管理">
        <template #icon>
          <TeamOutlined class="fontSize-icon" />
        </template>
        <a-menu-item key="group" @click="toRouter('group')">
          <TeamOutlined class="fontSize-icon" />
          角色组管理
        </a-menu-item>
        <a-menu-item key="admin" @click="toRouter('admin')">
          <UserOutlined class="fontSize-icon" />
          管理员管理
        </a-menu-item>
        <a-menu-item key="menu" @click="toRouter('menu')">
          <MenuOutlined class="fontSize-icon" />
          菜单规则管理
        </a-menu-item>
        <a-menu-item key="adminLog" @click="toRouter('adminLog')">
          <FileDoneOutlined class="fontSize-icon" />
          管理员日志管理
        </a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="user" title="会员管理">
        <template #icon>
          <TeamOutlined class="fontSize-icon" />
        </template>
        <a-menu-item key="index" @click="toRouter('index')">
          <TeamOutlined class="fontSize-icon" />
          会员管理
        </a-menu-item>
        <a-menu-item key="rule" @click="toRouter('rule')">
          <UserOutlined class="fontSize-icon" />
          会员规则管理
        </a-menu-item>
        <a-menu-item key="userLog" @click="toRouter('userLog')">
          <MenuOutlined class="fontSize-icon" />
          会员日志管理
        </a-menu-item>
      </a-sub-menu>
    </a-menu>
  </a-layout-sider>
</template>

<style lang="less" scoped>
@import "./index.less";
</style>
