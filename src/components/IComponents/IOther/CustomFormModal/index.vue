<!-- 角色组管理 添加/编辑 -->
<script setup lang="ts">
import { computed, inject, toRefs, useAttrs } from "vue";
import { tableSettingKey } from "@/utils/tableSettings";
import { IModalProps } from "@/components/IComponents/IModal/types";
import { FormItemProps, FormProps } from "ant-design-vue";
import { TableSettingsType } from "@/types/tableSettingsType";
import { useI18n } from "vue-i18n";
import { IColumns } from "@/types";
import { FormFieldProps } from "@/types/table";

interface CustomFormModalProps extends IModalProps {
  formConfig: FormProps;
  formItemConfig: FormItemProps;
}

const { t, te } = useI18n();

const props = withDefaults(defineProps<CustomFormModalProps>(), {});
const { formConfig, formItemConfig, ...resetAttrs } = useAttrs();

const tableSettings = inject<TableSettingsType>(tableSettingKey);

const filterFormColumns = computed(() => {
  return (
    tableSettings?.table.columns.filter((column: IColumns) => column.form) || []
  );
});

const i18nPrefix = computed(() => tableSettings?.table.i18nPrefix);

const i18nName = (key: string, column: IColumns) => {
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
  const il8nName = i18nName("label", column);
  return column.formLabelProp || te(il8nName) ? t(il8nName) : column.title;
};

const placeholder = (column: IColumns) => {
  const il8nName = i18nName("placeholder", column);
  return column.placeholder || te(il8nName) ? t(il8nName) : undefined;
};

const formItemAttrs = (column: IColumns) => ({
  ...tableSettings?.formRefs?.validateInfos[valueProp(column)],
  ...column.formItemConfig,
});
</script>

<template>
  <i-modal
    v-if="tableSettings"
    :visible="tableSettings.form.visible"
    :loading="tableSettings.form.loading"
    :title="$t(tableSettings.form.fields.id ? 'title.update' : 'title.create')"
    :maskClosable="false"
    @cancel="tableSettings?.cancelForm"
    @confirm="tableSettings?.confirmForm"
    v-bind="resetAttrs"
  >
    <a-form
      :name="tableSettings.form.name"
      autocomplete="off"
      :label-col="{ span: 4 }"
      v-bind="props.formConfig"
    >
      <slot>
        <template v-for="column in filterFormColumns" :key="column.dataIndex">
          <a-form-item
            :label="labelProp(column)"
            :name="valueProp(column)"
            v-bind="formItemAttrs(column)"
          >
            <a-input
              v-if="typeProp(column) === 'input' || !typeProp(column)"
              v-model:value="tableSettings.form.fields[valueProp(column)]"
              allow-clear
              :placeholder="placeholder(column)"
              v-bind="column.formFieldConfig"
            />
            <a-input
              v-if="typeProp(column) === 'input-number'"
              v-model:value="tableSettings.form.fields[valueProp(column)]"
              allow-clear
              :placeholder="placeholder(column)"
              v-bind="column.formFieldConfig"
            />
            <a-input-password
              v-else-if="typeProp(column) === 'input-password'"
              v-model:value="tableSettings.form.fields[valueProp(column)]"
              allow-clear
              :placeholder="placeholder(column)"
              v-bind="column.formFieldConfig"
            />
            <a-textarea
              v-else-if="typeProp(column) === 'textarea'"
              v-model:value="tableSettings.form.fields[valueProp(column)]"
              allow-clear
              :placeholder="placeholder(column)"
              v-bind="column.formFieldConfig"
            />
            <i-tree-select
              v-else-if="typeProp(column) === 'tree-select'"
              v-model:value="tableSettings.form.fields[valueProp(column)]"
              :tree-data="column.options"
              :placeholder="placeholder(column)"
              v-bind="column.formFieldConfig"
            />
            <a-select
              v-else-if="typeProp(column) === 'select'"
              v-model:value="tableSettings.form.fields[valueProp(column)]"
              allow-clear
              :placeholder="placeholder(column)"
              v-bind="column.formFieldConfig"
            >
              <a-select-option
                v-for="option in column.options"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </a-select-option>
            </a-select>
            <a-cascader
              v-else-if="typeProp(column) === 'cascader'"
              v-model:value="tableSettings.form.fields[valueProp(column)]"
              :options="column.options"
              :placeholder="placeholder(column)"
              allow-clear
              v-bind="column.formFieldConfig"
            />
            <i-upload
              v-else-if="typeProp(column) === 'upload'"
              v-model:value="tableSettings.form.fields[valueProp(column)]"
              v-bind="column.formFieldConfig"
            />
            <a-radio-group
              v-else-if="typeProp(column) === 'radio'"
              v-model:value="tableSettings.form.fields[valueProp(column)]"
              v-bind="column.formFieldConfig"
            >
              <a-radio
                v-for="option in column.options"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </a-radio>
            </a-radio-group>
            <a-date-picker
              v-else-if="typeProp(column) === 'date-picker'"
              v-model:value="tableSettings.form.fields[valueProp(column)]"
              :picker="column.picker"
              v-bind="column.formFieldConfig"
            />
            <a-range-picker
              v-else-if="typeProp(column) === 'range-picker'"
              v-model:value="tableSettings.form.fields[valueProp(column)]"
              :picker="column.picker"
              v-bind="column.formFieldConfig"
            />
          </a-form-item>
        </template>
      </slot>
    </a-form>
  </i-modal>
</template>

<style lang="less" scoped></style>
