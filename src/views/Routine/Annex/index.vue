<!-- 附件管理 -->
<script setup lang="ts">
import {DeleteOutlined, EditOutlined, InfoCircleFilled} from "@ant-design/icons-vue";
import {onMounted, reactive, ref} from "vue";
import type {IColumns, IPages} from "@/types";
import {getFileList} from "@/api/files";
import {sortNumber} from "@/utils/common";

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
    title: "序号",
    dataIndex: "number",
    align: "center",
    minWidth: 80,
    customRender: ({index}) => sortNumber(index, pages.value),
  },
  {
    title: "附件名称",
    dataIndex: "name",
    align: "center",
    ellipsis: true,
    minWidth: 100,
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
    type: "date",
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
    dataIndex: "url",
    align: "center",
    minWidth: 100,
  },
  {
    title: "上传次数",
    dataIndex: "uploadCount",
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
  size: 10,
  page: 1,
  total: 0,
});
const formSearch = reactive<any>({
  username: "",
  usertype: "",
  mimetype: "",
  upload_count: "",
  filename: "",
  createTime: "",
});

const isTableLoading = ref<boolean>(false); // 表格加载状态

onMounted(async () => {
  await getList();
});

const getList = async () => {
  const params = {
    page: pages.value.page,
    size: pages.value.size,
  };
  isTableLoading.value = true;
  try {
    const {data} = await getFileList(params);
    console.log(data, "data");
    dataSource.value = data.records

    pages.value = {
      size: data.size,
      page: data.page,
      total: data.total,
    };
  } finally {
    isTableLoading.value = false;
  }
};

/**
 * @description 格式化文件大小
 * @param size
 */
const formatFileSize = (size?: number) => {
  if (!size) return "";

  if (size < 1024) {
    return size + ' byte';
  } else if (size < 1024 * 2) {
    return (size / 1024).toFixed(2) + ' KB';
  } else if (size < 1024 * 3) {
    return (size / (1024 * 2)).toFixed(2) + ' MB';
  } else if (size < 1024 * 4) {
    return (size / (1024 * 3)).toFixed(2) + ' GB';
  } else {
    return (size / (1024 * 4)).toFixed(2) + ' TB';
  }
}
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
        <info-circle-filled style="color: #909399"/>
      </template>
    </a-alert>
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
      <!-- <template #usernameSearch> 11111 </template> -->
      <template #leftActions>
        <i-tooltip
            title="删除"
            content="删除"
            :disabled="!selectedRowKeys.length"
            type="danger"
        >
          <template #icon>
            <delete-outlined/>
          </template>
        </i-tooltip>
      </template>

      <template #usertype="{value}">
        <a-tag color="processing">
          {{ value === 1 ? "管理员" : "普通用户" }}
        </a-tag>
      </template>
      <template #size="{value}">
        {{ formatFileSize(value) }}
      </template>
      <template #url="{value}">
        <a-image :src="value"/>
      </template>
      <template #operate="{ record }">
        <a-space>
          <i-tooltip title="编辑" size="small">
            <template #icon>
              <edit-outlined/>
            </template>
          </i-tooltip>
          <i-tooltip title="删除" size="small" type="danger">
            <template #icon>
              <delete-outlined/>
            </template>
          </i-tooltip>
        </a-space>
      </template>
    </i-table>
  </div>
</template>

<style lang="less" scoped>
@import "./index.less";
</style>
