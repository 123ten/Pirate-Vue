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
import * as antIcons from "@ant-design/icons-vue";
import data from "./data.json";
const router = useRouter();
const route = useRoute();
const store = useMenuStore();
const { isMenuOutIn } = storeToRefs(store);

const menudata = ref(data);

const openKeys = ref<string[]>([]);
const selectedKeys = ref<string[]>([]);

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
};
const currentOpenMenu = () => {
  openKeys.value = [route.meta.parentName as string];
  selectedKeys.value = [route.name as string];
};
const onOpenChange = (keys: string[]) => {
  // const latestOpenKey = keys.find((key) => state.openKeys.indexOf(key) === -1);
  // if (state.rootSubmenuKeys.indexOf(latestOpenKey!) === -1) {
  //   state.openKeys = keys;
  // } else {
  //   state.openKeys = latestOpenKey ? [latestOpenKey] : [];
  // }
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
        <div class="logo-name d-flex-center">
          <img class="logo-img" src="../../assets/images/logo_piece.png" alt="" />
          <div class="website-name">Pirate Vue</div>
        </div>
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
    <a-menu
      mode="inline"
      v-model:openKeys="openKeys"
      v-model:selectedKeys="selectedKeys"
      @openChange="onOpenChange"
    >
      <!-- <template v-for="item in menudata" :key="item.name">
        <a-menu-item :key="item.name" @click="toRouter(item.name)">
          <template #icon>
            <component
              :is="antIcons[item.icon as keyof typeof antIcons]"
              class="fontSize-icon"
            />
          </template>
          <span>{{ item.title }}</span>
        </a-menu-item>
        <a-sub-menu
          v-for="val in item.children"
          :key="val.name"
          :title="val.title"
        >
          <template #icon>
            <component
              :is="antIcons[val.icon as keyof typeof antIcons]"
              class="fontSize-icon"
            />
          </template>
        </a-sub-menu>
      </template> -->
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
        <a-menu-item key="/user/group" @click="toRouter('/user/group')">
          <UserOutlined class="fontSize-icon" />
          会员分组管理
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
      <a-sub-menu key="routine" title="常规管理">
        <template #icon>
          <TeamOutlined class="fontSize-icon" />
        </template>
        <a-menu-item key="config" @click="toRouter('config')">
          <TeamOutlined class="fontSize-icon" />
          系统配置
        </a-menu-item>
        <a-menu-item key="annex" @click="toRouter('annex')">
          <UserOutlined class="fontSize-icon" />
          附件管理
        </a-menu-item>
        <a-menu-item key="info" @click="toRouter('info')">
          <MenuOutlined class="fontSize-icon" />
          个人资料
        </a-menu-item>
      </a-sub-menu>
    </a-menu>
  </a-layout-sider>
</template>

<style lang="less" scoped>
@import "./index.less";
</style>
