<script setup lang="ts">
import {computed, CSSProperties, ref, toRaw, watch} from "vue";
import {deepChildren} from "@/utils/common";

interface FieldNames {
  label?: string;
  value?: string;
  children?: string;
}

interface ITreeSelectProps {
  treeData: any[];
  fieldNames?: FieldNames;
  dropdownStyle?: CSSProperties;
  value?: string | string[] | number | number[];
  placeholder?: string;
  treeNodeFilterProp?: string;
  maxTagCount?: number;
  multiple?: boolean;
  showSearch?: boolean;
  allowClear?: boolean;
  spliceParentTitle?: boolean;
  treeDefaultExpandAll?: boolean;
}

const props = withDefaults(defineProps<ITreeSelectProps>(), {
  value: undefined,
  treeData: undefined,
  placeholder: undefined,
  multiple: false,
  treeNodeFilterProp: "label",
  showSearch: true,
  allowClear: true,
  spliceParentTitle: false,
  treeDefaultExpandAll: false,
  maxTagCount: 1,
  dropdownStyle: () => ({maxHeight: "400px", overflow: "auto"}),
  fieldNames: () => ({label: "label", value: "value", children: "children"}),
});

const emits = defineEmits(["update:value", 'change']);

const {spliceParentTitle, ...restProps} = toRaw(props);

const tooltipTitle = ref<undefined | number[] | string[]>(undefined);

watch(
    () => props.value,
    (value) => {
      if (props.multiple && value) {
        handleChange(value);
      }
    }
);

const handleChange = (value: ITreeSelectProps['value'], label?: string[], extra?: any) => {
  emits("update:value", value);
  emits("change", value, label, extra);

  if (props.multiple) {
    if (!spliceParentTitle) {
      tooltipTitle.value = label;
    } else {
      // 是否需要拼接父级标题
      const labelKey = restProps.fieldNames.label!
      const valueKey = restProps.fieldNames.value!
      const labels: string[] = []
      deepChildren(props.treeData, (item: any, index, arr, parent) => {
        if ((value as (string | number)[])?.includes(item[valueKey])) {
          item.spliceTitle = [parent?.spliceTitle, item[labelKey]].filter(Boolean).join('-');
          labels.push(item.spliceTitle);
        }
      })
      tooltipTitle.value = labels;
    }
  }
};

const title = computed(() => {
  return tooltipTitle.value?.join("，");
});
</script>

<template>
  <a-tooltip
      placement="topLeft"
      color='#fff'
      :title="props.multiple && title"
      overlayClassName="i-treeSelect-tooltip"
  >
    <a-tree-select
        v-bind="props"
        @change="handleChange"
    />
  </a-tooltip>
</template>

<style lang="less">
.i-treeSelect-tooltip {
  .ant-tooltip-inner {
    color: #000;
  }
}
</style>
