<!-- 权限按钮 -->
<script setup lang="ts">
//#region interface
interface IDataSource {
  key: string;
  children?: IDataSource[];
}
/**
 * @param type 按钮类型
 */
interface IProps {
  type?: "primary" | "ghost" | "dashed" | "link" | "text" | "default";
  size?: "large" | "middle" | "small";
  shape?: "default" | "circle" | "round";
  href?: string | undefined; // 点击跳转的地址，指定此属性 button 的行为和 a 链接一致
  target?: string | undefined;
  privilege?: string; // 权限判断
  danger?: boolean;
  disabled?: boolean;
  loading?: boolean;
  ghost?: boolean; // 幽灵属性，使按钮背景透明
}
//#endregion
const props = withDefaults(defineProps<IProps>(), {
  type: "default",
  size: "middle",
  shape: "default",
  privilege: "",
  href: undefined,
  target: undefined,
  danger: false,
  disabled: false,
  loading: false,
  ghost: false,
});
const emits = defineEmits([
  "click", // 表格搜索
]);
</script>

<template>
  <a-button
    v-if="[props.privilege].includes(privilege)"
    :type="props.type"
    :disabled="props.disabled"
    :size="props.size"
    :href="props.href"
    :target="props.target"
    :danger="props.danger"
    :loading="props.loading"
    :ghost="props.ghost"
    @click="emits('click')"
  >
    <!-- 图标 可自定义 -->
    <slot name="icon"></slot>
    <slot></slot>
  </a-button>
</template>

<style lang="less" scoped>
@import "./index.less";
</style>
