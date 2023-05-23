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

const columns = ref<IColumns[]>([
  {
    title: "组别名称",
    dataIndex: "name",
    key: "name",
    align: "center",
    width: 200,
  },
  {
    title: "权限",
    dataIndex: "age",
    key: "age",
    align: "center",
    // resizable: true,
    // width: 100,
    // minWidth: 100,
    // maxWidth: 200,
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    align: "center",
    // width: 100,
  },
  {
    title: "修改时间",
    dataIndex: "updatetime",
    align: "center",
    width: 180,
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
    key: "createTime",
    align: "center",
    width: 180,
  },
  {
    title: "操作",
    dataIndex: "operate",
    key: "operate",
    align: "center",
    fixed: "right",
    width: 100,
  },
]);
const dataSource = ref<IDataSource[]>([
  {
    key: "1",
    name: "胡彦斌",
    age: 32,
    address: "西湖区湖底公园1号",
    children: [
      {
        key: "1-1",
        name: "胡彦祖1",
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
const menuChecked = ref<string[]>([]);
const menuCheckList = ref<IColumns[]>([]);
const selectedRowKeys = ref<IDataSource["key"][]>([]);
const pages = ref<IPages>({
  pageSize: 10,
  current: 1,
  total: 0,
});
const isDelAllVisible = ref<boolean>(false);
const isExpandAllRows = ref<boolean>(false);
const isTableLoading = ref<boolean>(false); // 表格加载状态

onMounted(() => {
  dataSource.value = dataSource.value.map((item) => {
    item.isDelVisible = false;
    return item;
  });
});

// 打开搜索框弹窗

// 删除-确定
const onDelAllConfirm = () => {
  isDelAllVisible.value = false;
};
// 删除-取消
const onDelAllcancel = () => {
  isDelAllVisible.value = false;
};
// 删除-显示隐藏的回调
const onDelVisibleChange = () => {
  // selectedRowKeys没有选中时 默认禁用 删除按钮
  if (!unref(selectedRowKeys).length) {
    isDelAllVisible.value = false;
  }
};
// 删除当前行-确定
const onDelCurrentConfirm = (record: IDataSource) => {
  console.log(record, "record");
  record.isDelVisible = false;
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
      <!-- <template #formSearch>
        <a-form :model="formSeach" layout="inline" name="basic">
          <a-space direction="vertical">
            <a-row style="width: 100%">
              <a-col :span="6">
                <a-form-item
                  label="UsernameUsernameUsername"
                  name="username"
                  :rules="[
                    {
                      required: true,
                      message: 'Please input your username!',
                    },
                  ]"
                >
                  <a-input v-model:value="formSeach.username" />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item
                  label="Username"
                  name="username"
                  :rules="[
                    {
                      required: true,
                      message: 'Please input your username!',
                    },
                  ]"
                >
                  <a-input v-model:value="formSeach.username" />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item
                  label="Username"
                  name="username"
                  :rules="[
                    {
                      required: true,
                      message: 'Please input your username!',
                    },
                  ]"
                >
                  <a-input v-model:value="formSeach.username" />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item
                  label="Username"
                  name="username"
                  :rules="[
                    {
                      required: true,
                      message: 'Please input your username!',
                    },
                  ]"
                >
                  <a-input v-model:value="formSeach.username" />
                </a-form-item>
              </a-col>
            </a-row>
          </a-space>
        </a-form>
      </template> -->
      <template #leftBtn>
        <ITooltip title="添加" content="添加">
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
              @cancel="onDelAllcancel"
              @visibleChange="onDelVisibleChange"
              v-model:visible="isDelAllVisible"
            >
              <template #okButton>
                <a-button type="danger" size="small" @click="onDelAllConfirm">
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
          :title="isExpandAllRows ? '收起所有子菜单' : '展开所有子菜单'"
          :content="isExpandAllRows ? '收起所有' : '展开所有'"
          :type="isExpandAllRows ? 'danger' : 'warning'"
          @click="isExpandAllRows = !isExpandAllRows"
        >
        </ITooltip>
      </template>
      <template #bodyCell="{ column, record }">
        <!-- {{ column }} -->
        <template v-if="column.key === 'status'">
          <a-tag :color="record.status === 1 ? 'success' : 'error'">
            {{ record.status === 1 ? "启用" : "禁用" }}
          </a-tag>
        </template>
        <template v-if="column.key === 'operate'">
          <a-space>
            <ITooltip title="查看详情" size="small">
              <template #icon>
                <ZoomInOutlined />
              </template>
            </ITooltip>
            <ITooltip title="编辑" size="small">
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
                  v-model:visible="record.isDelVisible"
                >
                  <template #okButton>
                    <a-button
                      type="danger"
                      size="small"
                      @click="onDelCurrentConfirm(record)"
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
  </div>
</template>

<style lang="less" scoped>
@import "./index.less";
</style>
