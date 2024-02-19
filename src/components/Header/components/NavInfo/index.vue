<!-- 个人信息 -->
<script setup lang="ts">
import { ref, defineOptions } from "vue";
import { UserOutlined } from "@ant-design/icons-vue";
const isInfoPopover = ref(false); // 个人资料

// 注销
const onLogout = () => {
  isInfoPopover.value = false;
  console.log("onLogout");
};

defineOptions({
  name: "NavInfo",
});
</script>

<template>
  <a-popover v-model="isInfoPopover" placement="bottomRight" trigger="click">
    <template #content>
      <div class="admin-info-base">
        <a-avatar :size="70">
          <template #icon>
            <user-outlined style="font-size: 70px" class="avatar-turn" />
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
    <div class="admin-info d-flex-center" title="个人信息">
      <!-- 账号信息 -->
      <a-avatar :size="26">
        <template #icon>
          <user-outlined style="font-size: 26px" class="avatar-turn" />
        </template>
      </a-avatar>
      <div class="admin-name">Admin</div>
    </div>
  </a-popover>
</template>

<style lang="less" scoped>
@import "./index.less";
</style>
