<script setup lang="ts">
interface EllipsisProps {
  value?: string;
  width?: number | string;
  tooltip?: boolean;
}

const props = defineProps<EllipsisProps>()

defineOptions({
  name: "ellipsis",
})
</script>

<template>
  <a-tooltip placement="topRight">
    <template #title v-if="props.tooltip">
      <slot>
        {{ props.value }}
      </slot>
    </template>
    <span class="ellipsis" :style="{width: `${props.width}px`}">
      <slot>
        {{ props.value }}
      </slot>
    </span>
  </a-tooltip>
</template>

<style scoped lang="less">

</style>
