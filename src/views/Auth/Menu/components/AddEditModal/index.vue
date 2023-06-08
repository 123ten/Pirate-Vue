<!-- 菜单权限 - 添加编辑 -->
<script setup lang="ts">
import {
  computed,
  onMounted,
  reactive,
  ref,
  toRefs,
  toRef,
  unref,
  withDefaults,
  watch,
  toRaw,
} from "vue";
import IIcon from "@/components/IIcon/index.vue";
interface IProps {
  title: string; // 添加编辑
  visible: boolean; // 显示与隐藏
}
const props = withDefaults(defineProps<IProps>(), {
  title: "",
  visible: false,
});
const emits = defineEmits(["update:visible", "onClick"]);

const formState = reactive({});

const onVisibleChange = (flag: boolean) => {
  emits("update:visible", flag);
};
// 确定
const onClick = () => {
  const _data = toRaw(formState);
  emits("onClick", _data);
};
</script>

<template>
  <a-modal
    v-model:visible="props.visible"
    :title="props.title"
    @ok="onClick"
    width="1000px"
    :maskClosable="false"
  >
    <a-form
      :model="formState"
      name="basic"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 18 }"
      autocomplete="off"
    >
      <a-form-item label="上级菜单规则" name="username">
        <a-select
          v-model:value="formState.region"
          placeholder="please select your zone"
        >
          <a-select-option value="shanghai">Zone one</a-select-option>
          <a-select-option value="beijing">Zone two</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="规则类型" name="password">
        <a-radio-group v-model:value="formState.type">
          <a-radio :value="1">菜单目录</a-radio>
          <a-radio :value="2">菜单项</a-radio>
          <a-radio :value="3">页面按钮</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="规则标题" name="username">
        <a-input v-model:value="formState.username" />
      </a-form-item>
      <a-form-item label="规则名称" name="username">
        <a-input v-model:value="formState.username" />
      </a-form-item>
      <a-form-item label="路由路径" name="username">
        <a-input v-model:value="formState.username" />
      </a-form-item>
      <a-form-item label="规则图标" name="username">
        <IIcon />
      </a-form-item>
      <a-form-item label="链接地址" name="username">
        <a-input v-model:value="formState.username" />
      </a-form-item>
      <a-form-item label="规则备注" name="username">
        <a-textarea v-model:value="formState.username" />
      </a-form-item>
      <a-form-item label="规则权重" name="username">
        <a-input-number
          v-model:value="formState.value"
          :min="0"
          style="width: 100%"
        />
      </a-form-item>
      <a-form-item label="缓存" name="username">
        <a-radio-group v-model:value="formState.type">
          <a-radio :value="0">禁用</a-radio>
          <a-radio :value="1">启用</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="状态" name="username">
        <a-radio-group v-model:value="formState.type">
          <a-radio :value="0">禁用</a-radio>
          <a-radio :value="1">启用</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<style lang="less" scoped>
@import "./index.less";
</style>
