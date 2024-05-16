<!-- 管理员日志管理 -->
<script setup lang="ts">
import {SendOutlined,} from "@ant-design/icons-vue";
import {provide, ref} from "vue";
import DetailModal from "@/views/Auth/AdminLog/components/DetailModal/index.vue";
import TableSettings, {tableSettingKey} from "@/utils/tableSettings";
import {getAdminLogById, getAdminLogList} from "@/api/auth/adminLog";

const avatarPreviewSrc = ref("");
const isAvatarPreviewSrc = ref<boolean>(false);
const isDetailModalVisible = ref<boolean>(false);

// 详情 - 取消
const handleDetailModalCancel = () => {
  isDetailModalVisible.value = false
}

const toUrl = (url: string) => {
  window.open(url);
};

const tableSettings: any = new TableSettings({
  api: {
    request: getAdminLogList,
    detailRequest: getAdminLogById,
  },
  table: {
    operations: [
      "refresh",
      "row-detail"
    ],
    columns: [
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
    ],
    i18nPrefix: "admin_log",
    // isI18nGlobal: true,
    scroll: {x: true}
  },
  modal: {
    width: '600px'
  }
});

provide(tableSettingKey, tableSettings);
</script>

<template>
  <custom-table>
    <template #url="{ record }">
      <a-input-group compact style="display: flex;">
        <a-input
          :value="record.url"
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

    <detail-modal
      :visible="isDetailModalVisible"
      @cancel="handleDetailModalCancel"
    />

    <i-preview-image
      :src="avatarPreviewSrc"
      v-model:visible="isAvatarPreviewSrc"
    />
  </custom-table>
</template>
