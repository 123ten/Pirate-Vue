<!-- 附件管理 -->
<script setup lang="ts">
import {DeleteOutlined} from "@ant-design/icons-vue";
import {onMounted, ref} from "vue";
import type {IColumns, IPages} from "@/types";
import {formatFileSize, sortNumber} from "@/utils/common";
import {storeToRefs} from "pinia";
import {useRoutineAnnexStore} from "@/store/routine/annex";
import ProcessingTag from "@/components/IComponents/IOther/ProcessingTag/index.vue";
import DeletePopconfirm from "@/components/IComponents/IOther/DeletePopconfirm/index.vue";

const store = useRoutineAnnexStore()
const {queryForm, dataSource, isTableLoading, pages, remark} = storeToRefs(store);
const {getFileListRequest, removeFileRequest} = store


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
    search: true,
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
    type: "select",
    options: [
      {
        label: "管理员",
        value: 1,
      },
      {
        label: "普通用户",
        value: 2,
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
    search: true
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
    search: true,
    type: 'range-picker',
    searchValueProp: 'updateRange'
  },
  {
    title: "首次上传时间",
    dataIndex: "createTime",
    align: "center",
    width: 180,
    search: true,
    type: 'range-picker',
    searchValueProp: 'createRange'
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

const handleDeletePopconfirmConfirm = async (ids: number[]) => {
  await removeFileRequest(ids)
  await getList();
}

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
        :model="queryForm"
        @reload="getList"
        @query="getList"
        @reset="getList"
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
        <processing-tag :value="value === 1 ? '管理员' : '普通用户'"/>
      </template>
      <template #size="{value}">
        {{ formatFileSize(value) }}
      </template>
      <template #url="{value}">
        <a-image :src="value"/>
      </template>
      <template #operation="{ record }">
        <a-space>
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
  </div>
</template>

