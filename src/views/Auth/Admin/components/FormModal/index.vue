<!-- 角色组管理 添加/编辑 -->
<script setup lang="ts">
import {reactive, ref,} from "vue";
import {Form, notification} from "ant-design-vue";
import {detail, getRoleList, upsert} from "@/api/admin";
import {useI18n} from "vue-i18n";
import {Rules} from "@/types/form";

const {t} = useI18n();

interface IFormState {
  id?: number; // 主键 ID
  roleIds: number[]; // 角色组
  username: string; // 登录用户名
  nickname: string; // 昵称
  avatar: string; // 头像
  avatarPath?: string; // 头像路径
  email: string; // 邮箱
  phone: string; // 手机号
  password: string; // 密码
  status: number; // 状态
  fileList: any[]; // 头像文件
}

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  options: {
    type: Object,
    default: () => ({}),
  },
})

const emits = defineEmits([
  "confirm", // 点击确定回调
  "cancel", // 点击遮罩层或右上角叉或取消按钮的回调
]);

//#region  变量
// 校验规则
const formState = reactive<IFormState>({
  id: undefined,
  roleIds: [],
  username: "",
  nickname: "",
  avatar: "",
  email: "",
  phone: "",
  password: "",
  status: 1,
  fileList: [],
});
const rules = reactive<Rules>({
  username: [{required: true, message: t('user.error.username')}],
  nickname: [{required: true, message: t('user.error.nickname')}],
  roleIds: [{required: true, message: t('user.error.roles')}],
  password: undefined,
})
const {resetFields, validate, validateInfos} = Form.useForm(formState, rules);
const roleOptions = ref([]);
const loading = ref<boolean>(false);
//#endregion

const init = async () => {
  rules.password = [{required: !props.options?.id, message: t('user.error.password')}];
  console.log('options', props.options);
  if (props.options?.id) {
    await getDetail(props.options.id);
  }
  await getRoleListApi();
};

const getDetail = async (id: number) => {
  loading.value = true;
  try {
    const {data} = await detail(id);
    console.log("getAdminDetail", data);
    data.roleIds = data.roles.map((item: any) => item.id);
    data.fileList = data.avatar ? [{
      // 按照要求乱填即可
      url: data.avatar,
      path: data.avatarPath,
      status: 'done',
      uid: '1',
    }] : [];
    Object.assign(formState, data);
  } finally {
    loading.value = false;
  }
};

const getRoleListApi = async () => {
  const {data} = await getRoleList({});
  console.log("getRoleList", data);
  roleOptions.value = data;
};

// 确定
const handleConfirm = async (): Promise<void> => {
  await validate();
  loading.value = true;
  try {
    const [response] = formState.fileList || []
    const params = {
      ...formState,
      fileList: undefined,
      avatar: response?.path,
    };
    console.log(params);
    await upsert(params)
    notification.success({
      message: t("message.success"),
      description: t(props.options?.id ? "success.update" : "success.create"),
    })
    emits("confirm");
    resetFields();
  } finally {
    loading.value = false
  }
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
      :init="init"
      :loading="loading"
      :title=" $t(props.options?.id ?'title.update': 'title.create') "
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
            $t(props.options?.id
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
