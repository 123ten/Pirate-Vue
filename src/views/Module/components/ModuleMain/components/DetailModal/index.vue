<!-- 详情 -->
<script lang="ts">
import {
  computed,
  ref,
  unref,
  withDefaults,
  watch,
  defineExpose,
  defineComponent,
} from "vue";
</script>
<script setup lang="ts">
import BasicInfo from "./components/BasicInfo/index.vue";
import AuthorInfo from "./components/AuthorInfo/index.vue";

const isDetailModal = ref<boolean>(false);

const init = () => {
  isDetailModal.value = true;
};

const handleCancel = () => {
  isDetailModal.value = false;
};

defineExpose({
  init,
});
</script>

<template>
  <IModal
    title="详细信息"
    width="900px"
    :visible="isDetailModal"
    maskClosable
    :footer="null"
    @cancel="handleCancel"
  >
    <div class="detail-main d-flex">
      <div class="main-left">
        <BasicInfo />
      </div>
      <div class="main-right">
        <AuthorInfo />
      </div>
    </div>
  </IModal>
</template>

<style lang="less" scoped>
@import "./index.less";
</style>
