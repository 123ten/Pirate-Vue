<!-- a-modal 封装 modal -->
<script setup lang="ts">
import {computed, CSSProperties, ref, unref, watch, watchEffect, withDefaults,} from "vue";
import {useDraggable} from "@vueuse/core";
import type {IDragRect} from "./index";

interface IPropsModal {
  title: string; // modal 标题
  width?: string | number; // modal 宽度
  visible: boolean; // 控制 modal 开关
  maskClosable?: boolean; // 点击蒙层是否允许关闭
  dragModal?: boolean; // 是否允许拖拽 modal 框
  bodyStyle?: CSSProperties; // body 样式
  init?: () => void; // 初始化
}

const props = withDefaults(defineProps<IPropsModal>(), {
  title: "",
  width: "",
  visible: false,
  maskClosable: false,
  // isDraw: true,
  dragModal: true,
  bodyStyle: () => ({
    maxHeight: "60vh",
    overflowY: "auto",
  }),
  init: () => {
  },
});

const emits = defineEmits([
  "confirm", // 点击确定回调
  "cancel", // 点击遮罩层或右上角叉或取消按钮的回调
]);

//#region 自定义拖拽
const modalTitleRef = ref<HTMLElement | null>(null);
const {x, y, isDragging} = useDraggable(modalTitleRef);

const startX = ref<number>(0);
const startY = ref<number>(0);
const startedDrag = ref<boolean>(false);
const transformX = ref<number>(0);
const transformY = ref<number>(0);
const preTransformX = ref<number>(0);
const preTransformY = ref<number>(0);
const dragRect = ref<IDragRect>({left: 0, right: 0, top: 0, bottom: 0});

watch(() => props.visible, (val) => {
  if (val) {
    props.init && props.init();
  } else {
    if (props.dragModal) {
      initDrag();
    }
  }
});

const initDrag = () => {
  transformX.value = 0;
  transformY.value = 0;
  preTransformX.value = 0;
  preTransformY.value = 0;
  startedDrag.value = false;
};

watch([x, y], () => {
  if (!unref(startedDrag)) {
    startX.value = unref(x);
    startY.value = unref(y);
    const bodyRect = document.body.getBoundingClientRect();
    const titleRect = unref(modalTitleRef)!.getBoundingClientRect();
    dragRect.value.right = bodyRect.width - titleRect.width;
    dragRect.value.bottom = bodyRect.height - titleRect.height;
    preTransformX.value = unref(transformX);
    preTransformY.value = unref(transformY);
  }
  startedDrag.value = true;
});

watch(isDragging, () => {
  if (!isDragging) {
    startedDrag.value = false;
  }
});

watchEffect(() => {
  if (startedDrag.value) {
    transformX.value =
        unref(preTransformX) +
        Math.min(Math.max(unref(dragRect).left, x.value), unref(dragRect).right) -
        unref(startX);
    transformY.value =
        unref(preTransformY) +
        Math.min(Math.max(unref(dragRect).top, y.value), unref(dragRect).bottom) -
        unref(startY);
  }
});

const transformStyle = computed<CSSProperties>(() => {
  return {
    transform: `translate(${unref(transformX)}px, ${unref(transformY)}px)`,
  };
});
//#endregion
</script>

<template>
  <a-modal
      :visible="props.visible"
      :width="props.width"
      :bodyStyle="props.bodyStyle"
      :maskClosable="props.maskClosable"
      @ok="emits('confirm')"
      @cancel="emits('cancel')"
  >
    <template #title>
      <div
          ref="modalTitleRef"
          style="width: 100%"
          :style="{ cursor: props.dragModal ? 'move' : 'auto' }"
      >
        {{ props.title }}
      </div>
    </template>
    <template #modalRender="{ originVNode }" v-if="props.dragModal">
      <div :style="transformStyle">
        <component :is="originVNode"/>
      </div>
    </template>
    <slot></slot>
  </a-modal>
</template>

<style lang="less" scoped>
@import "index.less";
</style>
