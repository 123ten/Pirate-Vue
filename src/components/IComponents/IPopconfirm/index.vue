<!-- 默认_气泡确认框 -->
<script setup lang="ts">
import {defineOptions} from "vue";
import {ButtonProps} from "ant-design-vue";

interface IPopconfirmProps {
  type?: ButtonProps['type']
  size?: ButtonProps['size']
  disabled?: ButtonProps['disabled']
  buttonText?: string; // 按钮文字
  buttonProps?: ButtonProps
}

defineProps<IPopconfirmProps>()

const emits = defineEmits(['click'])

defineOptions({
  name: "IPopconfirm",
});
</script>

<template>
  <template v-if="disabled">
    <slot>
      <!-- 默认展示按钮 -->
      <a-button :type="type" :size="size" disabled v-bind="buttonProps">
        <template #icon>
          <slot name="icon"/>
        </template>
        {{ buttonText }}
      </a-button>
    </slot>
  </template>
  <a-popconfirm
    v-else
    placement="top"
    v-bind="$attrs"
  >
    <slot>
      <!-- 默认展示按钮 -->
      <a-button
        :type="type"
        :size="size"
        :disabled="disabled"
        v-bind="buttonProps"
        @click="emits('click',$event)"
      >
        <template #icon>
          <slot name="icon"/>
        </template>
        {{ buttonText }}
      </a-button>
    </slot>
  </a-popconfirm>
</template>

<!-- <template v-for="(slot, name) in $slots" v-slot:[name]>
  <slot :name="name" :slot="slot"></slot>
</template> -->

<style lang="less">
@import url("./index.less");
</style>
