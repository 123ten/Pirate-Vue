<!-- 权限按钮 -->
<script lang="ts">
import { withDefaults, defineProps, defineOptions, defineEmits } from "vue";
import { TButtonType } from "@/types";
defineOptions({
  name: "IButton",
});
</script>
<script setup lang="ts">
//#region interface

/**
 * @param type 按钮类型
 */
interface IProps {
  type: TButtonType;
  size?: "large" | "middle" | "small";
  shape?: "default" | "circle" | "round";
  href?: string | undefined; // 点击跳转的地址，指定此属性 button 的行为和 a 链接一致
  target?: string | undefined;
  danger?: boolean;
  disabled?: boolean;
  loading?: boolean;
  ghost?: boolean; // 幽灵属性，使按钮背景透明
  class?: ""; // 按钮类名
}
//#endregion
const props = withDefaults(defineProps<IProps>(), {
  type: "default",
  size: "middle",
  shape: "default",
  href: undefined,
  target: undefined,
  danger: false,
  disabled: false,
  loading: false,
  ghost: false,
  class: "",
});
const emits = defineEmits([
  "click", // 表格搜索
]);

const onClick = () => {
  emits("click");
};
</script>

<template>
  <a-button v-bind="props" @click="onClick">
    <!-- 图标 可自定义 -->
    <slot name="icon"></slot>
    <slot></slot>
  </a-button>
</template>

<style lang="less" scoped>
@import "./index.less";
</style>
