<script setup lang="ts">
import {IColumns} from "@/types";
import useFormInstance from "@/hooks/useFormInstance";
import {provide} from "vue";

interface QueryFormProps {
  columns: IColumns[][];
  defaultSpan?: number;
  gutter?: number;
  model?: Record<string, any>;
}

const props = withDefaults(defineProps<QueryFormProps>(), {
  columns: () => ([]),
  defaultSpan: 24
})

const [formRef, formInstance] = useFormInstance()

provide('model', props.model)

defineExpose(formInstance)

defineOptions({
  name: 'CustomForm'
})
</script>

<template>
  <a-form
    ref="formRef"
    autocomplete="off"
    :model="model"
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
