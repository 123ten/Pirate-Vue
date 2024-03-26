<!-- 菜单权限 - 添加编辑 -->
<script setup lang="ts">
import {computed, reactive, ref,} from "vue";
import type {IDataSource, IFormModalProps, IFormState} from "../../types";
import {getMenuList, upsertMenu} from "@/api/admin";
import {message} from "ant-design-vue";


const props = defineProps<IFormModalProps>();

const emits = defineEmits(["cancel", "confirm"]);

const formState = reactive<IFormState>({
  title: '',
  name: '',
  component: '',
  frame: 1,
  type: 1,
  status: 1,
  sort: 0,
  cache: 0,
});
const menuOptions = ref<IDataSource[]>([]);
const loading = ref<boolean>(false);

const onInit = async () => {
  console.log('onInit');
  await getMenuOptions()
};

const getMenuOptions = async () => {
  loading.value = true;
  try {
    const {data} = await getMenuList({});
    menuOptions.value = data.records;
  } finally {
    loading.value = false;
  }
};

const handleCancel = () => {
  emits('cancel')
};

const handleConfirm = async () => {
  console.log('handleConfirm', formState);
  loading.value = true;
  try {
    const {data} = await upsertMenu(formState);
    message.success(data);
    emits('confirm');
  } finally {
    loading.value = false;
  }
};

const clearCache = () => {

};

const replaceFields = computed(() => {
  return {
    label: 'title',
    key: 'id',
    value: 'id'
  }
})
</script>

<template>
  <i-modal
      v-model:visible="props.visible"
      :maskClosable="false"
      width="55%"
      :init="onInit"
      @cancel="handleCancel"
      @confirm="handleConfirm"
  >
    <a-form
        :model="formState"
        name="basic"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 18 }"
        autocomplete="off"
    >
      <a-form-item label="上级菜单" name="parentId">
        <a-tree-select
            v-model:value="formState.parentId"
            placeholder="please select your zone"
            show-search
            allow-clear
            tree-node-filter-prop="title"
            :tree-data="menuOptions"
            :replace-fields="replaceFields"
        />
      </a-form-item>
      <a-form-item label="规则类型" name="type">
        <a-radio-group v-model:value="formState.type" button-style="solid">
          <a-radio-button :value="1">菜单目录</a-radio-button>
          <a-radio-button :value="2">菜单项</a-radio-button>
          <a-radio-button :value="3">页面按钮</a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="规则标题" name="title">
        <a-input v-model:value="formState.title"/>
      </a-form-item>
      <a-form-item label="规则名称" name="name">
        <a-input v-model:value="formState.name"/>
      </a-form-item>
      <template v-if="formState.type !== 3">
        <a-form-item label="路由路径" name="path">
          <a-input v-model:value="formState.path"/>
        </a-form-item>
        <a-form-item label="规则图标" name="icon">
          <i-icon v-model:value="formState.icon"/>
        </a-form-item>
      </template>
      <template v-if="formState.type === 2">
        <a-form-item label="菜单类型" name="frame">
          <a-radio-group v-model:value="formState.frame">
            <a-radio :value="1">选项卡</a-radio>
            <a-radio :value="2">链接(站外)</a-radio>
            <a-radio :value="3">iframe</a-radio>
          </a-radio-group>
        </a-form-item>
        <template v-if="formState.type === 1">
          <a-form-item label="组件路径" name="component">
            <a-input v-model:value="formState.component"/>
          </a-form-item>
        </template>
      </template>
      <a-form-item label="规则备注" name="description">
        <a-textarea v-model:value="formState.description"/>
      </a-form-item>
      <a-form-item label="排序" name="sort">
        <a-input-number
            v-model:value="formState.sort"
            :min="0"
            style="width: 100%"
        />
      </a-form-item>
      <a-form-item label="缓存" name="cache">
        <a-radio-group v-model:value="formState.cache">
          <a-radio :value="0">禁用</a-radio>
          <a-radio :value="1">启用</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="状态" name="status">
        <a-radio-group v-model:value="formState.status">
          <a-radio :value="0">禁用</a-radio>
          <a-radio :value="1">启用</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </i-modal>
</template>

<style lang="less" scoped>
@import "./index.less";
</style>
