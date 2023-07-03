<!-- header 头部 -->
<script setup lang="ts">
import { onBeforeUnmount, onBeforeMount, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useMenuStore } from "@/store";
import { notification } from "ant-design-vue";
import {
  CompressOutlined,
  ExpandOutlined,
  BellOutlined,
  UserOutlined,
  DeleteOutlined,
  DesktopOutlined,
  TranslationOutlined,
} from "@ant-design/icons-vue";
import { fullScreen, exitFullScreen } from "@/utils/dom";

const store = useMenuStore();
const { isMenuOutIn, isAsideMenu, isFullScreen, isLayoutFullScreen } =
  storeToRefs(store);

const isLanguagePopover = ref(false); // 语言
const isCachePopover = ref(false); // 缓存
const isInfoPopover = ref(false); // 个人资料

onBeforeMount(() => {
  init();
});
onMounted(() => {
  listenerChange(true);
});
onBeforeUnmount(() => {
  listenerChange(false);
});

const init = () => {
  const _innerWidth = window.innerWidth;
  const is1200 = _innerWidth <= 1200;
  if (is1200) {
    // 小于等 1200 mobile 模式 收起侧边栏
    isAsideMenu.value = true;
    isMenuOutIn.value = false;
  } else {
    // 小于等 1200 mobile 模式 展开侧边栏
    isAsideMenu.value = false;
    isMenuOutIn.value = _innerWidth > 1200 && _innerWidth < 1500;
  }
};

// 监听全局事件
const listenerChange = (flag: boolean) => {
  const onResize = (event: any) => {
    isFullScreen.value = document.fullscreenElement !== null; // 当前是否全屏
    if (!document.fullscreenElement) {
      isLayoutFullScreen.value = false;
    }
    // 当视图宽度小于1200时 收起菜单栏
    // isMenuOutIn.value = event.target.innerWidth <= 1200;
    init();
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
// 设置语言
const putLanguage = (type: number) => {
  isLanguagePopover.value = false;
};
// 清楚缓存
const putCache = (type: number) => {
  isCachePopover.value = false;
  notification.success({
    message: "操作成功",
  });
};
// 注销
const onLogout = () => {
  isInfoPopover.value = false;
  console.log("onLogout");
};
</script>

<template>
  <header
    class="nav-bar d-flex-sb"
    :style="{ left: `${isMenuOutIn ? 96 : 232}px` }"
  >
    <TagsMobile v-if="isAsideMenu" />
    <TagsPc v-else />

    <div class="nav-menus d-flex-center">
      <!-- 消息 -->
      <div class="nav-menu-item" title="首页">
        <DesktopOutlined style="font-size: 18px" />
      </div>
      <!-- 语言 -->
      <a-popover
        v-model:visible="isLanguagePopover"
        :trigger="['click']"
        overlayClassName="i-popover-menu"
      >
        <template #content>
          <div class="i-popover-item" @click="putLanguage(1)">中文简体</div>
          <div class="i-popover-item" @click="putLanguage(2)">English</div>
        </template>
        <div class="nav-menu-item" title="切换语言">
          <TranslationOutlined style="font-size: 18px" />
        </div>
      </a-popover>
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
      <a-popover
        v-model:visible="isCachePopover"
        trigger="click"
        overlayClassName="i-popover-menu"
      >
        <template #content>
          <div class="i-popover-item" @click="putCache(1)">清理系统缓存</div>
          <div class="i-popover-item" @click="putCache(2)">清理浏览器缓存</div>
          <div class="i-popover-item" @click="putCache(3)">一键清理所有</div>
        </template>
        <div class="nav-menu-item" title="首页">
          <DeleteOutlined style="font-size: 18px" />
        </div>
      </a-popover>
      <!-- 个人信息 -->
      <a-popover
        v-model:visible="isInfoPopover"
        placement="bottomRight"
        trigger="click"
      >
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
            <a-button type="primary" ghost @click="isInfoPopover = false">
              <router-link to="/routine/info">个人资料</router-link>
            </a-button>
            <a-button type="primary" danger ghost @click="onLogout">
              注销
            </a-button>
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
