import {FormInstance} from "ant-design-vue";
import {FormExpose} from "ant-design-vue/lib/form/Form";
import {Ref} from "vue";

export default function useFormInstance(ref: Ref<FormInstance | undefined>) {
  return {
    clearValidate(...args) {
      ref.value?.clearValidate(...args)
    },
    getFieldsValue(...args) {
      ref.value?.getFieldsValue(...args)
    },
    resetFields(...args) {
      ref.value?.resetFields(...args)
    },
    scrollToField(...args) {
      ref.value?.scrollToField(...args)
    },
    validate(...args) {
      ref.value?.validate(...args)
    },
    validateFields(...args) {
      ref.value?.validateFields(...args)
    },
  } as FormExpose
}
