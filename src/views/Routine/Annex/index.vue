<!-- 附件管理 -->
<script setup lang="ts">
import { computed, onMounted, reactive, ref, unref } from "vue";
import IPreviewImage from "@/components/IPreviewImage/index.vue";
import type { IColumns, IPages } from "@/types/index";

interface IDataSource {
  key?: string | number;
  username: string; // 用户名
  usertype: string; // 用户类型 1 管理员 2 普通用户
  size: string; // 文件大小
  mimetype: string; // 文件类型
  full_url: string; // 完整路径
  upload_count: string; // 上传次数
  filename: string; // 原始名称
  createTime?: string; // 最后上传时间
}

const columns = ref<IColumns[]>([
  {
    title: "ID",
    dataIndex: "id",
    align: "center",
    minWidth: 80,
    search: true,
  },
  {
    title: "用户名",
    dataIndex: "username",
    align: "center",
    minWidth: 100,
    search: true,
  },
  {
    title: "用户类型",
    dataIndex: "usertype",
    align: "center",
    minWidth: 100,
    search: true,
    type: "radio",
    options: [
      {
        label: "测试",
        value: 1,
      },
    ],
  },
  {
    title: "大小",
    dataIndex: "size",
    align: "center",
    minWidth: 100,
  },
  {
    title: "文件类型",
    dataIndex: "mimetype",
    align: "center",
    minWidth: 100,
  },
  {
    title: "预览",
    dataIndex: "full_url",
    align: "center",
    minWidth: 100,
  },
  {
    title: "上传次数",
    dataIndex: "upload_count",
    align: "center",
    minWidth: 100,
  },
  {
    title: "原始名称",
    dataIndex: "filename",
    align: "center",
    minWidth: 100,
  },
  {
    title: "最后上传时间",
    dataIndex: "createTime",
    align: "center",
    minWidth: 180,
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
  pageSize: 10,
  current: 1,
  total: 0,
});
const formSeach = reactive<any>({
  username: "",
  usertype: "",
  mimetype: "",
  upload_count: "",
  filename: "",
  createTime: "",
});

const avatarPreviewSrc = ref<string>("");
const isTableLoading = ref<boolean>(false); // 表格加载状态
const isAvatarPreviewSrc = ref<boolean>(false);

onMounted(() => {});

// 分页
const onPagesChange = (records: IPages) => {
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
    <a-alert
      message="同一文件被多次上传时，只会保存一份至磁盘和增加一条附件记录；删除附件记录，将自动删除对应文件！"
      type="gray"
      show-icon
      closable
    >
      <template #icon>
        <InfoCircleFilled style="color: #909399" />
      </template>
    </a-alert>
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
      <!-- <template #usernameSearch> 11111 </template> -->
      <template #leftBtn>
        <ITooltip
          title="删除"
          content="删除"
          :disabled="!selectedRowKeys.length"
          type="danger"
        >
          <template #icon>
            <DeleteOutlined />
          </template>
        </ITooltip>
      </template>
      <template #operate="{ record }">
        <a-space>
          <ITooltip title="编辑" size="small">
            <template #icon>
              <EditOutlined />
            </template>
          </ITooltip>
          <ITooltip title="删除" size="small" type="danger">
            <template #icon>
              <DeleteOutlined />
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
