<!-- 菜单规则管理 -->
<script setup lang="ts">
import {DragOutlined, EditOutlined, PlusOutlined,} from "@ant-design/icons-vue";
import {computed, onMounted, ref, unref} from "vue";
import FormModal from "./components/FormModal/index.vue";
import type {IColumns, IPages} from "@/types";
import DeletePopconfirm from "@/components/IComponents/IOther/DeletePopconfirm/index.vue";
import {getMenuList} from "@/api/admin";
import type {IDataSource} from "./types";


//#region 变量
const columns = ref<IColumns[]>([
  {
    title: "标题",
    dataIndex: "title",
    minWidth: 150,
  },
  {
    title: "图标",
    dataIndex: "icon",
    align: "center",
    minWidth: 120,
  },
  {
    title: "排序",
    dataIndex: "sort",
    align: "center",
  },
  {
    title: "权限标识",
    dataIndex: "code",
    align: "center",
  },
  {
    title: "组件路径",
    dataIndex: "component",
  },
  {
    title: "类型",
    dataIndex: "type",
    align: "center",
  },
  {
    title: "缓存",
    dataIndex: "cache",
    align: "center",
  },
  {
    title: "状态",
    dataIndex: "status",
    align: "center",
  },
  {
    title: "修改时间",
    dataIndex: "updateTime",
    align: "center",
    minWidth: 100,
  },
  {
    title: "操作",
    dataIndex: "operation",
    align: "center",
    fixed: "right",
    minWidth: 100,
  },
]);
const dataSource = ref<IDataSource[]>([]);
const selectedRowKeys = ref<IDataSource["key"][]>([]);

const pages = ref<IPages>({
  size: 10,
  page: 1,
  total: 0,
});
const defaultExpandAllRows = ref<boolean>(false);
const isTableLoading = ref<boolean>(false); // 表格加载状态
const isFormModalVisible = ref<boolean>(false);
//#endregion

onMounted(async () => {
  await getList();
});

const getList = async () => {
  const params = {}
  isTableLoading.value = true;
  try {
    const {data} = await getMenuList(params);
    dataSource.value = data.records;
  } finally {
    isTableLoading.value = false;
  }
};

// 添加
const handleAddEdit = (type: number) => {
  isFormModalVisible.value = true;
};
// 添加/编辑 - cancel
const handleAddEditCancel = () => {
  isFormModalVisible.value = false;
};
// 添加/编辑 - confirm
const handleAddEditConfirm = async () => {
  handleAddEditCancel();
  await getList();
};

// 删除-确定

const handleDeletePopconfirmConfirm = (record: IDataSource) => {
  console.log("handleDeletePopconfirmConfirm", record);
};

// 规则类型
const typeEnum = (type: IDataSource["type"], key: string) => {
  const typeObj = {
    1: {
      color: "success",
      name: "菜单目录",
    },
    2: {
      color: "processing",
      name: "菜单项",
    },
    3: {
      color: "default",
      name: "页面按钮",
    },
  }
  if (typeObj[type]) {
    return typeObj[type][key];
  } else {
    return {
      color: "error",
      name: "暂无数据",
    };
  }
};

const onSelectChange = (keys: IDataSource["key"][]) => {
  selectedRowKeys.value = keys;
};

const rowSelection = computed(() => ({
  selectedRowKeys: unref(selectedRowKeys),
  onChange: onSelectChange,
}))

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
        :pagination="false"
        :row-selection="rowSelection"
        @reload="getList"
    >
      <template #leftActions>
        <i-tooltip title="添加" content="添加" @click="handleAddEdit(0)">
          <template #icon>
            <plus-outlined/>
          </template>
        </i-tooltip>
        <i-tooltip title="删除选中行" :disabled="!selectedRowKeys.length">
          <template #content>
            <delete-popconfirm
                :disabled="!selectedRowKeys.length"
                placement="rightTop"
                @confirm="handleDeletePopconfirmConfirm"
            />
          </template>
        </i-tooltip>
        <expand-all-rows-tooltip
            v-model:expand="defaultExpandAllRows"
            :disabled="!dataSource.length"
        />
      </template>
      <template #type="{ record }">
        <a-tag :color="typeEnum(record.type,'color')">
          {{ typeEnum(record.type, 'name') }}
        </a-tag>
      </template>
      <template #cache="{ record }">
        <a-switch
            v-model:checked="record.cache"
            :checkedValue="1"
            :unCheckedValue="0"
        />
      </template>
      <template #status="{ record }">
        <a-switch
            v-model:checked="record.status"
            :checkedValue="1"
            :unCheckedValue="0"
        />
      </template>
      <template #operation="{ record }">
        <a-space>
          <i-tooltip
              title="查看详情"
              size="small"
              type="move"
              btnClass="drop-row-btn"
          >
            <template #icon>
              <drag-outlined/>
            </template>
          </i-tooltip>
          <i-tooltip title="编辑" size="small" @click="handleAddEdit(1)">
            <template #icon>
              <edit-outlined/>
            </template>
          </i-tooltip>
          <i-tooltip title="删除">
            <template #content>
              <delete-popconfirm
                  type="table-row"
                  @confirm="handleDeletePopconfirmConfirm(record)"
              />
            </template>
          </i-tooltip>
        </a-space>
      </template>
    </i-table>

    <form-modal
        v-model:visible="isFormModalVisible"
        @cancel="handleAddEditCancel"
        @confirm="handleAddEditConfirm"
    />
  </div>
</template>

<style lang="less" scoped>
@import "./index.less";
</style>
