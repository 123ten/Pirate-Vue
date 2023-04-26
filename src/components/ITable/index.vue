<!-- 角色组管理 -->
<script setup lang="ts">
import {
  SyncOutlined,
  PlusOutlined,
  DeleteOutlined,
  TableOutlined,
  SearchOutlined,
  EditOutlined,
  ZoomInOutlined,
} from "@ant-design/icons-vue";
import {
  computed,
  onMounted,
  reactive,
  ref,
  toRefs,
  toRef,
  unref,
  withDefaults,
} from "vue";
import type { ColumnType } from "ant-design-vue/lib/table";
import type { ColumnFilterItem } from "ant-design-vue/es/table/interface";
interface IProps {
  columns: IColumns[]; // 表格列的配置描述
  dataSource: IDataSource[]; //
  selectedRowKeys?: string[]; // 选中的表格多选
  isSelectedRowKeys?: boolean; // 是否显示表格多选框
  loading?: false; // 表格加载状态
  pages?: IPages; // 页码
  pageSizeOptions?: string[]; // 指定每页可以显示多少条
}

const props = withDefaults(defineProps<IProps>(), {
  columns: () => [],
  dataSource: () => [],
  selectedRowKeys: () => [],
  isSelectedRowKeys: false,
  loading: false,
  pages: () => ({
    pageSize: 10,
    current: 1,
    total: 0,
  }),
  pageSizeOptions: () => ["10", "20", "30", "50", "100"],
});
// const props =
const emits = defineEmits([
  "onDelCurrentConfirm", // 删除当前行
  "onSelectChange", // 选中表格数据change事件
  "onColumnChange", // columns 发生变化时
  "onPagesChange", // 页码发生变化时
  "on",
]);

const columnStorages = ref<IColumns[]>(props.columns); // 暂存 被删除的columns
const menuChecked = ref<string[]>([]); // 选中显示隐藏表头
const menuCheckList = ref<IColumns[]>([]); // 表头的数据列
const pages = toRef(props, "pages");
const dataSource = ref<IDataSource[]>(props.dataSource);
const menuOrSearch = ref<string>("menu");
const isDropdownVisible = ref<boolean>(false);
const isDelAllVisible = ref<boolean>(false);
const isOpenSearch = ref<boolean>(false);

onMounted(() => {
  dataSource.value = dataSource.value.map((item) => {
    item.isDelVisible = false;
    return item;
  });
  menuCheckList.value = props.columns.filter(
    (item) => ![item.dataIndex, item.key].includes("operate")
  );
  menuChecked.value = menuCheckList.value.map(
    (item) => item.dataIndex || item.key
  );
});

// 刷新表格
const onReload = () => {
  // isTableLoading.value = true;
};

// 打开搜索框弹窗

// 删除-确定
const onDelAllConfirm = () => {
  isDelAllVisible.value = false;
};
// 删除-取消
const onDelAllcancel = () => {
  isDelAllVisible.value = false;
};
// 删除-显示隐藏的回调
const onDelVisibleChange = () => {
  // selectedRowKeys没有选中时 默认禁用 删除按钮
  if (!props.selectedRowKeys?.length) {
    isDelAllVisible.value = false;
  }
};
// 删除当前行-确定
const onDelCurrentConfirm = (record: IDataSource) => {
  //   console.log(record, "record");
  record.isDelVisible = false;
  emits("onDelCurrentConfirm", record);
};
// 删除当前行-取消
const onDelCurrentCancel = (record: IDataSource) => {
  record.isDelVisible = false;
};

/**
 * 分页
 * @param {IPagination} pagination 当前分页的所有配置参数
 * @param {ColumnFilterItem} filters 表头的筛选菜单项
 * @param {Function} sorter 排序函数
 * @param {IDataSource}currentDataSource 返回当前的列表数据
 */
const handlePageSizeChange = (
  pagination: IPagination,
  filters: ColumnFilterItem,
  sorter: Function | boolean,
  { currentDataSource }: any
) => {
  const pages: IPages = {
    pageSize: pagination.pageSize,
    current: pagination.current,
    total: pagination.total,
  };
  emits("onPagesChange", pages);
  //   console.log(pagination, filters, sorter, currentDataSource, "current, size");
};

// 选中显示表格列
const onCheckboxChange = () => {
  //   console.log(menuChecked.value, columnStorages.value, "menuChecked");
  const arr = [];
  unref(columnStorages).forEach((item) => {
    if (menuChecked.value.includes(item.dataIndex || item.key)) {
      arr.push(item);
    }
  });
  // 操作,默认需要
  const columnS = unref(columnStorages);
  arr.push(columnS[columnS.length - 1]);
  emits("onColumnChange", arr);
};
// 显示与隐藏 form
const onOpenSearch = () => {
  isOpenSearch.value = !unref(isOpenSearch);
};
// 表格可伸缩
const handleResizeColumn = (w: number, col: any) => {
  col.width = w;
};
// 勾选change事件
const onSelectChange = (changableRowKeys: string[]) => {
  console.log("selectedRowKeys changed: ", changableRowKeys);
  //   selectedRowKeys.value = changableRowKeys;
  emits("onSelectChange", changableRowKeys);
};
const rowSelection = computed(() => {
  return {
    selectedRowKeys: props.selectedRowKeys, // 指定选中项的 key 数组，需要和 onChange 进行配合
    onChange: onSelectChange, // 选中项发生变化时的回调
    hideDefaultSelections: true, // 去掉『全选』『反选』两个默认选项
    fixed: true, // 把选择框列固定在左边
  };
});
</script>

