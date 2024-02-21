<!-- 默认_气泡确认框 -->
<script setup lang="ts">
import { defineEmits, defineProps, defineOptions, withDefaults } from "vue";
import { PopconfirmProps } from "ant-design-vue";

interface IProps extends PopconfirmProps {
  visible: boolean; // 是否显示
  title?: string; // 气泡框标题
  okText?: string; // 确定按钮文字
  cancelText?: string; // 取消按钮文字
  btnText?: string; // 按钮文字
  disabled?: boolean; // 是否禁用
  type?: "primary" | "dashed" | "link" | "text" | "ghost" | "default"; // 按钮类型
  size?: "large" | "middle" | "small"; // 按钮大小
}

const props = withDefaults(defineProps<IProps>(), {
  visible: false,
  title: "标题",
  okText: "确定",
  cancelText: "取消",
  btnText: "",
  disabled: false,
  type: "default",
  size: "middle",
  placement: "top",
});
const emits = defineEmits([
  "confirm",
  "cancel",
  "update:visible",
  "visibleChange",
]);

/**
 * @description 删除确定
 */
const onConfirm = () => {
  emits("confirm");
};
/**
 * @description 删除取消
 */
const onCancel = () => {
  emits("cancel");
};

/**
 * @description 显示隐藏
 */
const onVisibleChange = (visible: boolean) => {
  emits("update:visible", visible);
  emits("visibleChange", visible);
};

defineOptions({
  name: "IPopconfirm",
});
</script>

<template>
  <a-popconfirm
    :visible="props.visible"
    :title="props.title"
    :ok-text="props.okText"
    :cancel-text="props.cancelText"
    :placement="props.placement"
    @cancel="onCancel"
    @ok="onConfirm"
    @visible-change="onVisibleChange"
  >
    <template #okButton>
      <slot name="okButton">
        <a-button
          :type="props.type || 'primary'"
          size="small"
          @click="onConfirm"
        >
          {{ props.okText }}
        </a-button>
      </slot>
    </template>
    <slot>
      <!-- 默认展示按钮 -->
      <a-button
        :type="props.type"
        :size="props.size"
        :disabled="props.disabled"
      >
        <template #icon>
          <slot name="icon" />
        </template>
        {{ props.btnText }}
        <!-- <template v-for="(slot, key) in $slots" v-slot:[key]>
          <slot :name="key" :slot="slot"></slot>
        </template> -->
      </a-button>
    </slot>
  </a-popconfirm>
</template>

<style lang="less">
@import url("./index.less");
</style>
