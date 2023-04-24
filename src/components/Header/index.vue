<!-- header 头部 -->
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useMenuStore } from "@/store";
import { notification } from "ant-design-vue";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  CompressOutlined,
  ExpandOutlined,
  BellOutlined,
  DownOutlined,
  UserOutlined,
  DeleteOutlined,
  DesktopOutlined,
} from "@ant-design/icons-vue";
import { fullScreen, exitFullScreen } from "@/utils/dom";

const store = useMenuStore();
const { isMenuOutIn, isFullScreen, isLayoutFullScreen } = storeToRefs(store);

const isDelCachePopover = ref(false);
onMounted(() => {
  listenerChange(true);
});
onBeforeUnmount(() => {
  listenerChange(false);
});
// 监听全局事件
const listenerChange = (flag: boolean) => {
  const onResize = (event: any) => {
    isFullScreen.value = document.fullscreenElement !== null; // 当前是否全屏
    if (!document.fullscreenElement) {
      isLayoutFullScreen.value = false;
    }
    // 当视图宽度小于1200时 收起菜单栏
    isMenuOutIn.value = event.target.innerWidth <= 1200;
  };
  const onKeyDown = (event: any) => {
    if (event.keyCode === 122) {
      event.preventDefault(); // 取消默认事件
      onFullScreen();
      // isLayoutFullScreen.value = false;
    }
  };
  if (flag) {
    // 监听页面事件
    window.addEventListener("resize", onResize);
    // 监听键盘事件
    window.addEventListener("keydown", onKeyDown);
  } else {
    // 取消监听页面事件
    window.removeEventListener("resize", onResize);
    // 取消监听键盘事件
    window.removeEventListener("keydown", onKeyDown);
  }
};
// 展示全屏
const onFullScreen = () => {
  isFullScreen.value = !isFullScreen.value;
  if (isFullScreen.value) {
    fullScreen();
  } else {
    exitFullScreen();
  }
};
// 清楚缓存
const onDelCacheDropdown = () => {
  isDelCachePopover.value = !isDelCachePopover.value;
};
const delCache = () => {
  notification.success({
    message: "操作成功",
    duration: 0,
  });
};
</script>

<template>
  <header
    class="nav-bar d-flex-sb"
    :style="{ left: `${isMenuOutIn ? 96 : 232}px` }"
  >
    <Tags />
    <div class="nav-menus d-flex-center">
      <!-- 消息 -->
      <div class="nav-menu-item" title="首页">
        <DesktopOutlined style="font-size: 18px" />
      </div>
      <!-- 全屏/取消全屏 -->
      <div
        class="nav-menu-item"
        @click="onFullScreen"
        :title="isFullScreen ? '取消全屏' : '全屏'"
      >
        <div class="d-flex-center c-pointer user-select">
          <!-- 全屏 -->
          <CompressOutlined v-show="isFullScreen" style="font-size: 18px" />
          <!-- 取消全屏 -->
          <ExpandOutlined v-show="!isFullScreen" style="font-size: 18px" />
        </div>
      </div>
      <!-- 消息 -->
      <div class="nav-menu-item">
        <BellOutlined style="font-size: 18px" class="msg-icon" />
      </div>
      <!-- 清楚缓存 -->
      <a-dropdown :trigger="['click']">
        <div class="nav-menu-item" @click="onDelCacheDropdown">
          <DeleteOutlined style="font-size: 18px" />
        </div>
        <template #overlay>
          <a-menu>
            <a-menu-item key="0" @click="delCache"> 清理系统缓存 </a-menu-item>
            <a-menu-item key="1" @click="delCache"> 清理浏览器缓存</a-menu-item>
            <a-menu-divider />
            <a-menu-item key="3" @click="delCache"> 一键清理所有 </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
      <!-- 个人信息 -->
      <a-popover placement="bottomRight" trigger="click">
        <template #content>
          <div class="admin-info-base">
            <a-avatar :size="70">
              <template #icon>
                <UserOutlined style="font-size: 70px" />
              </template>
            </a-avatar>
            <div class="admin-info-other">
              <div class="admin-info-name">Admin</div>
              <div class="admin-info-lasttime">2023-04-18 14:16:38</div>
            </div>
          </div>
          <div class="d-flex-sb">
            <a-button type="primary" ghost>个人资料</a-button>
            <a-button type="primary" danger ghost>注销</a-button>
          </div>
        </template>
        <div class="admin-info d-flex-center">
          <!-- 账号信息 -->
          <a-avatar :size="26">
            <template #icon>
              <UserOutlined style="font-size: 26px" />
            </template>
          </a-avatar>
          <div class="admin-name">Admin</div>
        </div>
      </a-popover>
    </div>
  </header>
</template>

<style lang="less" scoped>
@import "./index.less";
</style>
