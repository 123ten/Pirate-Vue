<!-- 菜单规则管理 -->
<!-- 角色组管理 -->
<script setup lang="ts">
import {DeleteOutlined, EditOutlined, PlusOutlined, UserOutlined} from "@ant-design/icons-vue";
import AddEditModal from "./components/AddEditModal/index.vue";
import {onMounted, ref, unref} from "vue";
import {IColumns, IPages} from "@/types";
import {IDataSource} from "./types";
import {getUserList} from "@/api/user";

const columns = ref<IColumns[]>([
  {
    title: "序号",
    dataIndex: "index",
    align: "center",
    minWidth: 80,
  },
  {
    title: "用户名",
    dataIndex: "username",
    align: "center",
    minWidth: 100,
  },
  {
    title: "昵称",
    dataIndex: "nickname",
    align: "center",
    minWidth: 100,
  },
  {
    title: "分组",
    dataIndex: "group",
    align: "center",
    minWidth: 100,
  },
  {
    title: "头像",
    dataIndex: "avatar",
    align: "center",
    minWidth: 100,
  },
  {
    title: "性别",
    dataIndex: "gender",
    align: "center",
    minWidth: 100,
  },
  {
    title: "手机号",
    dataIndex: "phone",
    align: "center",
    minWidth: 100,
  },
  {
    title: "最后登录IP",
    dataIndex: "updateip",
    align: "center",
    minWidth: 140,
  },
  {
    title: "状态",
    dataIndex: "status",
    align: "center",
    minWidth: 100,
  },
  {
    title: "最后登录",
    dataIndex: "updatetime",
    align: "center",
    minWidth: 180,
  },
  {
    title: "创建时间",
    dataIndex: "createtime",
    align: "center",
    minWidth: 180,
  },
  {
    title: "状态",
    dataIndex: "status",
    align: "center",
    minWidth: 100,
  },
  {
    title: "操作",
    dataIndex: "operate",
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
const isEdit = ref<boolean>(false); // 是否编辑
const isDeleteAllVisible = ref<boolean>(false);
const isTableLoading = ref<boolean>(false); // 表格加载状态
const isAddEditModal = ref<boolean>(false);

onMounted(async () => {
  await getList();
  // dataSource.value = dataSource.value.map((item) => {
  //   item.isDeleteVisible = false;
  //   return item;
  // });
});

const getList = async () => {
  const params = {
    page: pages.value.page,
    size: pages.value.size,
  };
  isTableLoading.value = true;
  console.log(11111111)
  try {
    const {data} = await getUserList(params);
    console.log(data, "data");
    dataSource.value = data.records;
    pages.value = {
      size: data.size,
      page: data.page,
      total: data.total,
    };
  } finally {
    isTableLoading.value = false;
  }
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
const onDeleteAllCancel = () => {
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

const genderRender = (record) => {
  const genderObj = {
    0: "保密",
    1: "男",
    2: "女",
  };
  return genderObj[record.gender];
};
</script>

<template>
  <div class="default-main">
    <i-table
        :columns="columns"
        :dataSource="dataSource"
        :pages="pages"
        isSelectedRowKeys
        :loading="isTableLoading"
        @reload="getList"
        @onColumnChange="onColumnChange"
        @onPagesChange="onPagesChange"
        @onSelectChange="onSelectChange"
    >
      <template #leftBtn>
        <i-tooltip title="添加" content="添加" @click="handleAddEdit(0)">
          <template #icon>
            <plus-outlined/>
          </template>
        </i-tooltip>
        <i-tooltip title="删除选中行">
          <template #content>
            <a-popconfirm
                title="确定删除选中记录？"
                ok-text="删除"
                cancel-text="取消"
                @cancel="onDeleteAllCancel"
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
                  <delete-outlined/>
                </template>
                删除
              </a-button>
            </a-popconfirm>
          </template>
        </i-tooltip>
      </template>
      <template #index="{ index }">
        {{ index + 1 }}
      </template>
      <template #gender="{ record }">
        <a-tag color="success" class="table-tag">
          {{ genderRender(record) }}
        </a-tag>
      </template>
      <template #updateip="{ record }">
        <a-tag color="success" class="table-tag">
          {{ record.updateip }}
        </a-tag>
      </template>
      <template #status="{ record }">
        <a-tag
            :color="record.status === 1 ? 'success' : 'error'"
            class="table-tag"
        >
          {{ record.status === 1 ? "启用" : "禁用" }}
        </a-tag>
      </template>
      <template #avatar="{ record }">
        <a-avatar size="large" :src="record.avatar">
          <template #icon>
            <user-outlined/>
          </template>
        </a-avatar>
      </template>
      <template #menuname="{ record }">
        <span v-if="record.menuname">{{ record.menuname }}</span>
        <a-input v-else placeholder="请输入名称"/>
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
                    <DeleteOutlined/>
                  </template>
                </a-button>
              </a-popconfirm>
            </template>
          </i-tooltip>
        </a-space>
      </template>
    </i-table>

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
