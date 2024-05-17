<!-- 自定义详情弹窗 -->
<script setup lang="ts">
import {computed, inject} from "vue";
import {TableSettingsType} from "@/types/tableSettingsType";
import {tableSettingKey} from "@/utils/tableSettings";

const tableSettings = inject<TableSettingsType>(tableSettingKey, {} as any);

const detail = computed(() => tableSettings?.detail)
const modal = computed(() => tableSettings?.modal)

const modalProps = computed(() => ({
  ...modal.value, // 公共弹窗配置
  ...detail.value?.modal, // form 表单弹窗配置
}))

defineOptions({
  name: 'CustomInfoModal'
})
</script>

<template>
  <i-modal
    :title="$t('title.detail')"
    @cancel="tableSettings?.cancelForm"
    v-bind="modalProps"
  >
<!--    {{ modalProps}}-->
  </i-modal>
</template>

<style scoped lang="less">

</style>
