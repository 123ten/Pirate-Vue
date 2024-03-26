<!-- 默认_气泡确认框 -->
<script setup lang="ts">
import {defineEmits, defineOptions, defineProps, withDefaults} from "vue";
import {PopconfirmProps} from "ant-design-vue";

interface IProps extends PopconfirmProps {
  visible?: boolean; // 是否显示
  title?: string; // 气泡框标题
  okText?: string; // 确定按钮文字
  cancelText?: string; // 取消按钮文字
  btnText?: string; // 按钮文字
  disabled?: boolean; // 是否禁用
  type?: "primary" | 'danger' | "dashed" | "link" | "text" | "ghost" | "default"; // 按钮类型
  size?: "large" | "middle" | "small"; // 按钮大小
}

const props = withDefaults(defineProps<IProps>(), {
  visible: undefined,
  title: undefined,
  okText: "确定",
  cancelText: "取消",
  btnText: "",
  disabled: false,
  type: "default",
  size: "middle",
  placement: "top",
});
const emits = defineEmits([
  "click",
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
  // if (props.disabled) return;
  emits("update:visible", visible);
  emits("visibleChange", visible);
};

const onClick = () => {
  // emits("update:visible", !props.visible);
  emits('click')
};

defineOptions({
  name: "IPopconfirm",
});
</script>

<template>
  <template v-if="props.disabled">
    <slot>
      <!-- 默认展示按钮 -->
      <a-button
          :type="props.type"
          :size="props.size"
          :disabled="props.disabled"
          @click="onClick"
      >
        <template #icon>
          <slot name="icon"/>
        </template>
        {{ props.btnText }}
        <!-- <template v-for="(slot, key) in $slots" v-slot:[key]>
          <slot :name="key" :slot="slot"></slot>
        </template> -->
      </a-button>
    </slot>
  </template>
  <a-popconfirm
      v-else
      :visible="props.visible"
      :title="props.title"
      :ok-text="props.okText"
      :ok-button="props.type === 'danger'? 'primary' : props.type"
      :ok-button-props="{danger: props.type === 'danger'}"
      :cancel-text="props.cancelText"
      :placement="props.placement"
      @cancel="onCancel"
      @confirm="onConfirm"
      @visible-change="onVisibleChange"
  >
    <slot>
      <!-- 默认展示按钮 -->
      <a-button
          :type="props.type"
          :size="props.size"
          :disabled="props.disabled"
          @click="onClick"
      >
        <template #icon>
          <slot name="icon"/>
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
