<!-- 管理员管理 -->
<script setup lang="ts">
import {DeleteOutlined, EditOutlined, PlusOutlined, UserOutlined,} from "@ant-design/icons-vue";
import {onMounted, reactive, ref} from "vue";
import FormModal from "./components/FormModal/index.vue";
import type {IColumns, IPages} from "@/types";
import {getAdminList, remove} from "@/api/admin";
import {sortNumber} from "@/utils/common";
import DeletePopconfirm from "@/components/IComponents/IOther/DeletePopconfirm/index.vue";
import {notification} from "ant-design-vue";
import {useI18n} from "vue-i18n";

const {t} = useI18n();

interface IDataSource {
  key?: string | number;
  username?: string;
  nickname?: string;
  roles?: string;
  avatar?: string;
  email?: string;
  phone?: string;
  lastLoginIp?: string;
  lastLoginTime?: string;
  status?: number;
  createTime?: string;
}

const columns = ref<IColumns[]>([
  {
    title: "序号",
    dataIndex: "index",
    key: "index",
    align: "center",
    minWidth: 80,
    customRender: ({index}) => sortNumber(index, pages.value),
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
    title: "角色组",
    dataIndex: "roles",
    align: "center",
    minWidth: 120,
  },
  {
    title: "头像",
    dataIndex: "avatar",
    align: "center",
    minWidth: 100,
  },
  {
    title: "邮箱",
    dataIndex: "email",
    align: "center",
    minWidth: 150,
  },
  {
    title: "手机号",
    dataIndex: "phone",
    align: "center",
    minWidth: 150,
  },
  {
    title: "最后登录IP",
    dataIndex: "lastLoginIp",
    align: "center",
    minWidth: 100,
  },
  {
    title: "最后登录时间",
    dataIndex: "lastLoginTime",
    align: "center",
    minWidth: 160,
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
    align: "center",
    minWidth: 160,
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
const formSearch = reactive<any>({});
const recordOptions = ref<Record<string, any> | undefined>();

const avatarPreviewSrc = ref("");
const isTableLoading = ref<boolean>(false); // 表格加载状态
const isFormModalVisible = ref<boolean>(false);
const isAvatarPreviewSrcVisible = ref<boolean>(false);

onMounted(async () => {
  await getList();
});

const getList = async () => {
  const params = {
    page: pages.value.page,
    size: pages.value.size,
    ...formSearch,
  };
  isTableLoading.value = true;
  try {
    const {data} = await getAdminList(params);
    console.log(data, "getAdminList");
    dataSource.value = data.records

    pages.value = {
      size: data.size,
      page: data.page,
      total: data.total,
    };
  } finally {
    isTableLoading.value = false;
  }
}

const handleQuery = async (options) => {
  console.log('handleQuery', options)
  pages.value.page = 1;
  pages.value.size = 10;
  await getList();
}

// 添加
const handleFormModalOpen = (type: number, record?: IDataSource) => {
  if (type === 1) {
    recordOptions.value = record;
  }
  isFormModalVisible.value = true;
};
// 添加/编辑 - cancel
const handleFormModalCancel = () => {
  clearFormModalCache()
};

// 添加/编辑 - confirm
const handleFormModalConfirm = async () => {
  handleFormModalCancel();
  await handleQuery(formSearch);
  clearFormModalCache()
};

const clearFormModalCache = () => {
  isFormModalVisible.value = false;
  recordOptions.value = undefined;
}

// 删除
const handleDeletePopconfirmConfirm = async (record) => {
  console.log("handleDeletePopconfirmConfirm", record);
  await remove({id: record.id});
  notification.success({
    message: t("message.success"),
    description: t("success.delete"),
  });
  await getList();
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
  isAvatarPreviewSrcVisible.value = true;
  avatarPreviewSrc.value = src;
};
</script>

<template>
  <div class="default-main">
    <i-table
        :columns="columns"
        :dataSource="dataSource"
        :pages="pages"
        :loading="isTableLoading"
        @reload="getList"
        @columnChange="onColumnChange"
        @pagesChange="onPagesChange"
        @selectChange="onSelectChange"
    >
      <template #leftActions>
        <i-tooltip title="添加" content="添加" @click="handleFormModalOpen(0)">
          <template #icon>
            <plus-outlined/>
          </template>
        </i-tooltip>
        <i-tooltip title="删除选中行">
          <template #content>
            <a-popconfirm
                title="确定删除选中记录？"
                ok-text="删除"
                ok-button="primary"
                :ok-button-props="{danger:true}"
                cancel-text="取消"
            >
              <a-button type="primary" danger :disabled="!selectedRowKeys.length">
                <template #icon>
                  <delete-outlined/>
                </template>
                删除
              </a-button>
            </a-popconfirm>
          </template>
        </i-tooltip>
      </template>
      <template #roles="{ value }">
        <a-tag v-for="text in value" :key="value" color="processing" class="table-tag">
          {{ text }}
        </a-tag>
      </template>
      <template #avatar="{ record }">
        <a-avatar
            size="large"
            :src="record.avatar"
            @click="openAvatarPreviewImage(record.avatar)"
        >
          <template #icon>
            <user-outlined/>
          </template>
        </a-avatar>
      </template>
      <template #lastLoginIp="{value}">
        <a-tag v-if="value" color="processing" class="table-tag">
          {{ value }}
        </a-tag>
      </template>
      <template #status="{ value }">
        <a-tag
            :color="value === 1 ? 'success' : 'error'"
            class="table-tag"
        >
          {{ $t(`user.table.rows.status.${value}`) }}
        </a-tag>
      </template>
      <template #operate="{ record }">
        <a-space>
          <i-tooltip title="编辑" size="small" @click="handleFormModalOpen(1,record)">
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
        :visible="isFormModalVisible"
        :options="recordOptions"
        @cancel="handleFormModalCancel"
        @confirm="handleFormModalConfirm"
    />

    <i-preview-image
        v-model:visible="isAvatarPreviewSrcVisible"
        :src="avatarPreviewSrc"
    />
  </div>
</template>

<style lang="less" scoped>
@import "./index.less";
</style>