<template>
  <div class="default-main">
    <div class="container-table">
      <!-- <div></div> -->
      <Transition name="zoom-in">
        <div v-show="isOpenSearch" class="table-form">
          <slot name="formSearch" />
        </div>
      </Transition>
      <div class="table-header">
        <a-space>
          <a-tooltip>
            <template #title>
              <span>刷新</span>
            </template>
            <a-button class="reload-btn" @click="onReload">
              <SyncOutlined style="color: #fff" />
            </a-button>
          </a-tooltip>
          <a-tooltip>
            <template #title>
              <span>添加</span>
            </template>
            <a-button type="primary">
              <template #icon>
                <PlusOutlined />
              </template>
              添加
            </a-button>
          </a-tooltip>
          <a-tooltip>
            <template #title>
              <span>删除选中行</span>
            </template>
            <a-popconfirm
              title="确定删除选中记录？"
              ok-text="删除"
              cancel-text="取消"
              @cancel="onDelAllcancel"
              @visibleChange="onDelVisibleChange"
              v-model:visible="isDelAllVisible"
            >
              <template #okButton>
                <a-button type="danger" size="small" @click="onDelAllConfirm">
                  删除
                </a-button>
              </template>
              <a-button type="danger" :disabled="!selectedRowKeys.length">
                <template #icon>
                  <DeleteOutlined />
                </template>
                删除
              </a-button>
            </a-popconfirm>
          </a-tooltip>
        </a-space>
        <a-space>
          <a-input placeholder="通过组名模糊搜索" />
          <a-radio-group v-model:value="menuOrSearch">
            <a-dropdown placement="bottom" v-model:visible="isDropdownVisible">
              <a-radio-button value="menu">
                <TableOutlined />
              </a-radio-button>
              <template #overlay v-if="menuCheckList.length">
                <a-menu>
                  <a-checkbox-group
                    v-model:value="menuChecked"
                    style="width: 100%"
                    @change="onCheckboxChange"
                  >
                    <a-menu-item
                      v-for="item in menuCheckList"
                      :key="item.key || item.dataIndex"
                    >
                      <a-checkbox :value="item.key || item.dataIndex">
                        {{ item.title }}
                      </a-checkbox>
                    </a-menu-item>
                  </a-checkbox-group>
                </a-menu>
              </template>
            </a-dropdown>
            <a-tooltip>
              <template #title v-if="!isOpenSearch">
                <span>展开通用搜索</span>
              </template>
              <a-radio-button value="search" @click="onOpenSearch">
                <SearchOutlined />
              </a-radio-button>
            </a-tooltip>
          </a-radio-group>
        </a-space>
      </div>
      <a-table
        :row-selection="props.isSelectedRowKeys ? rowSelection : undefined"
        :dataSource="dataSource"
        :loading="props.loading"
        :columns="props.columns"
        bordered
        @resizeColumn="handleResizeColumn"
        @change="handlePageSizeChange"
        :pagination="{
          showQuickJumper: true,
          showSizeChanger:true,
          total: pages.total,
          pageSize: pages.pageSize,
          current:pages.current,
          showTotal: (total:number) =>`共 ${total} 条`,
          pageSizeOptions: props.pageSizeOptions,
        }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'operate'">
            <a-space>
              <a-tooltip>
                <template #title>
                  <span>查看详情</span>
                </template>
                <a-button type="primary" size="small">
                  <ZoomInOutlined />
                </a-button>
              </a-tooltip>
              <a-tooltip>
                <template #title>
                  <span>编辑</span>
                </template>
                <a-button type="primary" size="small">
                  <EditOutlined />
                </a-button>
              </a-tooltip>
              <a-tooltip>
                <template #title>
                  <span>删除</span>
                </template>
                <a-popconfirm
                  title="确定删除选中记录？"
                  ok-text="删除"
                  cancel-text="取消"
                  @cancel="onDelCurrentCancel(record)"
                  v-model:visible="record.isDelVisible"
                  placement="left"
                >
                  <template #okButton>
                    <a-button
                      type="danger"
                      size="small"
                      @click="onDelCurrentConfirm(record)"
                    >
                      删除
                    </a-button>
                  </template>
                  <a-button type="danger" size="small">
                    <template #icon>
                      <DeleteOutlined />
                    </template>
                  </a-button>
                </a-popconfirm>
              </a-tooltip>
            </a-space>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<style lang="less" scoped>
@import "./index.less";
</style>
