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
import AddEditModal from "./components/AddEditModal/index.vue";
import Sortable from "sortablejs";
import type { IColumns, IPages } from "@/types/index";
import type { IDataSource, ISortTableEnd } from "./index";

const columns = ref<IColumns[]>([
  {
    title: "ID",
    dataIndex: "key",
    align: "center",
    width: "150px",
  },
  {
    title: "用户名",
    dataIndex: "username",
    align: "center",
  },
  {
    title: "昵称",
    dataIndex: "nickname",
    align: "center",
  },
  {
    title: "分组",
    dataIndex: "group",
    align: "center",
  },
  {
    title: "头像",
    dataIndex: "avatar",
    align: "center",
  },
  {
    title: "性别",
    dataIndex: "gender",
    align: "center",
  },
  {
    title: "手机号",
    dataIndex: "phone",
    align: "center",
  },
  {
    title: "最后登录IP",
    dataIndex: "updateip",
    align: "center",
  },
  {
    title: "状态",
    dataIndex: "status",
    align: "center",
  },
  {
    title: "最后登录",
    dataIndex: "updatetime",
    align: "center",
    width: 180,
  },
  {
    title: "创建时间",
    dataIndex: "createtime",
    align: "center",
    width: 180,
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
  pageSize: 10,
  current: 1,
  total: 0,
});
const isEdit = ref<boolean>(false); // 是否编辑
const isDeleteAllVisible = ref<boolean>(false);
const isTableLoading = ref<boolean>(false); // 表格加载状态
const isAddEditModal = ref<boolean>(false);

onMounted(() => {
  dataSource.value = dataSource.value.map((item) => {
    item.isDeleteVisible = false;
    return item;
  });
  rowDrop();
});
// 行拖拽
const rowDrop = () => {
  const tbody = document.querySelector(".ant-table-content tbody");
  const _this = this;
  let nowDrageRow = 0; // 当前拖拽的索引
  Sortable.create(tbody, {
    onEnd({ newIndex, oldIndex }: ISortTableEnd) {
      // const currRow = _this.fofList.splice(oldIndex, 1)[0];
      // _this.list.splice(newIndex, 0, currRow);
      // _this.list.forEach((item, index) => {
      //   item.orderNum = index + 1;
      // });
    },
    // 开始拖拽的时候
    onStart: function (evt: any) {
      console.log("evt", evt, evt.oldIndex);

      nowDrageRow = evt.oldIndex;
    },
    // 拖拽移动的时候
    onMove: function (evt: any, originalEvent: any) {
      console.log("onMove", evt);
      if (nowDrageRow === unref(dataSource).length - 1) {
        return false; // 禁止拖拽某一行
      }
    },
  });
};

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
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'gender'">
          <a-tag color="success" class="table-tag">
            {{ record.gender === 1 ? "男" : "女" }}
          </a-tag>
        </template>
        <template v-if="column.dataIndex === 'updateip'">
          <a-tag color="success" class="table-tag">
            {{ record.updateip }}
          </a-tag>
        </template>
        <template v-if="column.dataIndex === 'status'">
          <a-tag
            :color="record.status === 1 ? 'success' : 'error'"
            class="table-tag"
          >
            {{ record.status === 1 ? "启用" : "禁用" }}
          </a-tag>
        </template>
        <template v-if="column.dataIndex === 'menuname'">
          <span v-if="record.menuname">{{ record.menuname }}</span>
          <a-input v-else placeholder="请输入名称"></a-input>
        </template>
        <template v-if="column.dataIndex === 'operate'">
          <a-space>
            <ITooltip title="编辑" size="small" @click="handleAddEdit(1)">
              <template #icon>
                <EditOutlined />
              </template>
            </ITooltip>
            <ITooltip title="删除">
              <template #content>
                <a-popconfirm
                  title="确定删除选中记录？"
                  ok-text="删除"
                  cancel-text="取消"
                  placement="left"
                  v-model:visible="record.isDeleteVisible"
                >
                  <template #okButton>
                    <a-button
                      type="danger"
                      size="small"
                      @click="onDeleteCurrentConfirm(record)"
                    >
                      删除
                    </a-button>
                  </template>
                  <a-button type="danger" size="small">
                    <template #icon>
                      <DeleteOutlined />
                    </template>
                  </a-button>
                </a-popconfirm>
              </template>
            </ITooltip>
          </a-space>
        </template>
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
