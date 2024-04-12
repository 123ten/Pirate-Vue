<!-- 菜单规则管理 -->
<script setup lang="ts">
import * as antIcons from "@ant-design/icons-vue";
import {DragOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons-vue";
import {computed, onMounted, ref, unref} from "vue";
import FormModal from "./components/FormModal/index.vue";
import DeletePopconfirm from "@/components/IComponents/IOther/DeletePopconfirm/index.vue";
import {storeToRefs} from "pinia";
import {useAdminMenuStore} from "@/store/auth";
import {deepForEach} from "@/utils/common";
import {notification} from "ant-design-vue";
import {useI18n} from "vue-i18n";
import type {IColumns} from "@/types";
import type {AdminMenuDataSource} from "@/store/auth/menu/types";

const {t} = useI18n()
const store = useAdminMenuStore()
const {dataSource, isTableLoading} = storeToRefs(store);
const {getAdminMenuListRequest, getAdminMenuByIdRequest, adminMenuStatusRequest} = store

//#region 变量
const columns: IColumns[] = [
  {
    title: "标题",
    dataIndex: "title",
    width: 120,
  },
  {
    title: "图标",
    dataIndex: "icon",
    align: "center",
    width: 50,
  },
  {
    title: "权限标识",
    dataIndex: "name",
    align: "center",
    width: 150,
  },
  {
    title: "组件路径",
    dataIndex: "component",
    width: 200,
  },
  {
    title: "类型",
    dataIndex: "type",
    align: "center",
    width: 100,
  },
  {
    title: "缓存",
    dataIndex: "cache",
    align: "center",
    width: 100,
  },
  {
    title: "状态",
    dataIndex: "status",
    align: "center",
    width: 100,
  },
  {
    title: "修改时间",
    dataIndex: "updateTime",
    align: "center",
    width: 150,
  },
  {
    title: "操作",
    dataIndex: "operation",
    align: "center",
    fixed: "right",
    width: 100,
  },
]

const selectedRowKeys = ref<AdminMenuDataSource["key"][]>([]);

const defaultExpandAllRows = ref<boolean>(false);
const isFormModalVisible = ref<boolean>(false);
//#endregion

onMounted(async () => {
  await getList()
});

const getList = async () => {
  await getAdminMenuListRequest()
  defaultExpandAllRows.value = true
}

// 添加
const handleFormModalOpen = async (type: number, record?: AdminMenuDataSource) => {
  isFormModalVisible.value = true;
  if (record) {
    await getAdminMenuByIdRequest(record.id)
  }
};
// 添加/编辑 - cancel
const handleFormModalCancel = () => {
  isFormModalVisible.value = false;
};
// 添加/编辑 - confirm
const handleFormModalConfirm = async () => {
  handleFormModalCancel();
  await getList();
};

// 删除-确定
const handleDeletePopconfirmConfirm = (keys?: AdminMenuDataSource['id'][]) => {
  console.log("handleDeletePopconfirmConfirm", keys);
};

// 规则类型
const typeEnum = (type: AdminMenuDataSource["type"], key: string) => {
  const typeObj = {
    1: {
      color: "success",
      name: "菜单目录",
    },
    2: {
      color: "processing",
      name: "菜单项",
    },
    3: {
      color: "default",
      name: "页面按钮",
    },
  }
  if (type && typeObj[type]) {
    return typeObj[type][key];
  } else {
    return {
      color: "error",
      name: "暂无数据",
    };
  }
};

const handleStatusChange = async (record: AdminMenuDataSource) => {
  const ids: (number | undefined)[] = [];
  deepForEach([record], (item: AdminMenuDataSource) => {
    ids.push(item.id);
  })
  const params = {
    status: record.status,
    ids: ids
  }
  console.log('handleStatusChange', ids, params);
  await adminMenuStatusRequest(params);
  notification.success({
    message: t("message.success"),
    description: t("success.update"),
  })
  await getList()
}

const onSelectChange = (keys: AdminMenuDataSource["key"][]) => {
  selectedRowKeys.value = keys;
};

const rowSelection = computed(() => ({
  selectedRowKeys: unref(selectedRowKeys),
  onChange: onSelectChange,
}))

</script>

<template>
  <div class="box-border p-4">
    <i-table
        row-key="id"
        :columns="columns"
        :dataSource="dataSource"
        :default-expand-all-rows="defaultExpandAllRows"
        :loading="isTableLoading"
        :pagination="false"
        :row-selection="rowSelection"
        sortable
        @reload="getList"
    >
      <template #leftActions>
        <i-tooltip title="添加" content="添加" @click="handleFormModalOpen(0)">
          <template #icon>
            <plus-outlined/>
          </template>
        </i-tooltip>
        <i-tooltip title="删除选中行" :disabled="!selectedRowKeys.length">
          <template #content>
            <delete-popconfirm
                :disabled="!selectedRowKeys.length"
                placement="rightTop"
                @confirm="() => handleDeletePopconfirmConfirm()"
            />
          </template>
        </i-tooltip>
        <expand-all-rows-tooltip
            v-model:expand="defaultExpandAllRows"
            :disabled="!dataSource.length"
        />
      </template>
      <template #icon="{value}">
        <component v-if="value" :is="antIcons[value]" class="text-[18px]"/>
      </template>
      <template #type="{ record }">
        <a-tag :color="typeEnum(record.type,'color')">
          {{ typeEnum(record.type, 'name') }}
        </a-tag>
      </template>
      <template #cache="{ record }">
        <a-switch
            v-model:checked="record.cache"
            :checkedValue="1"
            :unCheckedValue="0"
        />
      </template>
      <template #status="{ record }">
        <a-switch
            v-model:checked="record.status"
            :checkedValue="1"
            :unCheckedValue="0"
            @click="handleStatusChange(record)"
        />
      </template>
      <template #operation="{ record }">
        <a-space>
          <i-tooltip
              title="拖动以排序"
              size="small"
              type="move"
              custom-button-class="drop-row-btn"
          >
            <template #icon>
              <drag-outlined/>
            </template>
          </i-tooltip>
          <i-tooltip title="编辑" size="small" @click="handleFormModalOpen(1,record)">
            <template #icon>
              <edit-outlined/>
            </template>
          </i-tooltip>
          <i-tooltip title="删除">
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
        v-model:visible="isFormModalVisible"
        @cancel="handleFormModalCancel"
        @confirm="handleFormModalConfirm"
    />
  </div>
</template>

