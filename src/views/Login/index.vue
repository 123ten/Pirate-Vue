<!-- 登录 -->
<script setup lang="ts">
import { UserOutlined, LockOutlined } from "@ant-design/icons-vue";
import { onMounted, onBeforeUnmount, reactive, ref } from "vue";
import * as pageBubble from "@/utils/pageBubble";
import { debounce } from "@/utils/common";
import avatar_default from "@/assets/images/avatar.png";
import { useI18n } from "vue-i18n";
import { getAvatar, getSvgCaptcha, login } from "@/api/user";

const { t } = useI18n();

const rules = reactive({
  username: [{ required: true, message: t("login.userNameError") }],
  password: [{ required: true, message: t("login.passwordError") }],
  captcha: [{ required: true, message: t("login.captchaError") }],
});

const loginForm = reactive({
  username: "",
  password: "",
  captcha: "",
  isAdmin: true,
  remember: false,
});
const avatar = ref<string>("");
const svg_captcha = ref<string>("");
const spinning = ref<boolean>(false); // 加载中
const isLoginBtnLoading = ref<boolean>(false);

onMounted(async () => {
  pageBubble.init();
  await svgCaptchaAsync();
});

onBeforeUnmount(() => {
  pageBubble.removeListeners();
});

const svgCaptchaAsync = async () => {
  const { data } = await getSvgCaptcha();
  svg_captcha.value = data;
};

// 登录
const handleLogin = async () => {
  spinning.value = true;
  try {
    const { data } = await login(loginForm);
    console.log(data);
  } catch (error) {
    await svgCaptchaAsync();
  } finally {
    spinning.value = false;
  }
};

// 根据用户名搜索头像
const handleUserNameInput = debounce(async () => {
  console.log(loginForm.username);
  try {
    const { data } = await getAvatar({ username: loginForm.username });
    avatar.value = data;
  } catch (error) {
    avatar.value = "";
  }
}, 500);
</script>

<template>
  <div @contextmenu.stop="" id="bubble" class="bubble">
    <canvas id="bubble-canvas" class="bubble-canvas"></canvas>
  </div>
  <div class="login">
    <div class="login-box">
      <a-spin :spinning="spinning">
        <div class="head">
          <img src="@/assets/images/login-header.png" alt="avatar" />
        </div>
        <div class="form">
          <a-avatar
            :size="100"
            class="profile-avatar"
            :src="avatar || avatar_default"
          />
          <div class="content">
            <a-form
              :model="loginForm"
              :rules="rules"
              name="basic"
              autocomplete="off"
              @finish="handleLogin"
            >
              <a-form-item name="username">
                <a-input
                  v-model:value="loginForm.username"
                  allow-clear
                  :placeholder="$t('login.userNamePlaceholder')"
                  @input="handleUserNameInput"
                >
                  <template #prefix>
                    <user-outlined class="site-form-item-icon" />
                  </template>
                </a-input>
              </a-form-item>

              <a-form-item name="password">
                <a-input-password
                  v-model:value="loginForm.password"
                  allow-clear
                  :placeholder="$t('login.passwordPlaceholder')"
                >
                  <template #prefix>
                    <lock-outlined class="site-form-item-icon" />
                  </template>
                </a-input-password>
              </a-form-item>

              <a-form-item name="captcha">
                <a-input
                  v-model:value="loginForm.captcha"
                  :placeholder="$t('login.captchaPlaceholder')"
                >
                  <template #suffix>
                    <div
                      class="svg_captcha"
                      v-html="svg_captcha"
                      @click="svgCaptchaAsync"
                    ></div>
                  </template>
                </a-input>
              </a-form-item>

              <a-form-item name="remember">
                <a-checkbox v-model:checked="loginForm.remember">
                  {{ $t("login.remember") }}
                </a-checkbox>
              </a-form-item>

              <a-form-item>
                <a-button
                  class="submit"
                  type="primary"
                  html-type="submit"
                  :loading="isLoginBtnLoading"
                >
                  {{ $t("login.login") }}
                </a-button>
              </a-form-item>
            </a-form>
          </div>
        </div>
      </a-spin>
    </div>
  </div>
</template>

<style lang="less" scoped>
@import "./index.less";
</style>
