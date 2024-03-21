<!-- 角色组管理 添加/编辑 -->
<script setup lang="ts">
import {reactive, ref,} from "vue";
import {Form, notification} from "ant-design-vue";
import {detail, getRoleList, upsert} from "@/api/admin";
import {useI18n} from "vue-i18n";

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
const ruleReactive = reactive({
  username: [{required: true, message: '请输入用户名'}],
  nickname: [{required: true, message: '请输入昵称'}],
  roleIds: [{required: true, message: '请输入选择角色组'}],
  password: [{required: true, message: '请输入密码'}],
})
const {resetFields, validate, validateInfos} = Form.useForm(formState, ruleReactive);
const roleOptions = ref([]);
const loading = ref<boolean>(false);
//#endregion

const init = async () => {
  ruleReactive.password = [{required: !props.options?.id, message: '请输入密码'}];
  console.log('options', props.options);
  if (props.options?.id) {
    await getDetail(props.options.id);
  }
  await getRoleListApi();
};

const getDetail = async (id: number) => {
  loading.value = true;
  try {
    const {data} = await detail({id});
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
      title="新增"
      width="500px"
      @confirm="handleConfirm"
      @cancel="handleCancel"
  >
    <a-form
        name="admin"
        autocomplete="off"
        :label-col="{ span: 4 }"
    >
      <a-form-item label="用户名" v-bind="validateInfos.username">
        <a-input
            v-model:value="formState.username"
            allow-clear
            placeholder="请输入管理员用户名"
        />
      </a-form-item>
      <a-form-item label="昵称" v-bind="validateInfos.nickname">
        <a-input
            v-model:value="formState.nickname"
            allow-clear
            placeholder="请输入昵称"
        />
      </a-form-item>
      <a-form-item label="角色组" v-bind="validateInfos.roleIds">
        <i-tree-select
            v-model:value="formState.roleIds"
            :tree-data="roleOptions"
            :field-names="{ label: 'name', value: 'id' }"
            :placeholder="$t('placeholder.role')"
            multiple
            spliceParentTitle
            tree-default-expand-all
        />
      </a-form-item>
      <a-form-item label="头像" name="fileList">
        <i-upload
            v-model:file-list="formState.fileList"
            :length="1"
            accept="image/*"
        />
      </a-form-item>
      <a-form-item label="电子邮箱" name="email">
        <a-input
            v-model:value="formState.email"
            allow-clear
            placeholder="请输入电子邮箱"
        />
      </a-form-item>
      <a-form-item label="手机号" name="phone">
        <a-input
            v-model:value="formState.phone"
            allow-clear
            placeholder="请输入手机号"
        />
      </a-form-item>
      <a-form-item
          label="密码"
          v-bind="validateInfos.password"
      >
        <a-input-password
            v-model:value="formState.password"
            allow-clear
            placeholder="请输入密码（留空时默认使用原密码）"
        />
      </a-form-item>
      <a-form-item label="状态" name="status">
        <a-radio-group v-model:value="formState.status">
          <a-radio :value="0">禁用</a-radio>
          <a-radio :value="1">启用</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </i-modal>
</template>

<style lang="less" scoped></style>
