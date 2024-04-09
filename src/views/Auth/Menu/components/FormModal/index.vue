<!-- 菜单权限 - 添加编辑 -->
<script setup lang="ts">
import {computed, reactive,} from "vue";
import type {IFormModalProps} from "../../types";
import {adminMenuUpsert} from "@/api/admin";
import {Form, message} from "ant-design-vue";
import {Rules} from "@/types/form";
import {useI18n} from "vue-i18n";
import {useAdminMenuStore} from "@/store/auth/menu";
import {storeToRefs} from "pinia";

const store = useAdminMenuStore()
const {dataSource, formState, isModalLoading} = storeToRefs(store);

const {t} = useI18n();
const props = defineProps<IFormModalProps<any>>();

const emits = defineEmits(["cancel", "confirm"]);

const rules = reactive<Rules>({
  username: [{required: true, message: t('user.error.username')}],
  title: [{required: true, message: t('user.error.title')}],
  roleIds: [{required: true, message: t('user.error.roles')}],
  password: undefined,
})

// const formState = reactive<IFormState>({
//   parentId: undefined,
//   title: '',
//   name: '',
//   path: '',
//   component: '',
//   frame: 1,
//   type: 1,
//   status: 1,
//   sort: 0,
//   cache: 0,
// });

const {resetFields, validate, validateInfos} = Form.useForm(formState, rules);

const handleCancel = () => {
  emits('cancel')
  resetFields()
};

const handleConfirm = async () => {
  await validate()
  const {data} = await store.adminMenuUpsertRequest();
  emits('confirm');
  resetFields()
  message.success(data);
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
      :title="props.options?.id ? '编辑' : '添加'"
      :loading="isModalLoading"
      :maskClosable="false"
      width="600px"
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
            placeholder="请选择上级菜单"
            show-search
            allow-clear
            tree-node-filter-prop="title"
            :tree-data="dataSource"
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
      <a-form-item label="规则标题" name="title" v-bind="validateInfos.title">
        <a-input v-model:value="formState.title"/>
      </a-form-item>
      <a-form-item label="规则名称" name="name" v-bind="validateInfos.name">
        <a-input v-model:value="formState.name"/>
      </a-form-item>
      <template v-if="formState.type !== 3">
        <a-form-item label="路由路径" name="path" v-bind="validateInfos.path">
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
        <a-form-item label="组件路径" name="component">
          <a-input v-model:value="formState.component"/>
        </a-form-item>
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
