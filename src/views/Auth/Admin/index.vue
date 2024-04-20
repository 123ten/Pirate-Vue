<!-- 管理员管理 -->
<script setup lang="ts">
import {UserOutlined,} from "@ant-design/icons-vue";
import {provide, ref} from "vue";
import FormModal from "./components/FormModal/index.vue";
import {getAdminById, getAdminList, removeAdmin} from "@/api/auth/admin";
import ProcessingTag from "@/components/IComponents/IOther/ProcessingTag/index.vue";
import StatusTag from "@/components/IComponents/IOther/StatusTag/index.vue";
import TableSettings, {tableSettingKey} from "@/utils/tableSettings";
import {useI18n} from "vue-i18n";
import {AdminTableSettingsType} from "@/views/Auth/Admin/types";

const {t} = useI18n();

const avatarPreviewSrc = ref("");
const isAvatarPreviewSrcVisible = ref<boolean>(false);


// 显示预览图片
const openAvatarPreviewImage = (src: string) => {
  if (!src) return;
  isAvatarPreviewSrcVisible.value = true;
  avatarPreviewSrc.value = src;
};


const tableSettings = new TableSettings<AdminTableSettingsType>({
  api: {
    request: getAdminList,
    detailRequest: getAdminById,
    deleteRequest: removeAdmin
  },
  table: {
    operations: ['refresh', 'create', 'delete', 'row-update', 'row-delete'],
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
      },
      {
        title: "昵称",
        dataIndex: "nickname",
        isI18n: true,
        align: "center",
        width: 100,
      },
      {
        title: "角色组",
        dataIndex: "roles",
        isI18n: true,
        align: "center",
        width: 120,
      },
      {
        title: "头像",
        dataIndex: "avatar",
        isI18n: true,
        align: "center",
        width: 100,
      },
      {
        title: "邮箱",
        dataIndex: "email",
        isI18n: true,
        align: "center",
        width: 150,
      },
      {
        title: "手机号",
        dataIndex: "phone",
        isI18n: true,
        align: "center",
        width: 150,
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
    i18nPrefix: {
      table: 'user.table'
    }
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
      username: [{required: true, message: t('user.error.username')}],
      nickname: [{required: true, message: t('user.error.nickname')}],
      roleIds: [{required: true, message: t('user.error.roles')}],
    },
  },
})

provide(tableSettingKey, tableSettings)
</script>

<template>
  <custom-i-table>
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
    <template #lastLoginIp="{value}">
      <processing-tag :value="value"/>
    </template>
    <template #status="{ value }">
      <status-tag :value="value"/>
    </template>
  </custom-i-table>

  <form-modal/>

  <i-preview-image
      v-model:visible="isAvatarPreviewSrcVisible"
      :src="avatarPreviewSrc"
  />
</template>

