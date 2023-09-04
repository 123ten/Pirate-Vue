<!-- 管理员日志管理 -->
<script setup lang="ts">
import {
  ZoomInOutlined,
  UserOutlined,
  SendOutlined,
} from "@ant-design/icons-vue";
import { computed, onMounted, reactive, ref, unref } from "vue";
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
  status?: boolean;
}

const columns = ref<IColumns[]>([
  {
    title: "ID",
    dataIndex: "id",
    align: "center",
  },
  {
    title: "管理员ID",
    dataIndex: "adminId",
    align: "center",
  },
  {
    title: "管理员用户名",
    dataIndex: "adminname",
    align: "center",
  },
  {
    title: "标题",
    dataIndex: "title",
    align: "center",
  },
  {
    title: "URL",
    dataIndex: "url",
    align: "center",
    width: 280,
  },
  {
    title: "IP",
    dataIndex: "ip",
    align: "center",
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
    align: "center",
    width: 180,
    minWidth: 180,
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
const isAvatarPreviewSrc = ref<boolean>(false);

onMounted(() => {
  dataSource.value = dataSource.value.map((item) => {
    item.isDelVisible = false;
    return item;
  });
});

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

const toUrl = (url: string) => {
  window.open("#" + url);
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
                  name="nickname"
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
                  name="123"
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
                  name="222"
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
          <a-space>
            <a-button>查询</a-button>
            <a-button>重置</a-button>
          </a-space>
        </a-form>
      </template>
      <template #url="{ record }">
        <a-input-group compact>
          <a-input
            v-model:value="record.url"
            readonly
            style="width: 200px; text-align: left"
          >
          </a-input>
          <a-button @click="toUrl(record.url)">
            <template #icon>
              <SendOutlined />
            </template>
          </a-button>
        </a-input-group>
      </template>
      <template #ip="{ record }">
        <a-tag color="processing">
          {{ record.ip }}
        </a-tag>
      </template>
      <template #operate="{ record }">
        <a-space>
          <ITooltip title="查看详情" size="small">
            <template #icon>
              <ZoomInOutlined />
            </template>
          </ITooltip>
        </a-space>
      </template>
    </ITable>
    <IPreviewImage
      :src="avatarPreviewSrc"
      v-model:visible="isAvatarPreviewSrc"
    />
  </div>
</template>

<style lang="less" scoped>
@import "./index.less";
</style>
