<script setup lang="ts">
import {IColumns} from "@/types";
import {useI18n} from "vue-i18n";
import {computed} from "vue";

const {t, te} = useI18n();

interface CustomFormItemProps {
  column?: IColumns;
  form?: Record<string, any>;
  options?: any[];
  i18nPrefix?: string;
  i18nPropPrefix?: string; // form | table.column
  typeProp?: string;
}

const props = withDefaults(defineProps<CustomFormItemProps>(), {
  column: () => ({
    dataIndex: "id",
  }),
  form: () => ({}),
  options: () => [],
});

const column = props.column;

// value 字段
const valueProp = computed(() => {
  return column.formValueProp || column.dataIndex;
});

const getI18nName = (key: string) => {
  return [props.i18nPrefix, props.i18nPropPrefix, key, column.i18nName || valueProp]
    .filter(Boolean)
    .join(".");
};

const labelProp = computed(() => {
  const il8nName = getI18nName("label");
  return column.formLabelProp || (te(il8nName) ? t(il8nName) : column.title);
});

const placeholderProp = computed(() => {
  const il8nName = getI18nName("placeholder");
  return (
      typeof column.placeholder === 'function'
        ? column.placeholder(props.form?.fields)
        : column.placeholder
    )
    || (te(il8nName) ? t(il8nName) : undefined);
});


const typeProp = computed(() => column[props.typeProp!] || column.type || 'input');

defineOptions({
  name: 'CustomFormItem'
})
</script>

<template>
  <a-form-item
    :label="labelProp"
    :name="valueProp"
    v-bind="$attrs"
  >
    <slot
      :column="column"
      :fields="form.fields"
      :field="valueProp"
      :placeholder="placeholderProp"
    >
      <a-input
        v-if="typeProp === 'input'"
        v-model:value="form.fields[valueProp]"
        allow-clear
        :placeholder="placeholderProp"
        v-bind="column.formFieldConfig"
      />
      <a-input
        v-if="typeProp === 'input-number'"
        v-model:value="form.fields[valueProp]"
        allow-clear
        :placeholder="placeholderProp"
        v-bind="column.formFieldConfig"
      />
      <a-input-password
        v-else-if="typeProp === 'input-password'"
        v-model:value="form.fields[valueProp]"
        allow-clear
        :placeholder="placeholderProp"
        v-bind="column.formFieldConfig"
      />
      <a-textarea
        v-else-if="typeProp === 'textarea'"
        v-model:value="form.fields[valueProp]"
        allow-clear
        :placeholder="placeholderProp"
        v-bind="column.formFieldConfig"
      />
      <i-tree-select
        v-else-if="typeProp === 'tree-select'"
        v-model:value="form.fields[valueProp]"
        :tree-data="options"
        :placeholder="placeholderProp"
        v-bind="column.formFieldConfig"
      />
      <a-select
        v-else-if="typeProp === 'select'"
        v-model:value="form.fields[valueProp]"
        allow-clear
        :placeholder="placeholderProp"
        v-bind="column.formFieldConfig"
      >
        <a-select-option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </a-select-option>
      </a-select>
      <a-cascader
        v-else-if="typeProp === 'cascader'"
        v-model:value="form.fields[valueProp]"
        :options="column.options"
        :placeholder="placeholderProp"
        allow-clear
        v-bind="column.formFieldConfig"
      />
      <i-upload
        v-else-if="typeProp === 'upload'"
        v-model:value="form.fields[valueProp]"
        v-bind="column.formFieldConfig"
      />
      <a-radio-group
        v-else-if="typeProp === 'radio'"
        v-model:value="form.fields[valueProp]"
        v-bind="column.formFieldConfig"
      >
        <a-radio
          v-for="option in options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </a-radio>
      </a-radio-group>
      <a-radio-group
        v-else-if="typeProp === 'radio-button'"
        v-model:value="form.fields[valueProp]"
        v-bind="column.formFieldConfig"
      >
        <a-radio-button
          v-for="option in options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </a-radio-button>
      </a-radio-group>
      <a-date-picker
        v-else-if="typeProp === 'date-picker'"
        v-model:value="form.fields[valueProp]"
        :picker="column.picker"
        v-bind="column.formFieldConfig"
      />
      <a-range-picker
        v-else-if="typeProp === 'range-picker'"
        v-model:value="form.fields[valueProp]"
        :picker="column.picker"
        v-bind="column.formFieldConfig"
      />
      <i-icon
        v-else-if="typeProp === 'icon'"
        v-model:value="form.fields[valueProp]"
        v-bind="column.formFieldConfig"
      />
    </slot>
  </a-form-item>
</template>

<style scoped lang="less">

</style>
