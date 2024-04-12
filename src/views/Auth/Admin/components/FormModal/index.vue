<!-- 角色组管理 添加/编辑 -->
<script setup lang="ts">
import {reactive, ref,} from "vue";
import {Form, notification} from "ant-design-vue";
import {getRoleList} from "@/api/auth/admin";
import {useI18n} from "vue-i18n";
import {Rules} from "@/types/form";
import {useAdminStore} from "@/store/auth/admin";
import {storeToRefs} from "pinia";

const store = useAdminStore()
const {isModalLoading, formState} = storeToRefs(store);
const {adminUpsertRequest} = store

const {t} = useI18n();

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits([
  "confirm", // 点击确定回调
  "cancel", // 点击遮罩层或右上角叉或取消按钮的回调
]);

//#region  变量
// 校验规则
const rules = reactive<Rules>({
  username: [{required: true, message: t('user.error.username')}],
  nickname: [{required: true, message: t('user.error.nickname')}],
  roleIds: [{required: true, message: t('user.error.roles')}],
  password: formState.value.id ? [{required: true, message: t('user.error.password')}] : undefined,
})

const {resetFields, validate, validateInfos} = Form.useForm(formState, rules);
const roleOptions = ref([]);
//#endregion

const init = async () => {
  await getRoleListApi();
};

const getRoleListApi = async () => {
  const {data} = await getRoleList({});
  console.log("getRoleList", data);
  roleOptions.value = data;
};

// 确定
const handleConfirm = async (): Promise<void> => {
  await validate();
  await adminUpsertRequest()
  notification.success({
    message: t("message.success"),
    description: t(formState.value.id ? "success.update" : "success.create"),
  })
  emits("confirm");
  resetFields();
};


// 取消
const handleCancel = (): void => {
  emits("cancel");
  resetFields();
};
</script>

<template>
  <i-modal
      :visible="props.visible"
      :loading="isModalLoading"
      :title=" $t(formState.id ?'title.update': 'title.create')"
      :init="init"
      width="520px"
      @confirm="handleConfirm"
      @cancel="handleCancel"
  >
    <a-form
        name="admin"
        autocomplete="off"
        :label-col="{ span: 4 }"
    >
      <a-form-item
          :label="$t('user.label.username')"
          v-bind="validateInfos.username"
      >
        <a-input
            v-model:value="formState.username"
            allow-clear
            :placeholder="$t('user.placeholder.admin_username')"
        />
      </a-form-item>
      <a-form-item
          :label="$t('user.label.nickname')"
          v-bind="validateInfos.nickname"
      >
        <a-input
            v-model:value="formState.nickname"
            allow-clear
            :placeholder="$t('user.placeholder.nickname')"
        />
      </a-form-item>
      <a-form-item
          :label="$t('user.label.roles')"
          v-bind="validateInfos.roleIds"
      >
        <i-tree-select
            v-model:value="formState.roleIds"
            :tree-data="roleOptions"
            :field-names="{ label: 'name', value: 'id' }"
            :placeholder="$t('user.placeholder.roles')"
            multiple
            spliceParentTitle
            tree-default-expand-all
        />
      </a-form-item>
      <a-form-item
          :label="$t('user.label.avatar')"
          name="fileList"
      >
        <i-upload
            v-model:file-list="formState.fileList"
            :length="1"
            accept="image/*"
        />
      </a-form-item>
      <a-form-item
          :label="$t('user.label.email')"
          name="email"
      >
        <a-input
            v-model:value="formState.email"
            allow-clear
            :placeholder="$t('user.placeholder.email')"
        />
      </a-form-item>
      <a-form-item
          :label="$t('user.label.phone')"
          name="phone"
      >
        <a-input
            v-model:value="formState.phone"
            allow-clear
            :placeholder="$t('user.placeholder.phone')"
        />
      </a-form-item>
      <a-form-item
          :label="$t('user.label.password')"
          v-bind="validateInfos.password"
      >
        <a-input-password
            v-model:value="formState.password"
            allow-clear
            :placeholder="
            $t(formState.id
              ? 'user.placeholder.edit_password'
              : 'user.placeholder.password')
            "
        />
      </a-form-item>
      <a-form-item
          :label="$t('user.label.status')"
          name="status"
      >
        <a-radio-group v-model:value="formState.status">
          <a-radio :value="0">{{ $t(`user.enum.status.0`) }}</a-radio>
          <a-radio :value="1">{{ $t(`user.enum.status.1`) }}</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </i-modal>
</template>

<style lang="less" scoped></style>
