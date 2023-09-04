<!-- 管理员管理 -->
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
  UserOutlined,
} from "@ant-design/icons-vue";
import { computed, onMounted, reactive, ref, unref } from "vue";
import AddEditModal from "./components/AddEditModal/index.vue";
import IPreviewImage from "@/components/IPreviewImage/index.vue";
import data from "./data.json";
import type { IColumns, IPages } from "@/types/index";

interface IDataSource {
  key?: string | number;
  isDelVisible?: boolean;
  username?: string;
  nickname?: string;
  groups?: string;
  avatar?: string;
  email?: string;
  phone?: string;
  lastlogintime?: string;
  createTime?: string;
  status?: number;
}

const columns = ref<IColumns[]>([
  {
    title: "序号",
    dataIndex: "index",
    key: "index",
    align: "center",
    customRender: ({ index }) => index + 1,
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
    dataIndex: "groups",
    align: "center",
  },
  {
    title: "头像",
    dataIndex: "avatar",
    align: "center",
  },
  {
    title: "邮箱",
    dataIndex: "email",
    align: "center",
  },
  {
    title: "手机号",
    dataIndex: "phone",
    align: "center",
  },
  {
    title: "最后登录",
    dataIndex: "lastlogintime",
    align: "center",
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
    align: "center",
  },
  {
    title: "状态",
    dataIndex: "status",
    align: "center",
  },
  {
    title: "操作",
    dataIndex: "operate",
    align: "center",
    fixed: "right",
    width: 100,
  },
]);
const dataSource = ref<IDataSource[]>(data);
const selectedRowKeys = ref<IDataSource["key"][]>([]);
const pages = ref<IPages>({
  pageSize: 10,
  current: 1,
  total: 0,
});
const formSeach = reactive<any>({});

const avatarPreviewSrc = ref("");
const isEdit = ref<boolean>(false); // 是否编辑
const isDeleteAllVisible = ref<boolean>(false);
const isTableLoading = ref<boolean>(false); // 表格加载状态
const isAddEditModal = ref<boolean>(false);
const isAvatarPreviewSrc = ref<boolean>(false);

onMounted(() => {
  dataSource.value = dataSource.value.map((item) => {
    item.isDelVisible = false;
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
  return;
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

// 显示预览图片
const openAvatarPreviewImage = (src: string) => {
  isAvatarPreviewSrc.value = true;
  avatarPreviewSrc.value = src;
};
</script>

<template>
  <div class="default-main">
    <ITable
      :columns="columns"
      :dataSource="dataSource"
      :pages="pages"
      isSelectedRowKeys
      isFormSearchBtn
      :loading="isTableLoading"
      :scroll="{ x: true }"
      @onColumnChange="onColumnChange"
      @onPagesChange="onPagesChange"
      @onSelectChange="onSelectChange"
    >
      <template #formSearch>
        <a-form
          :model="formSeach"
          layout="inline"
          name="basic"
          autocomplete="off"
        >
          <a-space direction="vertical">
            <a-row style="width: 100%">
              <a-col :span="6">
                <a-form-item label="UsernameUsernameUsername" name="username">
                  <a-input v-model:value="formSeach.username" allow-clear />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="Username" name="nickname">
                  <a-input v-model:value="formSeach.username" allow-clear />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="Username" name="123">
                  <a-input v-model:value="formSeach.username" allow-clear />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="Username" name="222">
                  <a-input v-model:value="formSeach.username" allow-clear />
                </a-form-item>
              </a-col>
            </a-row>
          </a-space>
          <a-space>
            <a-button>查询</a-button>
            <a-button>重置</a-button>
          </a-space>
        </a-form>
      </template>
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
      <template #avatar="{ record }">
        <a-avatar
          size="large"
          :src="record.avatar"
          @click="openAvatarPreviewImage(record.avatar)"
        >
          <template #icon><UserOutlined /></template>
        </a-avatar>
      </template>
      <template #status="{ record }">
        <a-tag :color="record.status === 1 ? 'success' : 'error'">
          {{ record.status === 1 ? "启用" : "禁用" }}
        </a-tag>
      </template>
      <template #operate="{ record }">
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
                v-model:visible="record.isDelVisible"
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
    </ITable>

    <AddEditModal
      :visible="isAddEditModal"
      :title="isEdit ? '编辑' : '添加'"
      @cancel="onAddEditCancel"
      @confirm="onAddEditConfirm"
    />
    <IPreviewImage
      :src="avatarPreviewSrc"
      v-model:visible="isAvatarPreviewSrc"
    />
  </div>
</template>

<style lang="less" scoped>
@import "./index.less";
</style>
