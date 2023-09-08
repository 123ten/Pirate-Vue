<!-- 模块下载 -->
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "ModuleHeader",
});
</script>
<script setup lang="ts">
import {
  InfoCircleFilled,
  SyncOutlined,
  UploadOutlined,
  HomeOutlined,
  UserOutlined,
} from "@ant-design/icons-vue";
// import IButton from "@components/IButton/index.vue";
import RocketSvgIcon from "@components/SvgIcon/rocket.vue";
import UploadCloudSvgIcon from "@components/SvgIcon/uploadCloud.vue";

import { ref } from "vue";

const remark =
  "您可以在此页下载喜欢的系统模块，积分需要做任务来参与生态建设后获得，建议在开发环境（默认端口1818）安装模块";

const onReload = () => {};
</script>

<template>
  <div class="module-header mb_16">
    <a-alert :message="remark" type="gray" show-icon closable>
      <template #icon>
        <InfoCircleFilled style="color: #909399" />
      </template>
    </a-alert>
    <div class="header-menu-btn">
      <ITooltip title="刷新" type="reload" class="mr_8 mtb_4">
        <template #icon>
          <SyncOutlined
            @click="onReload"
            style="color: #fff; font-size: 14px"
          />
        </template>
      </ITooltip>
      <div class="ant-btn-group mr_8 mtb_4">
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
      <div class="ant-btn-group mr_8 mtb_4">
        <IButton type="success">
          <template #icon>
            <UploadCloudSvgIcon />
          </template>
          发布模块
        </IButton>
        <a-button type="success">
          <template #icon>
            <RocketSvgIcon />
          </template>
          获得积分
        </a-button>
      </div>
      <a-button type="success" class="mtb_4">
        <template #icon>
          <UserOutlined />
        </template>
        会员信息
      </a-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
@import "./index.less";
</style>
