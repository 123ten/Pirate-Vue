<!-- 管理员日志管理 -->
<script setup lang="ts">
import {SendOutlined, ZoomInOutlined,} from "@ant-design/icons-vue";
import {onMounted, ref} from "vue";
import {useAdminLogStore} from "@/store/auth/adminLog";
import {storeToRefs} from "pinia";
import {sortNumber} from "@/utils/common";
import DetailModal from './components/DetailModal/index.vue'
import type {IColumns, IPages} from "@/types";
import {AdminLogDataSource} from "@/store/auth/adminLog/types";

const store = useAdminLogStore()
const {dataSource, isTableLoading, pages} = storeToRefs(store);
const {getAdminLogListRequest, getAdminLogByIdRequest} = store

const columns: IColumns[] = [
  {
    title: "序号",
    dataIndex: "number",
    align: "center",
    width: 80,
    customRender: ({index}) => sortNumber(index, pages.value),
  },
  {
    title: "管理员ID",
    dataIndex: "userId",
    align: "center",
    search: true,
    width: 100
  },
  {
    title: "管理员用户名",
    dataIndex: "username",
    align: "center",
    width: 120
  },
  {
    title: "标题",
    dataIndex: "title",
    align: "center",
    width: 120
  },
  {
    title: "URL",
    dataIndex: "url",
    align: "center",
    width: 200,
  },
  {
    title: "IP",
    dataIndex: "ip",
    align: "center",
    width: 120,
  },
  {
    title: "请求方式",
    dataIndex: "method",
    align: "center",
    width: 100,
  },
  {
    title: "UserAgent",
    dataIndex: "userAgent",
    align: "center",
    width: 200,
    ellipsis: true
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
    align: "center",
    width: 150,
  },
  {
    title: "操作",
    dataIndex: "operation",
    align: "center",
    fixed: "right",
    width: 60,
  },
]

const selectedRowKeys = ref<AdminLogDataSource["key"][]>([]);
const avatarPreviewSrc = ref("");

const isAvatarPreviewSrc = ref<boolean>(false);
const isDetailModalVisible = ref<boolean>(false);

onMounted(async () => {
  await getList()
});

const getList = async () => {
  await getAdminLogListRequest()
}

// 分页
const handlePagesChange = async (records: IPages) => {
  pages.value = records;
  await getList();
};

// 多选
const handleSelectChange = (rowKeys: string[]) => {
  selectedRowKeys.value = rowKeys;
  console.log(rowKeys, "rowKeys");
};

// 详情 - 打开弹窗
const handleDetailModalOpen = async (record: AdminLogDataSource) => {
  isDetailModalVisible.value = true
  await getAdminLogByIdRequest(record.id)
}
// 详情 - 取消
const handleDetailModalCancel = () => {
  isDetailModalVisible.value = false
}

const toUrl = (url: string) => {
  window.open(url);
};
</script>

<template>
  <div class="box-border p-4">
    <i-table
      :columns="columns"
      :data-source="dataSource"
      :pages="pages"
      :loading="isTableLoading"
      :scroll="{x: true}"
      @reload="getList"
      @pages-change="handlePagesChange"
      @select-change="handleSelectChange"
    >
      <template #url="{ record }">
        <a-input-group compact style="display: flex;">
          <a-input
            v-model:value="record.url"
            readonly
            style="text-align: left"
          >
          </a-input>
          <a-button @click="toUrl(record.url)">
            <template #icon>
              <send-outlined/>
            </template>
          </a-button>
        </a-input-group>
      </template>
      <template #ip="{ value }">
        <a-tag color="processing">
          {{ value }}
        </a-tag>
      </template>
      <template #method="{ value }">
        <method-tag :method="value"/>
      </template>
      <template #operation="{ record }">
        <i-tooltip title="查看详情" size="small" @click="handleDetailModalOpen(record)">
          <template #icon>
            <zoom-in-outlined/>
          </template>
        </i-tooltip>
      </template>
    </i-table>

    <detail-modal
      :visible="isDetailModalVisible"
      @cancel="handleDetailModalCancel"
    />

    <i-preview-image
      :src="avatarPreviewSrc"
      v-model:visible="isAvatarPreviewSrc"
    />
  </div>
</template>

