<!-- a-tooltip 的 常用封装 -->
<script setup lang="ts">
import { defineEmits, defineProps, defineOptions, withDefaults } from "vue";
import { TooltipProps } from "ant-design-vue";
import { storeToRefs } from "pinia";
import { useMenuStore } from "@/store";
import { TButtonType } from "@/types";

const store = useMenuStore();
const { terminalType } = storeToRefs(store);

interface IProps extends TooltipProps {
  title: string; // tooltip 标题
  content?: string; // tooltip 内容 使用 content 无需此参数
  disabled?: boolean; // tooltip 默认按钮 是否禁用 默认 否
  type?: TButtonType; // tooltip 默认按钮 按钮主题色
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

defineOptions({
  name: "ITooltip",
});
</script>

<template>
  <a-tooltip
    :disabled="props.disabled"
    :title="terminalType === 'pc' && props.title"
  >
    <!-- 自定义内容 -->
    <slot name="content">
      <i-button
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
      </i-button>
    </slot>
  </a-tooltip>
</template>

<style lang="less" scoped>
@import "./index.less";
</style>
