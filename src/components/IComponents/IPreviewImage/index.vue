<!-- 图片预览 -->
<script setup lang="ts">
import {withDefaults,} from "vue";

interface IPropsPreviewImage {
  src: string; // 图片地址
  visible: boolean; // visible
}

const props = withDefaults(defineProps<IPropsPreviewImage>(), {
  src: "",
  visible: false,
});
const emits = defineEmits(["update:visible"]);
const onVisibleChange = (flag: boolean) => {
  emits("update:visible", flag);
};

defineOptions({
  name: "IPreviewImage",
})
</script>

<template>
  <a-image
      :style="{ display: 'none' }"
      :preview="{
      visible,
      onVisibleChange: onVisibleChange,
    }"
      :src="props.src"
  />
</template>

<style lang="less" scoped>
// @import "./index.less";
</style>
