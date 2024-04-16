<script setup lang="ts">
import {IColumns} from "@/types";

interface QueryFormItemProps {
  column: IColumns
  model: Record<string, any>
}

withDefaults(defineProps<QueryFormItemProps>(), {
  column: () => ({
    dataIndex: 'default'
  }),
  model: () => ({})
})

const valueProp = (column: IColumns) => {
  return column.searchValueProp || column.dataIndex
}

</script>

<template>
  <a-form-item
      v-bind="$attrs"
      :label="column.searchLabelProp || column.title"
      :name="valueProp(column)"
      class="i-form-item"
  >
    <slot :name="`${column.dataIndex}Search`">
      <!-- input 输入框 -->
      <a-input
          v-if="!column.type || column.type === 'input'"
          v-model:value="model[valueProp(column)]"
          allow-clear
          :placeholder="column.title || column.placeholder"
          v-bind="column.propOptions"
      />
      <!-- select 下拉框 -->
      <a-select
          v-else-if="column.type === 'select'"
          v-model:value="model[valueProp(column)]"
          allow-clear
          :placeholder="column.title || column.placeholder"
          v-bind="column.propOptions"
      >
        <a-select-option
            v-for="option in column.options"
            :key="option.value"
            :value="option.value"
        >
          {{ option.label }}
        </a-select-option>
      </a-select>
      <!-- radio 单选框 -->
      <a-radio-group
          v-else-if="column.type === 'radio'"
          v-model:value="model[valueProp(column)]"
          v-bind="column.propOptions"
      >
        <a-radio
            v-for="option in column.options"
            :key="option.value"
            :value="option.value"
        >
          {{ option.label }}
        </a-radio>
      </a-radio-group>
      <!-- date-picker 日期选择框 -->
      <a-date-picker
          v-else-if="column.type === 'date-picker'"
          v-model:value="model[valueProp(column)]"
          :picker="column.picker"
          v-bind="column.propOptions"
      />
      <a-range-picker
          v-else-if="column.type === 'range-picker'"
          v-model:value="model[valueProp(column)]"
          :picker="column.picker"
          v-bind="column.propOptions"
      />

    </slot>
  </a-form-item>
</template>
