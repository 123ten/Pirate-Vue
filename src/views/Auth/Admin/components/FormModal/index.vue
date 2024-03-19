<!-- 角色组管理 添加/编辑 -->
<script setup lang="ts">
import {reactive, ref, toRaw,} from "vue";
import {Form} from "ant-design-vue";
import {getRoleList} from "@/api/admin";

interface IFormState {
  roleIds: number[]; // 上级分组
  username: string; // 登录用户名
  nickname: string; // 昵称
  avatar: string; // 头像
  email: string; // 邮箱
  phone: string; // 手机号
  password: string; // 密码
  status: number; // 状态
  fileList: any[]; // 头像文件
}

const props = defineProps({
  title: {
    type: String,
    default: "",
  },
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
const rules = reactive({
  username: [{required: true, message: '请输入登录用户名'}],
  nickname: [{required: true, message: '请输入登录用户名'}],
  roleIds: [{required: true, message: '请输入登录用户名'}],
  password: [{required: true, message: '请输入密码'}],
})
const formState = reactive<IFormState>({
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
const fileList = ref([]);
const roleOptions = ref([]);
const isUploadAvatarLoading = ref<boolean>(false); // 上传头像加载
const {resetFields, validate, validateInfos} = Form.useForm(formState, rules);
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
  console.log(formState);
  try {
    await validate();
    console.log(toRaw(formState));
    resetFields();
    emits("confirm");
  } catch (error) {
    console.log("error", error);
  }
};

// 取消
const handleCancel = (): void => {
  emits("cancel");
};
</script>

<template>
  <i-modal
      :visible="props.visible"
      :title="props.title"
      :init="init"
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
      <a-form-item label="头像" name="avatar">
        <i-upload
            v-model:file-list="formState.fileList"
            :length="1"
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
      <a-form-item label="密码" v-bind="validateInfos.password">
        <a-input-password
            v-model:value="formState.password"
            allow-clear
            placeholder="请输入密码"
            autocomplete="off"
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
