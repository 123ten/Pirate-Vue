<!-- 角色组管理 -->
<script setup lang="ts">
import {EditOutlined, PlusOutlined} from "@ant-design/icons-vue";
import {onMounted, ref} from "vue";
import AddEditModal from "./components/AddEditModal/index.vue";
import {IColumns, IPages} from "@/types";
import {getRoleList} from "@/api/admin";

interface IDataSource {
  key: string;
  name: string;
  age: number;
  address: string;
  status?: string | number; // 状态 0 禁用 1 启用
  updateTime?: string; // 修改时间
  createTime?: string; // 创建时间
  children?: IDataSource[]; // 设置 children 务必设置 width 否则可能出现宽度浮动
}

const columns = ref<IColumns[]>([
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
    dataIndex: "operate",
    align: "center",
    fixed: "right",
    width: 100,
  },
]);
const dataSource = ref<IDataSource[]>([]);

const selectedRowKeys = ref<IDataSource["key"][]>([]);
const pages = ref<IPages>({
  size: 10,
  page: 1,
  total: 0,
});
const isEdit = ref<boolean>(false); // 是否编辑
const isDeleteAllVisible = ref<boolean>(false);
const defaultExpandAllRows = ref<boolean>(false);
const isTableLoading = ref<boolean>(false); // 表格加载状态
const isAddEditModal = ref<boolean>(false);

onMounted(async () => {
  await getList()
});

const getList = async () => {
  const params = {}
  isTableLoading.value = true;
  try {
    const {data} = await getRoleList(params)
    dataSource.value = data
    defaultExpandAllRows.value = true
  } finally {
    isTableLoading.value = false;
  }
}

// 添加
const handleAddEdit = (type: number) => {
  isEdit.value = type === 1;
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
const onDeleteCurrentConfirm = (record: IDataSource) => {
};

// 分页
const onPagesChange = (records: IPages) => {
  // console.log(records, "records");
  pages.value = records;
};

// 显示与隐藏表头
const onColumnChange = (newColumns: IColumns[]) => {
  columns.value = newColumns;
};
// 多选
const onSelectChange = (rowKeys: string[]) => {
  selectedRowKeys.value = rowKeys;
  console.log(rowKeys, "rowKeys");
};
</script>

<template>
  <div class="default-main">
    <i-table
        row-key="id"
        :columns="columns"
        :dataSource="dataSource"
        :pages="pages"
        :default-expand-all-rows="defaultExpandAllRows"
        :loading="isTableLoading"
        @onColumnChange="onColumnChange"
        @onPagesChange="onPagesChange"
        @onSelectChange="onSelectChange"
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
      <template #status="{ record }">
        <a-tag :color="record.status === 1 ? 'success' : 'error'">
          {{ record.status === 1 ? "启用" : "禁用" }}
        </a-tag>
      </template>
      <template #operate="{ record }">
        <a-space>
          <i-tooltip title="编辑" size="small" @click="handleAddEdit(1)">
            <template #icon>
              <edit-outlined/>
            </template>
          </i-tooltip>
          <i-tooltip title="删除">
            <template #content>
              <delete-popconfirm
                  type="table"
                  placement="left"
                  @confirm="onDeleteCurrentConfirm(record)"
              />
            </template>
          </i-tooltip>
        </a-space>
      </template>
    </i-table>

    <add-edit-modal
        :visible="isAddEditModal"
        :title="isEdit ? '编辑' : '添加'"
        @cancel="onAddEditCancel"
        @confirm="onAddEditConfirm"
    />
  </div>
</template>

<style lang="less" scoped>
@import "./index.less";
</style>
