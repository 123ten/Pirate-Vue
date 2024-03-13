<!-- 角色组管理 添加/编辑 -->
<script setup lang="ts">
import {reactive, ref, toRaw, withDefaults,} from "vue";
import {Form} from "ant-design-vue";

interface IPropsModal {
  title?: string; // modal 标题
  visible?: boolean; // 控制 modal 开关
}

interface IFormState {
  pid: number | string | undefined; // 上级分组
  username: string; // 登录用户名
  nickname: string; // 昵称
  avatar: string; // 头像
  email: string; // 邮箱
  phone: string; // 手机号
  password: string; // 密码
  sign: string; // 个性签名
  status: number; // 状态
}

const props = withDefaults(defineProps<IPropsModal>(), {
  title: "",
  visible: false,
});
const emits = defineEmits([
  "confirm", // 点击确定回调
  "cancel", // 点击遮罩层或右上角叉或取消按钮的回调
]);

//#region  变量
// 校验规则
const useForm = Form.useForm;
const rules = {
  username: [{required: true, message: "请输入登录用户名"}],
  nickname: [{required: true, message: "请输入昵称"}],
  pid: [{required: true, message: "请选择分组"}],
  password: [{required: true, message: "请输入密码"}],
};
const formState = reactive<IFormState>({
  pid: "",
  username: "",
  nickname: "",
  avatar: "",
  email: "",
  phone: "",
  password: "",
  sign: "",
  status: 0,
});
const fileList = ref([]);
const isUploadAvatarLoading = ref<boolean>(false); // 上传头像加载
const {resetFields, validate, validateInfos} = useForm(formState, rules);
//#endregion

// 确定
const handleConfirm = async (): Promise<void> => {
  console.log(formState);
  resetFields();
  try {
    await validate();
    console.log(toRaw(formState));
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
      width="500px"
      @confirm="handleConfirm"
      @cancel="handleCancel"
  >
    <a-form
        :model="formState"
        name="admin"
        :label-col="{ span: 6 }"
        autocomplete="off"
        :rules="rules"
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
      <a-form-item label="分组" v-bind="validateInfos.pid">
        <a-select
            v-model:value="formState.pid"
            allow-clear
            placeholder="请选择分组"
        >
          <a-select-option :value="0">Zone one</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="头像" name="avatar">
        <i-upload/>
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
      <a-form-item label="个性签名" name="sign">
        <a-textarea
            v-model:value="formState.sign"
            allow-clear
            placeholder="请输入个性签名"
        />
      </a-form-item>
      <a-form-item label="状态" name="status">
        <a-radio-group v-model:value="formState.status">
          <a-radio :value="0"> 禁用</a-radio>
          <a-radio :value="1">启用</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </i-modal>
</template>

<style lang="less" scoped></style>
