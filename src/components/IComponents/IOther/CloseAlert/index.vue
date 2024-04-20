<!-- i-table 表格头部的 alert 提示 -->
<script setup lang="ts">
import {InfoCircleFilled} from "@ant-design/icons-vue";
import {AlertProps} from "ant-design-vue";

defineProps<AlertProps>()

defineOptions({
  name: "CloseAlert",
})
</script>

<template>
  <a-alert
      v-if="message"
      :message="message"
      type="gray"
      show-icon
      closable
      v-bind="$attrs"
  >
    <template #icon>
      <slot name="icon">
        <info-circle-filled style="color: #909399"/>
      </slot>
    </template>
  </a-alert>
</template>

<style scoped lang="less">

</style>
