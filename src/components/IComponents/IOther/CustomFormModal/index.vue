<!-- 角色组管理 添加/编辑 -->
<script setup lang="ts">
import {computed, inject} from "vue";
import {tableSettingKey} from "@/utils/tableSettings";
import {TableSettingsType} from "@/types/tableSettingsType";
import {useI18n} from "vue-i18n";
import {IColumns} from "@/types";
import CustomForm from "@/components/IComponents/IOther/CustomForm/index.vue";
import CustomFormItem from "@/components/IComponents/IOther/CustomFormItem/index.vue";

const {t, te} = useI18n();

const tableSettings = inject<TableSettingsType>(tableSettingKey, {} as any);

const form = computed(() => tableSettings?.form)
const modal = computed(() => tableSettings?.modal)

// 获取排序字段
const getSort = (column: IColumns) => {
  return column.formSort || column.sort || 0;
};

// 获取列的 span
const getSpan = (column: IColumns) => {
  return Number(column.span || form.value?.defaultSpan || 24);
};

// 24 / span
const formColumns = computed(() => {
  if (!tableSettings?.table.columns) return [];
  const rowColumns: IColumns[][] = [];
  let count = 0;
  tableSettings?.table.columns
    .filter((column: IColumns) => typeof column.form === 'function' ? column.form(form.value!.fields) : column.form)
    .sort((a, b) => getSort(a) - getSort(b))
    .forEach((column: IColumns, index: number) => {
      const _span: number = getSpan(column);
      if (index % (24 / _span) === 0) {
        rowColumns[count] = [];
        count++;
      }
      rowColumns[count - 1].push(column);
    })
  return rowColumns
});

const i18nPrefix = computed(() => tableSettings?.table.i18nPrefix);

const getI18nName = (key: string, column: IColumns) => {
  return [i18nPrefix.value, "form", key, column.i18nName || valueProp(column)]
    .filter(Boolean)
    .join(".");
};

const valueProp = (column: IColumns) => {
  return column.formValueProp || column.dataIndex;
};

const defaultOptions = [
  {label: '否', value: 0},
  {label: '是', value: 1},
]

const getOptions = (column: IColumns) => {
  if (typeof column.options === 'function') {
    const dataSource = tableSettings?.table.dataSource || []
    const fields = form.value?.fields
    return column.options(dataSource, fields)
  } else {
    return column.options || defaultOptions
  }
};


const formItemAttrs = (column: IColumns) => ({
  ...tableSettings?.formRefs?.validateInfos[valueProp(column)],
  ...column.formItemConfig,
});

defineOptions({
  name: 'CustomFormModal'
})
</script>

<template>
  <i-modal
    :title="$t(form?.fields.id ? 'title.update' : 'title.create')"
    v-bind="modal"
    @cancel="tableSettings?.cancelForm"
    @confirm="tableSettings?.confirmForm"
  >
    <slot>
      <custom-form
        :name="form.name"
        :columns="formColumns"
        :label-col="{ span: 4 }"
        :default-span="form.defaultSpan"
        v-bind="form.formConfig"
      >
        <template #col="{column}">
          <custom-form-item
            :column="column"
            :form="form"
            :options="getOptions(column)"
            :i18n-prefix="i18nPrefix"
            i18n-prop-prefix="form"
            type-prop="formType"
            v-bind="formItemAttrs(column)"
          >
            <template #default="scope">
              <slot name="formItem" v-bind="scope"></slot>
            </template>
          </custom-form-item>
        </template>
      </custom-form>
    </slot>
  </i-modal>
</template>
