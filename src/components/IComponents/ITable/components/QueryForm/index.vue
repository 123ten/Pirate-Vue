<script setup lang="ts">
import {IColumns} from "@/types";
import {FormInstance} from "ant-design-vue";
import {ref} from "vue";
import {FormExpose} from "ant-design-vue/lib/form/Form";

interface QueryFormProps {
  columns: IColumns[][];
}

const props = withDefaults(defineProps<QueryFormProps>(), {
  columns: () => ([])
})

const emits = defineEmits(['query', 'reset'])

const formRef = ref<FormInstance>()

defineExpose({
  clearValidate(...args) {
    formRef.value?.clearValidate(...args)
  },
  getFieldsValue(...args) {
    formRef.value?.getFieldsValue(...args)
  },
  resetFields(...args) {
    formRef.value?.resetFields(...args)
  },
  scrollToField(...args) {
    formRef.value?.scrollToField(...args)
  },
  validate(...args) {
    formRef.value?.validate(...args)
  },
  validateFields(...args) {
    formRef.value?.validateFields(...args)
  },
} as FormExpose)

defineOptions({
  name: 'QueryForm'
})
</script>

<template>
  <div class="flex justify-between p-3 border border-solid border-[#f0f0f0]">
    <a-form
        ref="formRef"
        layout="inline"
        name="i-table-form"
        autocomplete="off"
        class="flex-1"
        v-bind="$attrs"
    >
      <a-row
          v-for="(columns, index) in props.columns"
          :key="index"
          class="w-[100%] mb-4"
      >
        <a-col
            v-for="column in columns"
            :key="column.dataIndex"
            :span="column.span || 6"
        >
          <slot :column="column"/>
        </a-col>
      </a-row>
    </a-form>
    <a-space class="ml-4 self-end">
      <a-button type="primary" @click="emits('query')">查询</a-button>
      <a-button @click="emits('reset')">重置</a-button>
    </a-space>
  </div>
</template>
