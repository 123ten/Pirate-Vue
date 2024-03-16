<!--表格头部 展开收缩按钮-->
<script setup lang="ts">
import {defineEmits, defineProps} from "vue";

const props = defineProps({
  expand: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["update:expand"]);
</script>

<template>
  <i-tooltip
      :title="props.expand ? '收缩所有子菜单' : '展开所有子菜单'"
      :content="props.expand ? '收缩所有' : '展开所有'"
      :type="props.expand ? 'danger' : 'warning'"
      @click="(e) => emit('update:expand', !props.expand)"
  />
</template>
