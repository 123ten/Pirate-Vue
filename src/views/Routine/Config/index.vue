<!-- 系统配置 -->
<script setup lang="ts">
import { ref } from "vue";
import Basic from "./components/Basic/index.vue";
import Mail from "./components/Mail/index.vue";
import QuickAccess from "./components/QuickAccess/index.vue";
const activeKey = ref<string | number>("1");
const test = "123"
</script>

<template>
  <a-row class="default-main" :gutter="[16, 16]">
    <a-col :span="16">
      <a-tabs
        v-model:activeKey="activeKey"
        type="card"
        class="main-card is-always-shadow"
      >
        <a-tab-pane key="1" tab="基础配置">
          <div class="card-main">
            <Basic />
          </div>
        </a-tab-pane>
        <a-tab-pane key="2" tab="邮件配置">
          <div class="card-main">
            <Mail />
          </div>
        </a-tab-pane>
        <a-tab-pane key="3" tab="快捷配置入口">
          <div class="card-main">
            <QuickAccess />
          </div>
        </a-tab-pane>
        <a-tab-pane key="4" tab="添加配置项"></a-tab-pane>
      </a-tabs>
    </a-col>
    <a-col :span="8" class="main-card">
      <div class="quick-access is-always-shadow">
        <div class="card-head">快捷配置入口</div>
        <div class="card-main">
          <a-button size="small">快捷配置入口</a-button>
        </div>
      </div>
    </a-col>
  </a-row>
</template>

<style lang="less" scoped>
@import "./index.less";
</style>
