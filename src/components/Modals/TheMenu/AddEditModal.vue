<!-- 角色组管理 添加/编辑 -->
<script setup lang="ts">
import {computed, reactive, ref, withDefaults,} from "vue";
import type {TreeSelectProps} from "ant-design-vue";
import {TreeSelect} from "ant-design-vue";

const SHOW_PARENT = TreeSelect.SHOW_PARENT;

interface IPropsModal {
  title: string; // modal 标题
  visible: boolean; // 控制 modal 开关
}

interface IFormState {
  pid: number | string; // 上级分组
  name: string; // 组别名称
  rules: string; // 权限
  status: number; // 状态
}

const props = withDefaults(defineProps<IPropsModal>(), {
  title: "",
  visible: false,
});
const emits = defineEmits([
  "confirm", // 点击确定回调
  "cancel", // 点击遮罩层或右上角叉或取消按钮的回调
  "update:visible",
]);
// 控制 modal 的双向绑定 防止控制台报错
const visible = computed({
  get() {
    return props.visible;
  },
  set(value) {
    emits("update:visible", value);
  },
});

// 校验规则
const rules = {
  name: [{required: true, message: "请输入组别名称"}],
  rules: [{required: true, message: "请选择权限"}],
};
const treeData = ref<TreeSelectProps["treeData"]>([
  {
    title: "Node1",
    value: "0-0",
    children: [
      {
        title: "Child Node1",
        value: "0-0-0",
      },
    ],
  },
  {
    title: "Node2",
    value: "0-1",

    children: [
      {
        title: "Child Node3",
        value: "0-1-0",
        disabled: true,
      },
      {
        title: "Child Node4",
        value: "0-1-1",
      },
      {
        title: "Child Node5",
        value: "0-1-2",
      },
    ],
  },
]);

const formState = reactive<IFormState>({
  pid: "",
  name: "",
  rules: "",
  status: 0,
});
</script>

<template>
  <i-modal
      :visible="props.visible"
      :title="props.title"
      :maskClosable="false"
      @confirm="emits('confirm')"
      @cancel="emits('cancel')"
  >
    <a-form
        :model="formState"
        name="group"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
        autocomplete="off"
    >
      <a-form-item label="上级分组" name="pid">
        <a-select
            v-model:value="formState.pid"
            allow-clear
            placeholder="请选择上级分组"
        >
          <a-select-option :value="0">Zone one</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="组别名称" name="name" :rules="rules.name">
        <a-input
            v-model:value="formState.name"
            allow-clear
            placeholder="请输入组别名称"
        />
      </a-form-item>

      <a-form-item label="权限" name="rules" :rules="rules.rules">
        <a-tree-select
            v-model:value="formState.rules"
            style="width: 100%"
            :tree-data="treeData"
            tree-checkable
            :show-checked-strategy="SHOW_PARENT"
            allow-clear
            placeholder="请选择权限"
        />
      </a-form-item>

      <a-form-item label="状态" name="status">
        <a-radio-group v-model:value="formState.status">
          <a-radio :value="0"> 禁用</a-radio>
          <a-radio :value="1">启用</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </i-modal>
</template>

<style lang="less" scoped></style>
