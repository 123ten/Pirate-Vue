<!-- 菜单规则管理 -->
<!-- 角色组管理 -->
<script setup lang="ts">
import {
  SyncOutlined,
  PlusOutlined,
  DeleteOutlined,
  TableOutlined,
  SearchOutlined,
  EditOutlined,
  EditFilled,
  ZoomInOutlined,
} from "@ant-design/icons-vue";
import { computed, onMounted, reactive, ref, unref } from "vue";
import AddEditModal from "@components/Modals/TheMenu/AddEditModal.vue";
import type { IColumns, IPages } from "@/types/index";

interface IDataSource {
  key: string;
  menuname?: string;
  name?: string;
  age: number;
  address: string;
  status?: string | number; // 状态 0 禁用 1 启用
  updatetime?: string; // 修改时间
  createTime?: string; // 创建时间
  isDeleteVisible?: boolean; // 是否显示删除气泡
  children?: IDataSource[]; // 设置 children 务必设置 width 否则可能出现宽度浮动
}
interface ISortTableEnd {
  newIndex: number;
  oldIndex: number;
}

const columns = ref<IColumns[]>([
  {
    title: "标题",
    dataIndex: "title",
    align: "center",
    minWidth: 200,
  },
  {
    title: "图标",
    dataIndex: "icon",
    align: "center",
    minWidth: 100,
  },
  {
    title: "名称",
    dataIndex: "menuname",
    align: "center",
    minWidth: 100,
  },
  {
    title: "类型",
    dataIndex: "menutype",
    align: "center",
    minWidth: 100,
  },
  {
    title: "缓存",
    dataIndex: "cache",
    align: "center",
    minWidth: 100,
  },
  {
    title: "状态",
    dataIndex: "status",
    align: "center",
    minWidth: 100,
  },
  {
    title: "修改时间",
    dataIndex: "updatetime",
    align: "center",
    minWidth: 180,
  },
]);
const dataSource = ref<IDataSource[]>([
  {
    key: "1",
    menuname: "胡彦斌",
    age: 32,
    address: "西湖区湖底公园1号",
    children: [
      {
        key: "1-1",
        menuname: "胡彦祖1",
        age: 22,
        address: "西湖区湖底公园1号",
        children: [
          {
            key: "1-1-1",
            name: "胡彦祖1",
            age: 22,
            address: "西湖区湖底公园1号",
            children: [
              {
                key: "12",
                name: "胡彦祖1",
                age: 22,
                address: "西湖区湖底公园1号",
                children: [
                  {
                    key: "1-1-2",
                    name: "胡彦祖1",
                    age: 22,
                    address: "西湖区湖底公园1号",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]);
const selectedRowKeys = ref<IDataSource["key"][]>([]);
const pages = ref<IPages>({
  pageSize: 10,
  current: 1,
  total: 0,
});
const isEdit = ref<boolean>(false); // 是否编辑
const isDeleteAllVisible = ref<boolean>(false);
const isExpandAllRows = ref<boolean>(false);
const isTableLoading = ref<boolean>(false); // 表格加载状态
const isAddEditModal = ref<boolean>(false);

onMounted(() => {
  dataSource.value = dataSource.value.map((item) => {
    item.isDeleteVisible = false;
    return item;
  });
});

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
// 删除-显示隐藏的回调
const onDeleteVisibleChange = () => {
  // selectedRowKeys没有选中时 默认禁用 删除按钮
  if (!unref(selectedRowKeys).length) {
    isDeleteAllVisible.value = false;
  }
};
// 删除当前行-确定
const onDeleteCurrentConfirm = (record: IDataSource) => {
  console.log(record, "record");
  record.isDeleteVisible = false;
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
    <ITable
      :columns="columns"
      :dataSource="dataSource"
      :pages="pages"
      isSelectedRowKeys
      :isExpandAllRows="isExpandAllRows"
      :loading="isTableLoading"
      @onColumnChange="onColumnChange"
      @onPagesChange="onPagesChange"
      @onSelectChange="onSelectChange"
    >
      <template #leftBtn>
        <ITooltip title="添加" content="添加" @click="handleAddEdit(0)">
          <template #icon>
            <PlusOutlined />
          </template>
        </ITooltip>
        <ITooltip
          title="编辑选中行"
          content="编辑"
          :disabled="!selectedRowKeys.length"
        >
          <template #icon>
            <EditFilled />
          </template>
        </ITooltip>
        <ITooltip title="删除选中行">
          <template #content>
            <a-popconfirm
              title="确定删除选中记录？"
              ok-text="删除"
              cancel-text="取消"
              @cancel="onDeleteAllcancel"
              @visibleChange="onDeleteVisibleChange"
              v-model:visible="isDeleteAllVisible"
            >
              <template #okButton>
                <a-button
                  type="danger"
                  size="small"
                  @click="onDeleteAllConfirm"
                >
                  删除
                </a-button>
              </template>
              <a-button type="danger" :disabled="!selectedRowKeys.length">
                <template #icon>
                  <DeleteOutlined />
                </template>
                删除
              </a-button>
            </a-popconfirm>
          </template>
        </ITooltip>
        <ITooltip
          :title="isExpandAllRows ? '收缩所有子菜单' : '展开所有子菜单'"
          :content="isExpandAllRows ? '收缩所有' : '展开所有'"
          :type="isExpandAllRows ? 'danger' : 'warning'"
          @click="isExpandAllRows = !isExpandAllRows"
        >
        </ITooltip>
      </template>
    </ITable>

    <AddEditModal
      v-model:visible="isAddEditModal"
      :title="isEdit ? '编辑' : '添加'"
      @cancel="onAddEditCancel"
      @confirm="onAddEditConfirm"
    />
  </div>
</template>

<style lang="less" scoped>
@import "./index.less";
</style>
