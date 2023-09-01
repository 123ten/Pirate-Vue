<!-- 登录 -->
<script setup lang="ts">
import { UserOutlined, LockOutlined } from "@ant-design/icons-vue";
import { onMounted, onBeforeUnmount, reactive, ref, nextTick } from "vue";
import * as pageBubble from "@/utils/pageBubble";
import { debounce } from "@/utils/common";
import avatar_default from "@/assets/images/avatar.png";

const rules = reactive({
  username: [{ required: true, message: "请输入您的账号！" }],
  password: [{ required: true, message: "请输入您的密码!" }],
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
  <div class="switch-language">
    <el-dropdown
      size="large"
      :hide-timeout="50"
      placement="bottom-end"
      :hide-on-click="true"
    >
      <Icon
        name="fa fa-globe"
        color="var(--el-text-color-secondary)"
        size="28"
      />
      <template #dropdown>
        <el-dropdown-menu class="chang-lang">
          <el-dropdown-item
            v-for="item in config.lang.langArray"
            :key="item.name"
            @click="editDefaultLang(item.name)"
          >
            {{ item.value }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
  <div @contextmenu.stop="" id="bubble" class="bubble">
    <canvas id="bubble-canvas" class="bubble-canvas"></canvas>
  </div>
  <div class="login">
    <div class="login-box">
      <div class="head">
        <img src="@/assets/images/login-header.png" alt="avatar" />
      </div>
      <div class="form">
        <a-avatar :size="100" class="profile-avatar" :src="avatar" />
        <div class="content">
          <a-form
            :model="formLogin"
            name="basic"
            autocomplete="off"
            :rules="rules"
            @finish="handleLogin"
            @keyup.enter="handleLogin"
          >
            <a-form-item name="username">
              <a-input
                v-model:value="formLogin.username"
                placeholder="请输入账号"
                allow-clear
                @input="handleUserNameInput"
              >
                <template #prefix>
                  <UserOutlined class="site-form-item-icon" />
                </template>
              </a-input>
            </a-form-item>

            <a-form-item name="password">
              <a-input-password
                v-model:value="formLogin.password"
                allow-clear
                placeholder="请输入密码"
              >
                <template #prefix>
                  <LockOutlined class="site-form-item-icon" />
                </template>
              </a-input-password>
            </a-form-item>

            <a-form-item name="remember">
              <a-checkbox v-model:checked="formLogin.remember">
                保持会话
              </a-checkbox>
            </a-form-item>

            <a-form-item>
              <a-button
                class="submit"
                type="primary"
                html-type="submit"
                :loading="isLoginBtnLoading"
              >
                登 录
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
