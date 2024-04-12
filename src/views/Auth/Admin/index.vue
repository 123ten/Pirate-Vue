<!-- 管理员管理 -->
<script setup lang="ts">
import {EditOutlined, PlusOutlined, UserOutlined,} from "@ant-design/icons-vue";
import {computed, onMounted, ref, unref} from "vue";
import FormModal from "./components/FormModal/index.vue";
import type {IColumns, IPages} from "@/types";
import {remove} from "@/api/auth/admin";
import {sortNumber} from "@/utils/common";
import DeletePopconfirm from "@/components/IComponents/IOther/DeletePopconfirm/index.vue";
import {notification} from "ant-design-vue";
import {useI18n} from "vue-i18n";
import {storeToRefs} from "pinia";
import {useAdminStore} from "@/store/auth/admin";
import ProcessingTag from "@/components/IComponents/IOther/ProcessingTag/index.vue";
import StatusTag from "@/components/IComponents/IOther/StatusTag/index.vue";

const store = useAdminStore()
const {formSearch, dataSource, pages, remark, isTableLoading} = storeToRefs(store);
const {getAdminListRequest, getAdminByIdRequest} = store

const {t} = useI18n();

interface IDataSource {
  key?: string | number;
  id: number;
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

const columns: IColumns[] = [
  {
    title: "序号",
    dataIndex: "number",
    isI18n: true,
    align: "center",
    width: 80,
    customRender: ({index}) => sortNumber(index, pages.value),
  },
  {
    title: "用户名",
    dataIndex: "username",
    isI18n: true,
    align: "center",
    width: 100,
  },
  {
    title: "昵称",
    dataIndex: "nickname",
    isI18n: true,
    align: "center",
    width: 100,
  },
  {
    title: "角色组",
    dataIndex: "roles",
    isI18n: true,
    align: "center",
    width: 120,
  },
  {
    title: "头像",
    dataIndex: "avatar",
    isI18n: true,
    align: "center",
    width: 100,
  },
  {
    title: "邮箱",
    dataIndex: "email",
    isI18n: true,
    align: "center",
    width: 150,
  },
  {
    title: "手机号",
    dataIndex: "phone",
    isI18n: true,
    align: "center",
    width: 150,
  },
  {
    title: "最后登录IP",
    dataIndex: "lastLoginIp",
    isI18n: true,
    align: "center",
    width: 100,
  },
  {
    title: "最后登录时间",
    dataIndex: "lastLoginTime",
    isI18n: true,
    align: "center",
    width: 160,
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
    isI18n: true,
    align: "center",
    width: 160,
  },
  {
    title: "状态",
    dataIndex: "status",
    isI18n: true,
    align: "center",
    width: 100,
  },
  {
    title: "操作",
    dataIndex: "operation",
    isI18n: true,
    align: "center",
    fixed: "right",
    width: 100,
  },
];

const selectedRowKeys = ref<IDataSource['id'][]>([]);

const avatarPreviewSrc = ref("");
const isFormModalVisible = ref<boolean>(false);
const isAvatarPreviewSrcVisible = ref<boolean>(false);

onMounted(async () => {
  await getList();
});

const getList = async () => {
  await getAdminListRequest()
}

const handleQuery = async (values) => {
  console.log('handleQuery', values)
  pages.value.page = 1;
  pages.value.size = 10;
  await getList();
}

// 添加
const handleFormModalOpen = async (_type: number, record?: IDataSource) => {
  isFormModalVisible.value = true;
  if (record) {
    await getAdminByIdRequest(record.id)
  }
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
}

// 删除
const handleDeletePopconfirmConfirm = async (ids: IDataSource['id'][]) => {
  console.log("handleDeletePopconfirmConfirm", ids);
  const params = {
    ids,
  }
  await remove(params);
  notification.success({
    message: t("message.success"),
    description: t("success.delete"),
  });
  await getList();
};

// 分页
const onPagesChange = async (value: IPages) => {
  pages.value = value;
  await getList()
};

// 多选
const onSelectChange = (rowKeys: IDataSource['id'][]) => {
  selectedRowKeys.value = rowKeys;
  console.log(rowKeys, "rowKeys");
};

// 显示预览图片
const openAvatarPreviewImage = (src: string) => {
  if (!src) return;
  isAvatarPreviewSrcVisible.value = true;
  avatarPreviewSrc.value = src;
};

const rowSelection = computed(() => ({
  selectedRowKeys: unref(selectedRowKeys),
  onChange: onSelectChange,
}))

const i18nPrefix = computed(() => ({
  table: 'user.table'
}))
</script>

<template>
  <div class="box-border p-4">
    <i-table
        row-key="id"
        :columns="columns"
        :dataSource="dataSource"
        :pages="pages"
        :remark="remark"
        :loading="isTableLoading"
        :rowSelection="rowSelection"
        :i18n-prefix="i18nPrefix"
        @reload="getList"
        @pagesChange="onPagesChange"
    >
      <template #leftActions>
        <i-tooltip :title="$t('title.create')" :content="$t('title.create')" @click="handleFormModalOpen(0)">
          <template #icon>
            <plus-outlined/>
          </template>
        </i-tooltip>
        <i-tooltip :title="$t('title.remove_selected_row')">
          <template #content>
            <delete-popconfirm
                :disabled="!selectedRowKeys.length"
                placement="rightTop"
                @confirm="handleDeletePopconfirmConfirm(selectedRowKeys)"
            />
          </template>
        </i-tooltip>
      </template>
      <template #roles="{ value }">
        <processing-tag v-for="text in value" :key="text" :value="text"/>
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
        <processing-tag :value="value"/>
      </template>
      <template #status="{ value }">
        <status-tag :value="value"/>
      </template>
      <template #operation="{ record }">
        <a-space>
          <i-tooltip :title="$t('title.update')" size="small" @click="handleFormModalOpen(1,record)">
            <template #icon>
              <edit-outlined/>
            </template>
          </i-tooltip>
          <i-tooltip :title="$t('title.delete')">
            <template #content>
              <delete-popconfirm
                  type="table-row"
                  @confirm="handleDeletePopconfirmConfirm([record.id])"
              />
            </template>
          </i-tooltip>
        </a-space>
      </template>
    </i-table>

    <form-modal
        :visible="isFormModalVisible"
        @cancel="handleFormModalCancel"
        @confirm="handleFormModalConfirm"
    />

    <i-preview-image
        v-model:visible="isAvatarPreviewSrcVisible"
        :src="avatarPreviewSrc"
    />
  </div>
</template>

