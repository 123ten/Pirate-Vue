<script setup lang="ts">
import {IColumns} from "@/types";
import useFormInstance from "@/hooks/useFormInstance";

interface QueryFormProps {
  columns: IColumns[][];
  defaultSpan?: number;
  gutter?: number;
}

withDefaults(defineProps<QueryFormProps>(), {
  columns: () => ([]),
  defaultSpan: 24
})

const [formRef, formInstance] = useFormInstance()

defineExpose(formInstance)
defineOptions({
  name: 'CustomForm'
})
</script>

<template>
  <a-form
    ref="formRef"
    autocomplete="off"
    v-bind="$attrs"
  >
    <a-row
      v-for="(_columns, index) in columns"
      :key="index"
      class="w-[100%]"
      :gutter="gutter"
    >
      <a-col
        v-for="column in _columns"
        :key="column.dataIndex"
        :span="column.span || defaultSpan"
      >
        <slot name="col" :column="column"/>
      </a-col>
    </a-row>
  </a-form>
</template>
