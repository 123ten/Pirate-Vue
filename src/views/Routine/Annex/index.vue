<!-- 附件管理 -->
<script setup lang="ts">
import {DeleteOutlined} from "@ant-design/icons-vue";
import {onMounted, ref} from "vue";
import type {IColumns, IPages} from "@/types";
import {formatFileSize, sortNumber} from "@/utils/common";
import {storeToRefs} from "pinia";
import {useRoutineAnnexStore} from "@/store/routine/annex";

const store = useRoutineAnnexStore()
const {dataSource, isTableLoading, pages, remark} = storeToRefs(store);
const {getFileListRequest} = store


const columns: IColumns[] = [
  {
    title: "序号",
    dataIndex: "number",
    align: "center",
    width: 80,
    customRender: ({index}) => sortNumber(index, pages.value),
  },
  {
    title: "附件名称",
    dataIndex: "name",
    align: "center",
    ellipsis: true,
    width: 100,
  },
  {
    title: "用户名",
    dataIndex: "username",
    align: "center",
    width: 100,
    search: true,
  },
  {
    title: "用户类型",
    dataIndex: "usertype",
    align: "center",
    width: 100,
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
    width: 100,
  },
  {
    title: "文件类型",
    dataIndex: "mimetype",
    align: "center",
    width: 100,
  },
  {
    title: "预览",
    dataIndex: "url",
    align: "center",
    width: 100,
  },
  {
    title: "上传次数",
    dataIndex: "uploadCount",
    align: "center",
    width: 100,
  },
  {
    title: "最后上传时间",
    dataIndex: "updateTime",
    align: "center",
    width: 180,
  },
  {
    title: "首次上传时间",
    dataIndex: "createTime",
    align: "center",
    width: 180,
  },
  {
    title: "操作",
    dataIndex: "operation",
    align: "center",
    fixed: "right",
    width: 60,
  },
];
const selectedRowKeys = ref<any[]>([]);

onMounted(async () => {
  await getList();
});

const getList = async () => {
  await getFileListRequest()
};

// 分页
const onPagesChange = async (records: IPages) => {
  pages.value = records;
  await getList();
};

// 多选
const onSelectChange = (rowKeys: string[]) => {
  selectedRowKeys.value = rowKeys;
  console.log(rowKeys, "rowKeys");
};

</script>

<template>
  <div class="box-border p-4">
    <i-table
        :columns="columns"
        :dataSource="dataSource"
        :pages="pages"
        :loading="isTableLoading"
        :remark="remark"
        @reload="getList"
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
      <template #operation="{ record }">
        <a-space>
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

