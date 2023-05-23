<!-- 角色组管理 添加/编辑 -->
<script setup lang="ts" name="AdminAddEditModal">
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons-vue";
import {
  computed,
  onMounted,
  reactive,
  ref,
  toRefs,
  toRef,
  unref,
  withDefaults,
  watch,
} from "vue";
import type { TreeSelectProps } from "ant-design-vue";
import { TreeSelect } from "ant-design-vue";
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
interface IPropsModal {
  title: string; // modal 标题
  visible: boolean; // 控制 modal 开关
}
interface IFormState {
  pid: number | string | null; // 上级分组
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
  "update:visible",
]);
// 控制 modal 的双向绑定 防止控制台报错
const visible = computed({
  get() {
    return props.visible;
  },
  set(value) {
    emits("update:visible", value);
  },
});

// 校验规则
const rules = {
  username: [{ required: true, message: "请输入登录用户名" }],
  nickname: [{ required: true, message: "请输入昵称" }],
  pid: [{ required: true, message: "请选择分组" }],
  password: [{ required: true, message: "请输入密码" }],
};
const formState = reactive<IFormState>({
  pid: null,
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

const handleUploadAvatarChange = () => {
  console.log("handleUploadAvatarChange");
};
</script>

<template>
  <a-modal
    v-model:visible="visible"
    :title="props.title"
    centered
    :maskClosable="false"
    @ok="emits('confirm')"
    @cancel="emits('cancel')"
  >
    <a-form
      :model="formState"
      name="admin"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 16 }"
      autocomplete="off"
    >
      <a-form-item label="用户名" name="username" :rules="rules.username">
        <a-input
          v-model:value="formState.username"
          allow-clear
          placeholder="请输入管理员用户名"
        />
      </a-form-item>
      <a-form-item label="昵称" name="nickname" :rules="rules.nickname">
        <a-input
          v-model:value="formState.nickname"
          allow-clear
          placeholder="请输入昵称"
        />
      </a-form-item>
      <a-form-item label="分组" name="pid" :rules="rules.pid">
        <a-select
          v-model:value="formState.pid"
          allow-clear
          placeholder="请选择分组"
        >
          <a-select-option :value="0">Zone one</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="头像" name="avatar">
        <a-upload
          v-model:file-list="fileList"
          name="file"
          list-type="picture-card"
          class="avatar-uploader"
          :show-upload-list="false"
          accept="image/png,image/jpeg"
          action="http://localhost:3000/upload"
          @change="handleUploadAvatarChange"
        >
          <img v-if="formState.avatar" :src="formState.avatar" alt="avatar" />
          <div v-else>
            <loading-outlined v-if="isUploadAvatarLoading"></loading-outlined>
            <plus-outlined v-else></plus-outlined>
            <div class="ant-upload-text">Upload</div>
          </div>
        </a-upload>
      </a-form-item>
      <a-form-item label="邮箱" name="email">
        <a-input
          v-model:value="formState.email"
          allow-clear
          placeholder="请输入邮箱"
        />
      </a-form-item>
      <a-form-item label="手机号" name="phone">
        <a-input
          v-model:value="formState.phone"
          allow-clear
          placeholder="请输入手机号"
        />
      </a-form-item>
      <a-form-item label="密码" name="password" :rules="rules.password">
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
          <a-radio :value="0"> 禁用 </a-radio>
          <a-radio :value="1">启用</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<style lang="less" scoped></style>
