<!-- 角色组管理 添加/编辑 -->
<script setup lang="ts">
import {useAdminMenuStore} from '@/store'
import {storeToRefs} from "pinia";

const adminMenuSore = useAdminMenuStore()
const {dataSource: permissionTreeData} = storeToRefs(adminMenuSore)
const {getAdminMenuListRequest} = adminMenuSore

const onInit = async () => {
  await getAdminMenuListRequest()
  console.log('onInit -->', permissionTreeData)
}

</script>

<template>
  <custom-form-modal :init="onInit">
    <template #permissions="{fields,field,placeholder}">
      <i-tree-select
        v-model:value="fields[field]"
        tree-checkable
        allow-clear
        multiple
        tree-default-expand-all
        :field-names="{label: 'title', value: 'id'}"
        :tree-data="permissionTreeData"
        :placeholder="placeholder"
      />
    </template>
  </custom-form-modal>
</template>

<style lang="less" scoped></style>
