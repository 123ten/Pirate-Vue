<!-- 角色组管理 添加/编辑 -->
<script setup lang="ts">
import {inject} from "vue";
import {storeToRefs} from "pinia";
import {useRoleStore} from "@/store/auth/group";
import {tableSettingKey} from "@/utils/tableSettings";
import {AdminTableSettingsType} from "@/views/Auth/Admin/types";


const roleStore = useRoleStore()
const {dataSource: roleOptions} = storeToRefs(roleStore)
const {getRoleListRequest} = roleStore

const tableSettings = inject<AdminTableSettingsType>(tableSettingKey)

const init = async () => {
  await getRoleListRequest();
};
</script>

<template>
  <i-modal
      v-if="tableSettings"
      :visible="tableSettings.form.visible"
      :loading="tableSettings.form.loading"
      :title=" $t(tableSettings.form.fields.id ?'title.update': 'title.create')"
      :init="init"
      width="520px"
      @cancel="tableSettings?.cancelForm"
      @confirm="tableSettings?.confirmForm"
  >
    <a-form
        name="admin"
        autocomplete="off"
        :label-col="{ span: 4 }"
    >
      <a-form-item
          :label="$t('user.label.username')"
          v-bind="tableSettings.formRefs?.validateInfos.username"
      >
        <a-input
            v-model:value="tableSettings.form.fields.username"
            allow-clear
            :placeholder="$t('user.placeholder.admin_username')"
        />
      </a-form-item>
      <a-form-item
          :label="$t('user.label.nickname')"
          v-bind="tableSettings.formRefs?.validateInfos.nickname"
      >
        <a-input
            v-model:value="tableSettings.form.fields.nickname"
            allow-clear
            :placeholder="$t('user.placeholder.nickname')"
        />
      </a-form-item>
      <a-form-item
          :label="$t('user.label.roles')"
          v-bind="tableSettings.formRefs?.validateInfos.roleIds"
      >
        <i-tree-select
            v-model:value="tableSettings.form.fields.roleIds"
            :tree-data="roleOptions"
            :field-names="{ label: 'name', value: 'id' }"
            :placeholder="$t('user.placeholder.roles')"
            multiple
            spliceParentTitle
            tree-default-expand-all
        />
      </a-form-item>
      <a-form-item
          :label="$t('user.label.avatar')"
          name="fileList"
      >
        <i-upload
            v-model:file-list="tableSettings.form.fields.fileList"
            :length="1"
            accept="image/*"
        />
      </a-form-item>
      <a-form-item
          :label="$t('user.label.email')"
          name="email"
      >
        <a-input
            v-model:value="tableSettings.form.fields.email"
            allow-clear
            :placeholder="$t('user.placeholder.email')"
        />
      </a-form-item>
      <a-form-item
          :label="$t('user.label.phone')"
          name="phone"
      >
        <a-input
            v-model:value="tableSettings.form.fields.phone"
            allow-clear
            :placeholder="$t('user.placeholder.phone')"
        />
      </a-form-item>
      <a-form-item
          :label="$t('user.label.password')"
          v-bind="tableSettings.formRefs?.validateInfos.password"
      >
        <a-input-password
            v-model:value="tableSettings.form.fields.password"
            allow-clear
            :placeholder="
            $t(tableSettings.form.fields.id
              ? 'user.placeholder.edit_password'
              : 'user.placeholder.password')
            "
        />
      </a-form-item>
      <a-form-item
          :label="$t('user.label.status')"
          name="status"
      >
        <a-radio-group v-model:value="tableSettings.form.fields.status">
          <a-radio :value="0">{{ $t(`user.enum.status.0`) }}</a-radio>
          <a-radio :value="1">{{ $t(`user.enum.status.1`) }}</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </i-modal>
</template>

<style lang="less" scoped></style>
