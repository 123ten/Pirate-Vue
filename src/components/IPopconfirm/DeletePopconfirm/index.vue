<!-- 删除_气泡确认框 -->
<script setup lang="ts">
import { defineEmits, defineProps, defineOptions, withDefaults } from "vue";
import { DeleteOutlined } from "@ant-design/icons-vue";
import { PopconfirmProps } from "ant-design-vue";

interface IProps extends PopconfirmProps {
  visible: boolean; // 是否显示
  disabled?: boolean; // 是否禁用
  type?: "default" | "table"; // 按钮类型
}

const props = withDefaults(defineProps<IProps>(), {
  visible: false,
  disabled: false,
  type: "default",
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
  name: "DeletePopconfirm",
});
</script>

<template>
  <i-popconfirm
    title="确定删除选中记录？"
    ok-text="删除"
    cancel-text="取消"
    type="danger"
    :placement="props.placement"
    :visible="props.visible"
    :disabled="props.disabled"
    :size="props.type === 'table' ? 'small' : 'middle'"
    :btn-text="props.type === 'table' ? '' : '删除'"
    @cancel="onCancel"
    @confirm="onConfirm"
    @visibleChange="onVisibleChange"
  >
    <template #icon>
      <delete-outlined />
    </template>
  </i-popconfirm>
</template>
