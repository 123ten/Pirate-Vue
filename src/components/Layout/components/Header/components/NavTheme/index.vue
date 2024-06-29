<!-- 黑/白 -->
<script setup lang="ts">
import {defineOptions, nextTick, onMounted, ref} from "vue";
import {useTheme} from '@/store/hooks'

const {setAlgorithm, useToken} = useTheme()

const {token} = useToken()

type Theme = "dark" | "light"

// 切换主题 黑/白 默认白 true; 黑 false
const visible = ref<boolean>(false);

onMounted(() => {
  const theme = localStorage.getItem("theme") as Theme;
  visible.value = theme === "dark";
  setAlgorithm(visible.value ? 'darkAlgorithm' : 'defaultAlgorithm')
  // 设置主题
  window.document.documentElement.setAttribute("data-theme", theme || "light");
  setStyleAttribute(theme)
});

const handleThemeChange = () => {
  visible.value = !visible.value;
  setAlgorithm(visible.value ? 'darkAlgorithm' : 'defaultAlgorithm')
  const theme = visible.value ? "dark" : "light";
  // 缓存主题
  localStorage.setItem("theme", theme);
  window.document.documentElement.setAttribute("data-theme", theme);
  setStyleAttribute(theme)
};

const setStyleAttribute = (theme: Theme) => {
  nextTick(() => {
    const _t = token.value
    const isDartTheme = theme === 'dark'
    const customToken = {
      ..._t,
      colorBgLayoutContainer: isDartTheme ? _t.colorBgContainer : '#f0f2f5'
    }
    const keys: string[] = [
      'colorBgLayoutContainer',
      'colorBgContainer',
      'colorBgTextHover',
      'colorPrimary',
      'colorText',
      'colorBorderSecondary',
      'motionUnit',
      'boxShadow',
      'boxShadowSecondary'
    ]
    const style = Object.keys(customToken).filter(key => keys.includes(key)).map((key) => `--${key}:${customToken[key]}`).join(';');
    window.document.documentElement.setAttribute("style", style);
  })
}


defineOptions({
  name: "NavTheme",
});
</script>

<template>
  <div class="nav-menu-item" title="切换主题" @click="handleThemeChange">
    <sun-outlined v-if="visible"/>
    <moon-outlined v-else/>
  </div>
</template>

<style lang="less">
@import "./index.less";
</style>
