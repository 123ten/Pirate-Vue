<!-- 角色组管理 添加/编辑 -->
<script setup lang="ts">
import {computed, inject} from "vue";
import {tableSettingKey} from "@/utils/tableSettings";
import {TableSettingsType} from "@/types/tableSettingsType";
import {useI18n} from "vue-i18n";
import {IColumns} from "@/types";

const {t, te} = useI18n();

const tableSettings = inject<TableSettingsType>(tableSettingKey, {} as any);

const form = computed(() => tableSettings?.form)
const modal = computed(() => tableSettings?.modal)

const filterFormColumns = computed(() => {
  return (
    tableSettings?.table.columns
      .filter((column: IColumns) => typeof column.form === 'function' ? column.form?.(form.value?.fields) : column.form)
      .sort((a, b) => (a.sort || 0) - (b.sort || 0))
    || []
  );
});

const i18nPrefix = computed(() => tableSettings?.table.i18nPrefix);

const getI18nName = (key: string, column: IColumns) => {
  return [i18nPrefix.value, "form", key, column.i18nName || valueProp(column)]
    .filter(Boolean)
    .join(".");
};

const typeProp = (column: IColumns) => {
  return column.formType || column.type;
};

const valueProp = (column: IColumns) => {
  return column.formValueProp || column.dataIndex;
};

const labelProp = (column: IColumns) => {
  const il8nName = getI18nName("label", column);
  return column.formLabelProp || (te(il8nName) ? t(il8nName) : column.title);
};

const getPlaceholder = (column: IColumns) => {
  const il8nName = getI18nName("placeholder", column);
  return (
      typeof column.placeholder === 'function'
        ? column.placeholder(form.value?.fields)
        : column.placeholder
    )
    || (te(il8nName) ? t(il8nName) : undefined);
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
    <a-form
      :name="form.name"
      autocomplete="off"
      :label-col="{ span: 4 }"
      v-bind="form.formConfig"
    >
      <slot>
        <template v-for="column in filterFormColumns" :key="column.dataIndex">
          <a-form-item
            :label="labelProp(column)"
            :name="valueProp(column)"
            v-bind="formItemAttrs(column)"
          >
            <slot
              name="formItem"
              :column="column"
              :fields="form.fields"
              :field="valueProp(column)"
              :placeholder="getPlaceholder(column)"
            >
              <slot
                :name="column.dataIndex"
                :fields="form.fields"
                :field="valueProp(column)"
                :placeholder="getPlaceholder(column)"
              >
                <a-input
                  v-if="typeProp(column) === 'input' || !typeProp(column)"
                  v-model:value="form.fields[valueProp(column)]"
                  allow-clear
                  :placeholder="getPlaceholder(column)"
                  v-bind="column.formFieldConfig"
                />
                <a-input
                  v-if="typeProp(column) === 'input-number'"
                  v-model:value="form.fields[valueProp(column)]"
                  allow-clear
                  :placeholder="getPlaceholder(column)"
                  v-bind="column.formFieldConfig"
                />
                <a-input-password
                  v-else-if="typeProp(column) === 'input-password'"
                  v-model:value="form.fields[valueProp(column)]"
                  allow-clear
                  :placeholder="getPlaceholder(column)"
                  v-bind="column.formFieldConfig"
                />
                <a-textarea
                  v-else-if="typeProp(column) === 'textarea'"
                  v-model:value="form.fields[valueProp(column)]"
                  allow-clear
                  :placeholder="getPlaceholder(column)"
                  v-bind="column.formFieldConfig"
                />
                <i-tree-select
                  v-else-if="typeProp(column) === 'tree-select'"
                  v-model:value="form.fields[valueProp(column)]"
                  :tree-data="getOptions(column)"
                  :placeholder="getPlaceholder(column)"
                  v-bind="column.formFieldConfig"
                />
                <a-select
                  v-else-if="typeProp(column) === 'select'"
                  v-model:value="form.fields[valueProp(column)]"
                  allow-clear
                  :placeholder="getPlaceholder(column)"
                  v-bind="column.formFieldConfig"
                >
                  <a-select-option
                    v-for="option in getOptions(column)"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </a-select-option>
                </a-select>
                <a-cascader
                  v-else-if="typeProp(column) === 'cascader'"
                  v-model:value="form.fields[valueProp(column)]"
                  :options="column.options"
                  :placeholder="getPlaceholder(column)"
                  allow-clear
                  v-bind="column.formFieldConfig"
                />
                <i-upload
                  v-else-if="typeProp(column) === 'upload'"
                  v-model:value="form.fields[valueProp(column)]"
                  v-bind="column.formFieldConfig"
                />
                <a-radio-group
                  v-else-if="typeProp(column) === 'radio'"
                  v-model:value="form.fields[valueProp(column)]"
                  v-bind="column.formFieldConfig"
                >
                  <a-radio
                    v-for="option in getOptions(column)"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </a-radio>
                </a-radio-group>
                <a-radio-group
                  v-else-if="typeProp(column) === 'radio-button'"
                  v-model:value="form.fields[valueProp(column)]"
                  v-bind="column.formFieldConfig"
                >
                  <a-radio-button
                    v-for="option in getOptions(column)"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </a-radio-button>
                </a-radio-group>
                <a-date-picker
                  v-else-if="typeProp(column) === 'date-picker'"
                  v-model:value="form.fields[valueProp(column)]"
                  :picker="column.picker"
                  v-bind="column.formFieldConfig"
                />
                <a-range-picker
                  v-else-if="typeProp(column) === 'range-picker'"
                  v-model:value="form.fields[valueProp(column)]"
                  :picker="column.picker"
                  v-bind="column.formFieldConfig"
                />
                <i-icon
                  v-else-if="typeProp(column) === 'icon'"
                  v-model:value="form.fields[valueProp(column)]"
                  v-bind="column.formFieldConfig"
                />
              </slot>
            </slot>
          </a-form-item>
        </template>
      </slot>
    </a-form>
  </i-modal>
</template>
