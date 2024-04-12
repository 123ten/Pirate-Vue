<!-- 角色组管理 -->
<script setup lang="ts">
import {EditOutlined, PlusOutlined} from "@ant-design/icons-vue";
import {onMounted, ref} from "vue";
import AddEditModal from "./components/AddEditModal/index.vue";
import {IColumns} from "@/types";
import ITooltip from "@/components/IComponents/ITooltip/index.vue";
import StatusTag from "@/components/IComponents/IOther/StatusTag/index.vue";
import {storeToRefs} from "pinia";
import {useRoleStore} from "@/store/auth/group";
import {RoleDataSource} from "@/store/auth/group/types";

const store = useRoleStore()
const {dataSource, isTableLoading} = storeToRefs(store);
const {getRoleListRequest} = store

const columns: IColumns[] = [
  {
    title: "组别名称",
    dataIndex: "name",
    align: "center",
    width: 200,
  },
  {
    title: "权限",
    dataIndex: "rules",
    align: "center",
  },
  {
    title: "状态",
    dataIndex: "status",
    align: "center",
    width: 100,
  },
  {
    title: "修改时间",
    dataIndex: "updateTime",
    align: "center",
    width: 160,
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
    align: "center",
    width: 160,
  },
  {
    title: "操作",
    dataIndex: "operation",
    align: "center",
    fixed: "right",
    width: 100,
  },
]

const selectedRowKeys = ref<RoleDataSource["key"][]>([]);
const isDeleteAllVisible = ref<boolean>(false);
const defaultExpandAllRows = ref<boolean>(false);
const isAddEditModal = ref<boolean>(false);

onMounted(async () => {
  await getList()
});

const getList = async () => {
  await getRoleListRequest()
  defaultExpandAllRows.value = true
}

// 添加
const handleAddEdit = (type: number) => {
  isAddEditModal.value = true;
};
// 添加/编辑 - cancel
const onAddEditCancel = () => {
  isAddEditModal.value = false;
};
// 添加/编辑 - confirm
const onAddEditConfirm = () => {
  onAddEditCancel();
};

// 删除-确定
const onDeleteAllConfirm = () => {
  isDeleteAllVisible.value = false;
};
// 删除-取消
const onDeleteAllcancel = () => {
  isDeleteAllVisible.value = false;
};
// 删除当前行-确定
const onDeleteCurrentConfirm = (record: RoleDataSource) => {
};

// 多选
const onSelectChange = (rowKeys: string[]) => {
  selectedRowKeys.value = rowKeys;
  console.log(rowKeys, "rowKeys");
};
</script>

<template>
  <div class="box-border p-4">
    <i-table
        row-key="id"
        :columns="columns"
        :dataSource="dataSource"
        :default-expand-all-rows="defaultExpandAllRows"
        :loading="isTableLoading"
        @selectChange="onSelectChange"
    >
      <template #leftActions>
        <i-tooltip title="添加" content="添加" @click="handleAddEdit(0)">
          <template #icon>
            <plus-outlined/>
          </template>
        </i-tooltip>
        <i-tooltip title="删除选中行">
          <template #content>
            <delete-popconfirm
                :disabled="!selectedRowKeys.length"
                @confirm="onDeleteAllConfirm"
                @cancel="onDeleteAllcancel"
            />
          </template>
        </i-tooltip>
        <expand-all-rows-tooltip v-model:expand="defaultExpandAllRows"/>
      </template>
      <template #status="{ value }">
        <status-tag :value="value"/>
      </template>
      <template #operation="{ record }">
        <a-space>
          <i-tooltip title="编辑" size="small" @click="handleAddEdit(1)">
            <template #icon>
              <edit-outlined/>
            </template>
          </i-tooltip>
          <i-tooltip title="删除">
            <template #content>
              <delete-popconfirm
                  type="table-row"
                  @confirm="onDeleteCurrentConfirm(record)"
              />
            </template>
          </i-tooltip>
        </a-space>
      </template>
    </i-table>

    <add-edit-modal
        :visible="isAddEditModal"
        @cancel="onAddEditCancel"
        @confirm="onAddEditConfirm"
    />
  </div>
</template>

