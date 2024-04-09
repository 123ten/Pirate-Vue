<!-- 管理员日志-详情 -->
<script setup lang="ts">
import {DetailModalProps} from "./types";
import MethodTag from "@/components/IComponents/IOther/MethodTag/index.vue";
import {formatTime, statusCode} from "@/utils/common";
import {useAdminLogStore} from "@/store/auth/adminLog";
import {storeToRefs} from "pinia";

const store = useAdminLogStore()
const {detailInfo, isModalLoading} = storeToRefs(store);

const props = defineProps<DetailModalProps>()
const emit = defineEmits(['cancel'])


const handleCancel = () => {
  emit('cancel')
}

</script>

<template>
  <i-modal
      title="详情"
      width="1080px"
      :visible="props.visible"
      :loading="isModalLoading"
      :footer="false"
      mask-closable
      @cancel="handleCancel"
  >
    <a-descriptions bordered size="middle" :label-style="{width: '150px'}" :column="2">
      <a-descriptions-item label="标题">{{ detailInfo.title }}</a-descriptions-item>
      <a-descriptions-item label="操作管理员">{{ detailInfo.username }}</a-descriptions-item>
      <a-descriptions-item label="请求方式">
        <method-tag v-if="detailInfo.method" :method="detailInfo.method"/>
      </a-descriptions-item>
      <a-descriptions-item label="操作人IP">{{ detailInfo.ip }}</a-descriptions-item>
      <a-descriptions-item label="状态码">{{ statusCode(detailInfo.status) }}</a-descriptions-item>
      <a-descriptions-item label="响应时间">{{ formatTime(detailInfo.responseTime) }}</a-descriptions-item>
      <a-descriptions-item label="URL" :span="2">{{ detailInfo.url }}</a-descriptions-item>
      <a-descriptions-item label="User Agent" :span="2">{{ detailInfo.userAgent }}</a-descriptions-item>
      <a-descriptions-item label="创建时间" :span="2">{{ detailInfo.createTime }}</a-descriptions-item>
      <a-descriptions-item label="请求数据" :span="2">
        <pre class="mb-0">{{ detailInfo.params }}</pre>
      </a-descriptions-item>
    </a-descriptions>
  </i-modal>
</template>

<style scoped lang="less">

</style>
