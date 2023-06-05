<!-- 邮件配置 -->
<script setup lang="ts">
import { reactive, ref, unref, toRaw } from "vue";

//#region interface
interface IFormState {
  site_name: string; // 站点名称
  record_no: string; // 备案号
  version: string; // 版本号
  no_access_ip: string; // 禁止访问 ip
}
//#endregion

//#region 变量定义
const formState = reactive<IFormState>({
  site_name: "",
  record_no: "",
  version: "",
  no_access_ip: "",
});
const isSendEmailBtnLoading = ref<boolean>(false);
const isSubmitBtnLoading = ref<boolean>(false);
//#endregion

//#region 函数方法
// 测试发送地址
const onSendEmail = async () => {};
// 保存
const onSubmit = async () => {
  try {
    isSubmitBtnLoading.value = true;
    console.log("res", toRaw(formState));
  } catch (error) {
    console.log("error", error);
  } finally {
    isSubmitBtnLoading.value = false;
  }
};
//#endregion
</script>

<template>
  <a-form
    ref="formRef"
    :model="formState"
    name="basic"
    :wrapper-col="{ span: 16 }"
    autocomplete="off"
    layout="vertical"
  >
    <a-form-item label="SMTP 服务器" name="site_name">
      <a-input v-model:value="formState.site_name" />
    </a-form-item>
    <a-form-item label="SMTP 端口">
      <a-input v-model:value="formState.record_no" />
    </a-form-item>
    <a-form-item label="SMTP 用户名" name="version">
      <a-input v-model:value="formState.version" />
    </a-form-item>
    <a-form-item label="SMTP 密码">
      <a-input v-model:value="formState.version" />
    </a-form-item>
    <a-form-item label="SMTP 验证方式"
      ><a-select v-model:value="formState.site_name">
        <a-select-option value="shanghai">SSL</a-select-option>
        <a-select-option value="beijing">TLS</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="SMTP 发件人邮箱">
      <a-input v-model:value="formState.version" />
    </a-form-item>
  </a-form>
  <a-space direction="vertical">
    <a-button @click="onSendEmail" :loading="isSendEmailBtnLoading">
      测试发送地址
    </a-button>
    <a-button type="primary" @click="onSubmit" :loading="isSubmitBtnLoading">
      保存
    </a-button>
  </a-space>
</template>

<style lang="less" scoped>
@import "./index.less";
</style>
