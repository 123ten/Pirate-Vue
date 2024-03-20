<!-- a-upload 封装 upload -->
<script setup lang="ts">
import {computed, ref, withDefaults,} from "vue";
import {LoadingOutlined, PlusOutlined} from "@ant-design/icons-vue";
import type {UploadChangeParam} from "ant-design-vue";
import {upload} from "@/api/files";

interface IPropsModal {
  fileList?: any[]; // 文件列表
  alt?: string; // alt
  title?: string; // title
  placeholder?: string; // upload 占位内容
  listType: 'picture-card',
  length?: number; // 上传文件数量
}

const props = withDefaults(defineProps<IPropsModal>(), {
  fileList: undefined,
  alt: "upload",
  title: "",
  placeholder: "上传",
  listType: 'picture-card',
  length: undefined,
});
const emits = defineEmits([
  "update:fileList", // 文件列表
  "change",
  "confirm", // 点击确定回调
  "cancel", // 点击遮罩层或右上角叉或取消按钮的回调
]);

const fileList = ref<any[]>([]);
const previewCurrent = ref<number>(0);
const isUploadLoading = ref<boolean>(false);
const isPreviewImageVisible = ref<boolean>(false); // 是否显示预览图片
const isSelectFileModalVisible = ref<boolean>(false); // 是否显示选择文件 modal

const customRequest = async (originObject) => {
  const {file, onSuccess, onError, onProgress} = originObject;
  console.log("file", originObject);
  const formData = new FormData();
  formData.append('files', file);
  formData.append('uid', file.uid);
  onProgress({percent: 50});
  try {
    const {data} = await upload(formData);
    onProgress({percent: 100});
    const [_data] = data || [];
    const response = {
      ..._data,
      ...file,
      status: 'done'
    }
    onSuccess(response, file);
  } catch (err) {
    onError(err)
  }
};

const listType = computed(() => {
  if (['avatar', 'picture-card'].includes(props.listType)) {
    return 'picture-card'
  }
})
const handleUploadChange = (info: UploadChangeParam) => {
  console.log("info.file", info);
  if (info.file.status === "uploading") {
    isUploadLoading.value = true;
    return
  }
  if (info.file.status === "done") {
    isUploadLoading.value = false;
  } else if (info.file.status === "error") {
    isUploadLoading.value = false;
  }
  emits("update:fileList", info.fileList);
  emits("change", info);
};

const onUploadPreview = (file) => {
  // console.log('onUploadPreview', file)
  isPreviewImageVisible.value = true;
  // 获取预览图片的索引
  const current = fileList.value.findIndex(f => f.uid === file.uid)
  previewCurrent.value = current || 0
}

// 打开选择文件弹窗
const openFileModal = () => {
  isSelectFileModalVisible.value = true;
};
// 取消 - 选择附件
const onFileModalCancel = () => {
  isSelectFileModalVisible.value = false;
};
// 确定 - 选择附件
const onFileModalConfirm = () => {
  onFileModalCancel();
};
</script>

<template>
  <div class="i-upload relative inline-block rounded-md transition-all">
    <a-upload
        v-model:file-list="fileList"
        :custom-request="customRequest"
        name="files"
        :list-type="listType"
        class="uploader"
        multiple
        @change="handleUploadChange"
        @preview="onUploadPreview"
    >
      <template v-if="!props.length || fileList.length < props.length">
        <div class="select-text" @click.stop="openFileModal">选择</div>
        <div class="h-[100%] flex flex-col justify-center items-center">
          <loading-outlined v-if="isUploadLoading" class="i-upload-icon"/>
          <plus-outlined v-else class="i-upload-icon"/>
          <div class="i-upload-text">
            {{ props.placeholder }}
          </div>
        </div>
      </template>
    </a-upload>
  </div>

  <div class="hidden">
    <a-image-preview-group
        :preview="{
          visible:isPreviewImageVisible,
          onVisibleChange: vis => (isPreviewImageVisible = vis),
          maskClassName: 'i-upload-preview-mask',
          current: previewCurrent
        }"
    >
      <a-image
          v-for="item in fileList"
          :key="item.uid"
          :src="item.url || item.thumbUrl"
      />
    </a-image-preview-group>
  </div>

  <!-- 选择文件 modal -->
  <select-file-modal
      :visible="isSelectFileModalVisible"
      @confirm="onFileModalConfirm"
      @cancel="onFileModalCancel"
  />
</template>

<style lang="less" scoped>
@import "index.less";
</style>
