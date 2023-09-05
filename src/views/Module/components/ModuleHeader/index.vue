<!-- 模块下载 -->
<script setup lang="ts">
import {
  InfoCircleFilled,
  SyncOutlined,
  UploadOutlined,
  HomeOutlined,
} from "@ant-design/icons-vue";
import { ref } from "vue";

const remark =
  "您可以在此页下载喜欢的系统模块，积分需要做任务来参与生态建设后获得，建议在开发环境（默认端口1818）安装模块";

const value1 = ref<string>("");

const onReload = () => {};
</script>

<template>
  <div class="module-header">
    <a-alert :message="remark" type="gray" show-icon closable>
      <template #icon>
        <InfoCircleFilled style="color: #909399" />
      </template>
    </a-alert>
    <div class="header-menu-btn">
      <ITooltip title="刷新" type="reload" class="mr_8">
        <template #icon>
          <SyncOutlined
            @click="onReload"
            style="color: #fff; font-size: 14px"
          />
        </template>
      </ITooltip>
      <div class="ant-btn-group mb_8 mr_8">
        <a-button type="primary" class="lock-active">
          <template #icon>
            <UploadOutlined />
          </template>
          上传安装
        </a-button>
        <a-button type="primary">
          <template #icon>
            <HomeOutlined />
          </template>
          本地模块
        </a-button>
      </div>
      <div class="ant-btn-group mr_8">
        <a-button type="success" class="lock-active">
          <template #icon>
            <UploadOutlined />
          </template>
          发布模块
        </a-button>
        <a-button type="success">
          <template #icon>
            <HomeOutlined />
          </template>
          获得积分
        </a-button>
      </div>
      <a-button type="success" class="lock-active">
        <template #icon>
          <UploadOutlined />
        </template>
        会员信息
      </a-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
@import "./index.less";
</style>
