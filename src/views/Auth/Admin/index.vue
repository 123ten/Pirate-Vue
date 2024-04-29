<!-- 管理员管理 -->
<script setup lang="ts">
import {UserOutlined} from "@ant-design/icons-vue";
import {provide, ref, watch} from "vue";
import {adminUpsert, getAdminById, getAdminList, removeAdmin} from "@/api/auth/admin";
import ProcessingTag from "@/components/IComponents/IOther/ProcessingTag/index.vue";
import StatusTag from "@/components/IComponents/IOther/StatusTag/index.vue";
import TableSettings, {tableSettingKey} from "@/utils/tableSettings";
import {useI18n} from "vue-i18n";
import {AdminTableSettingsType} from "@/views/Auth/Admin/types";
import {useRoleStore} from "@/store";
import {storeToRefs} from "pinia";

const {t} = useI18n();

const roleStore = useRoleStore()
const {dataSource: roleOptions} = storeToRefs(roleStore)

const {getRoleListRequest} = roleStore

const avatarPreviewSrc = ref("");
const isAvatarPreviewSrcVisible = ref<boolean>(false);

const onInit = async () => {
  await getRoleListRequest();
};
// 显示预览图片
const openAvatarPreviewImage = (src: string) => {
  if (!src) return;
  isAvatarPreviewSrcVisible.value = true;
  avatarPreviewSrc.value = src;
};

const tableSettings: AdminTableSettingsType = new TableSettings({
  api: {
    request: getAdminList,
    detailRequest: getAdminById,
    deleteRequest: removeAdmin,
    upsertRequest: adminUpsert,
  },
  table: {
    operations: ["refresh", "create", "delete", "row-update", "row-delete"],
    columns: [
      {
        title: "序号",
        dataIndex: "number",
        isI18n: true,
        align: "center",
        width: 80,
      },
      {
        title: "用户名",
        dataIndex: "username",
        isI18n: true,
        align: "center",
        width: 100,
        form: true,
      },
      {
        title: "昵称",
        dataIndex: "nickname",
        isI18n: true,
        align: "center",
        width: 100,
        form: true,
      },
      {
        title: "角色组",
        dataIndex: "roles",
        isI18n: true,
        align: "center",
        width: 120,
        type: 'tree-select',
        form: true,
        formValueProp: "roleIds",
        options: roleOptions,
        formFieldConfig: {
          fieldNames: {label: 'name', value: 'id'},
          multiple: true,
          spliceParentTitle: true,
          treeDefaultExpandAll: true
        }
      },
      {
        title: "头像",
        dataIndex: "avatar",
        isI18n: true,
        align: "center",
        width: 100,
        form: true,
        formValueProp: 'fileList',
        type: 'upload',
        formFieldConfig: {
          length: 1,
          accept: "image/*"
        }
      },
      {
        title: "邮箱",
        dataIndex: "email",
        isI18n: true,
        align: "center",
        width: 150,
        form: true
      },
      {
        title: "手机号",
        dataIndex: "phone",
        isI18n: true,
        align: "center",
        width: 150,
        form: true
      },
      {
        title: "密码",
        dataIndex: "password",
        type: 'input-password',
        form: true,
        placeholder(fields: AdminTableSettingsType['form']['fields']) {
          return t(fields.id
            ? 'user.placeholder.edit_password'
            : 'user.placeholder.password'
          )
        },
      },
      {
        title: "最后登录IP",
        dataIndex: "lastLoginIp",
        isI18n: true,
        align: "center",
        width: 100,
      },
      {
        title: "最后登录时间",
        dataIndex: "lastLoginTime",
        isI18n: true,
        align: "center",
        width: 160,
      },
      {
        title: "创建时间",
        dataIndex: "createTime",
        isI18n: true,
        align: "center",
        width: 160,
      },
      {
        title: "状态",
        dataIndex: "status",
        isI18n: true,
        align: "center",
        width: 100,
        form: true,
        type: 'radio',
        options: [
          {label: t("enum.status.0"), value: 0},
          {label: t("enum.status.1"), value: 1},
        ],
      },
      {
        title: "操作",
        dataIndex: "operation",
        isI18n: true,
        align: "center",
        fixed: "right",
        width: 100,
      },
    ],
    i18nPrefix: "user",
  },
  form: {
    fields: {
      id: undefined,
      roleIds: [],
      username: undefined,
      nickname: undefined,
      avatar: undefined,
      avatarPath: undefined,
      email: undefined,
      phone: undefined,
      motto: undefined,
      password: undefined,
      checkPassword: undefined,
      status: 1,
      fileList: [],
    },
    rules: {
      username: [{required: true, message: t("user.error.username")}],
      nickname: [{required: true, message: t("user.error.nickname")}],
      roleIds: [{required: true, message: t("user.error.roles")}],
    }
  },
  modal: {
    init: onInit
  },
  customParams: {
    confirmForm(params: any) {
      const [response] = params.fileList || [];
      return {
        ...params,
        fileList: undefined,
        avatar: response?.path,
      };
    },
  },
});

provide(tableSettingKey, tableSettings);


watch(
  () => tableSettings.form.fields?.id,
  (id) => {
    tableSettings.form.rules!.password = [{required: !id, message: t("user.error.password")}]
  }
)
</script>

<template>
  <custom-table>
    <template #roles="{ value }">
      <processing-tag v-for="text in value" :key="text" :value="text"/>
    </template>
    <template #avatar="{ record }">
      <a-avatar
        size="large"
        :src="record.avatar"
        @click="openAvatarPreviewImage(record.avatar)"
      >
        <template #icon>
          <user-outlined/>
        </template>
      </a-avatar>
    </template>
    <template #lastLoginIp="{ value }">
      <processing-tag :value="value"/>
    </template>
    <template #status="{ value }">
      <status-tag :value="value"/>
    </template>

    <i-preview-image
      v-model:visible="isAvatarPreviewSrcVisible"
      :src="avatarPreviewSrc"
    />
  </custom-table>
</template>
