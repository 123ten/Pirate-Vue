<!-- a-tooltip 的 常用封装 -->
<script setup lang="ts">
import { withDefaults } from "vue";
interface IProps {
  title: string; // tooltip 标题
  content?: string; // tooltip 内容 使用 content 无需此参数
  disabled?: boolean; // tooltip 默认按钮 是否禁用 默认 否
  type?: string; // tooltip 默认按钮 按钮主题色
  size?: string; // size 默认按钮大小
  btnClass?: ""; // 按钮类名
}
const props = withDefaults(defineProps<IProps>(), {
  title: "",
  content: "",
  disabled: false,
  type: "primary",
  size: "",
  btnClass: "",
});

const emits = defineEmits([
  "click", // 表格搜索
]);
// 默认按钮 点击事件
</script>

<template>
  <a-tooltip :disabled="props.disabled">
    <template #title>
      <span>{{ props.title }}</span>
    </template>
    <!-- 自定义内容 -->
    <slot name="content">
      <IButton
        :type="props.type"
        :disabled="props.disabled"
        :size="props.size"
        :class="props.btnClass"
        @click="emits('click')"
      >
        <template #icon>
          <!-- 图标 可自定义 -->
          <slot name="icon"></slot>
        </template>
        <!-- 内容 -->
        {{ props.content }}
      </IButton>
      <!-- <a-button>
      </a-button> -->
    </slot>
  </a-tooltip>
</template>

<style lang="less" scoped>
@import "./index.less";
</style>
