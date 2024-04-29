<!-- 菜单权限 - 添加编辑 -->
<script setup lang="ts">
import {ref,} from "vue";
import {Form, FormInstance} from "ant-design-vue";
import {useAdminMenuStore} from "@/store/auth/menu";
import {storeToRefs} from "pinia";
import {Rules} from "@/types/form";
import {useI18n} from "vue-i18n";

const {t} = useI18n()
const store = useAdminMenuStore()
const {formState} = storeToRefs(store)

const emits = defineEmits(["cancel", "confirm"]);

const rules: Rules = {}
const formRef = ref<FormInstance>()

const {validateInfos} = Form.useForm(formState, rules);

</script>

<template>
  <i-modal
  >
    <a-form
      ref="formRef"
      :model="formState"
      name="basic"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 18 }"
      autocomplete="off"
    >
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

