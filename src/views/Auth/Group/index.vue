<!-- 角色组管理 -->
<script setup lang="ts">
import {provide, ref} from "vue";
import StatusTag from "@/components/IComponents/IOther/StatusTag/index.vue";
import FormModal from './components/FormModal/index.vue'
import TableSettings, {tableSettingKey} from "@/utils/tableSettings";
import {adminRoleUpsert, getAdminRoleById, getAdminRoleList, removeAdminRole,} from "@/api/auth/admin";
import {AdminRoleTableSettingsType} from "./types";
import {useI18n} from "vue-i18n";
import {deepFilter} from "@/utils/common";

const {t} = useI18n();

const defaultExpandAllRows = ref<boolean>(false);

const getList = async () => {
  defaultExpandAllRows.value = true;
};

const tableSettings = new TableSettings<AdminRoleTableSettingsType>({
  api: {
    request: getAdminRoleList,
    detailRequest: getAdminRoleById,
    deleteRequest: removeAdminRole,
    upsertRequest: adminRoleUpsert,
  },
  table: {
    operations: [
      "refresh",
      "create",
      "delete",
      "expand",
      "row-update",
      "row-delete",
    ],
    columns: [
      {
        title: "上级分组",
        dataIndex: "parentId",
        type: "tree-select",
        form: true,
        hide: true,
        options: (dataSource, fields) => {
          return deepFilter(dataSource, (item) => {
            return item.id !== fields.id
          })
        },
        formFieldConfig: {
          fieldNames: {
            label: 'name',
            value: 'id'
          }
        }
      },
      {
        title: "组别名称",
        dataIndex: "name",
        align: "center",
        width: 200,
        form: true,
      },
      {
        title: "角色标识",
        dataIndex: "slug",
        align: "center",
        width: 200,
        form: true,
      },
      {
        title: "权限",
        dataIndex: "permissions",
        align: "center",
        form: true,
        formValueProp: 'permissionIds'
      },
      {
        title: "描述",
        dataIndex: "description",
        type: "textarea",
        form: true,
        hide: true,
      },
      {
        title: "排序",
        dataIndex: "sort",
        type: "input-number",
        form: true,
        hide: true,
      },
      {
        title: "状态",
        dataIndex: "status",
        align: "center",
        width: 100,
        search: true,
        form: true,
        type: 'select',
        formType: 'radio',
        options: [
          {
            label: t("enum.status.1"),
            value: 1,
          },
          {
            label: t("enum.status.0"),
            value: 0,
          },
        ],
      },
      {
        title: "修改时间",
        dataIndex: "updateTime",
        align: "center",
        width: 160,
      },
      {
        title: "创建时间",
        dataIndex: "createTime",
        align: "center",
        width: 160,
      },
      {
        title: "操作",
        dataIndex: "operation",
        align: "center",
        fixed: "right",
        width: 100,
      },
    ],
    i18nPrefix: "admin_role",
    pagination: false,
    defaultExpandAllRows: true,
  },
  form: {
    fields: {
      parentId: undefined,
      id: undefined,
      name: undefined,
      permissionIds: [],
      slug: undefined,
      updateTime: undefined,
      createTime: undefined,
      status: 1,
    },
    rules: {
      name: [{required: true, message: t("admin_role.error.name")}],
      slug: [{required: true, message: t("admin_role.error.slug")}],
      // permissions: [{required: true, message: t("admin_role.error.permissions")}],
    },
  },
});

provide(tableSettingKey, tableSettings);
</script>

<template>
  <custom-table>
    <template #status="{ value }">
      <status-tag :value="value"/>
    </template>
  </custom-table>

  <form-modal/>
</template>
