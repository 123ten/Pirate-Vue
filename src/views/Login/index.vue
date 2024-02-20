<!-- 登录 -->
<script setup lang="ts">
import { UserOutlined, LockOutlined } from "@ant-design/icons-vue";
import { onMounted, onBeforeUnmount, reactive, ref } from "vue";
import * as pageBubble from "@/utils/pageBubble";
import { debounce } from "@/utils/common";
import avatar_default from "@/assets/images/avatar.png";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const rules = reactive({
  username: [{ required: true, message: t("login.userNameError") }],
  password: [{ required: true, message: t("login.passwordError") }],
});

const formLogin = reactive({
  username: "",
  password: "",
  captcha: "",
  remember: false,
  captcha_id: "",
});
const avatar = ref<string>(avatar_default);
const isLoginBtnLoading = ref<boolean>(false);

onMounted(() => {
  pageBubble.init();
});

onBeforeUnmount(() => {
  pageBubble.removeListeners();
});

// 登录
const handleLogin = () => {
  //   isLoginBtnLoading.value = true;
};

// 根据用户名搜索头像
const handleUserNameInput = debounce(() => {
  console.log(formLogin.username);
}, 500);
</script>

<template>
  <div @contextmenu.stop="" id="bubble" class="bubble">
    <canvas id="bubble-canvas" class="bubble-canvas"></canvas>
  </div>
  <div class="login">
    <div class="login-box">
      <div class="head">
        <img src="@/assets/images/login-header.png" alt="avatar" />
      </div>
      <div class="form">
        <a-avatar
          :size="100"
          class="profile-avatar avatar-turn"
          :src="avatar"
        />
        <div class="content">
          <a-form
            :model="formLogin"
            :rules="rules"
            name="basic"
            autocomplete="off"
            @finish="handleLogin"
            @keyup.enter="handleLogin"
          >
            <a-form-item name="username">
              <a-input
                v-model:value="formLogin.username"
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
                v-model:value="formLogin.password"
                allow-clear
                :placeholder="$t('login.passwordPlaceholder')"
              >
                <template #prefix>
                  <lock-outlined class="site-form-item-icon" />
                </template>
              </a-input-password>
            </a-form-item>

            <a-form-item name="remember">
              <a-checkbox v-model:checked="formLogin.remember">
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
    </div>
  </div>
</template>

<style lang="less" scoped>
@import "./index.less";
</style>
