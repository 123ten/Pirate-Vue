<!-- 个人资料 - 修改信息 -->
<script setup lang="ts">
import { reactive, ref, unref } from "vue";
import {
  PlusOutlined,
  LoadingOutlined,
  UserOutlined,
} from "@ant-design/icons-vue";
import { message, notification } from "ant-design-vue";
import { Form } from "ant-design-vue";

const useForm = Form.useForm;
const formInfo = reactive({
  avatar: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
  // avatar: "",
  username: "",
  password: "",
  nickname: "admin",
  email: "",
  phone: "",
  motto: "",
  lastlogintime: "2023-06-03 17:23:56",
});
// 校验规则
const rules = reactive({
  nickname: [{ required: true, message: "请输入用户昵称" }],
});
const fileList = ref<object[]>([]);
const isAvatarUploadLoading = ref<boolean>(false);
const { resetFields, validate, validateInfos } = useForm(formInfo, rules);
const handleAvatarUploadChange = ({ file }: any) => {
  //   console.log(file);
  const { status, response } = file; // uploading done error
  if (status === "uploading") {
    console.log("正在上传");
    isAvatarUploadLoading.value = true;
  } else if (status === "done") {
    console.log("上传成功");
    console.log(response);
    const { code, data } = response;
    if (code === "0000") {
      formInfo.avatar = data[0].full_url;
      console.log("fileList", unref(fileList));
    }
    isAvatarUploadLoading.value = false;
  } else if (status === "error") {
    console.log("上传失败");
    isAvatarUploadLoading.value = false;
    notification.error({
      message: "上传失败",
    });
    // message.error('上传失败')
  }
};
</script>

<template>
  <div class="edit-info">
    <div class="edit-head mb_16">
      <a-upload
        name="file"
        list-type="picture-card"
        class="avatar"
        :show-upload-list="false"
        action="http://localhost/api/upload"
        @change="handleAvatarUploadChange"
      >
        <div class="avatar-default">
          <img
            v-if="formInfo.avatar"
            :src="formInfo.avatar"
            alt="头像加载失败"
            class="avatar-img avatar-turn"
          />
          <a-avatar :size="120" v-else>
            <template #icon>
              <user-outlined />
            </template>
          </a-avatar>
          <div class="avatar-loading" v-if="isAvatarUploadLoading">
            <loading-outlined />
            <div class="avatar-loading-text">正在上传</div>
          </div>
        </div>
      </a-upload>
      <div class="nickname">{{ formInfo.nickname }}</div>
      <div>
        上次登录于
        {{ formInfo.lastlogintime }}
      </div>
    </div>
    <div class="edit-main mb_16">
      <a-form
        ref="formRef"
        :model="formInfo"
        name="basic"
        autocomplete="off"
        layout="vertical"
        :rules="rules"
      >
        <a-form-item label="用户名">
          <a-input
            v-model="formInfo.username"
            placeholder="请输入用户名"
            disabled
          />
        </a-form-item>
        <a-form-item label="用户昵称" v-bind="validateInfos.nickname">
          <a-input v-model="formInfo.nickname" placeholder="请输入用户昵称" />
        </a-form-item>
        <a-form-item label="邮箱地址">
          <a-input v-model="formInfo.email" placeholder="请输入邮箱地址" />
        </a-form-item>
        <a-form-item label="手机号码">
          <a-input v-model="formInfo.email" placeholder="请输入手机号码" />
        </a-form-item>
        <a-form-item label="签名">
          <a-textarea
            v-model="formInfo.motto"
            placeholder="这家伙很懒，什么都没有留下"
          />
        </a-form-item>
        <a-form-item label="新密码">
          <a-input v-model="formInfo.email" placeholder="不修改请留空" />
        </a-form-item>
      </a-form>
    </div>
    <div class="edit-foot">
      <a-button type="primary">保存</a-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
@import "./index.less";
</style>
