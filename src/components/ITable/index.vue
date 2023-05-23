<!-- 角色组管理 -->
<script setup lang="ts">
import {
  SyncOutlined,
  TableOutlined,
  SearchOutlined,
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
  watch,
} from "vue";
import type { ColumnFilterItem } from "ant-design-vue/es/table/interface";
interface IProps {
  columns: IColumns[]; // 表格列的配置描述
  dataSource: IDataSource[]; //
  selectedRowKeys?: string[]; // 选中的表格多选
  pageSizeOptions?: string[]; // 指定每页可以显示多少条
  pages?: IPages; // 页码
  keywordPlaceholder?: string; // 搜索框 占位内容
  isSelectedRowKeys?: boolean; // 是否显示表格多选框
  loading?: boolean; // 表格加载状态
  isFormSearchBtn?: boolean; // 是否显示 form 按钮 搭配插槽 formSearch 一起使用
  isExpandAllRows?: boolean; // 控制展开所有行
}

const props = withDefaults(defineProps<IProps>(), {
  columns: () => [],
  dataSource: () => [],
  selectedRowKeys: () => [],
  pageSizeOptions: () => ["10", "20", "30", "50", "100"],
  pages: () => ({
    pageSize: 10,
    current: 1,
    total: 0,
  }),
  keywordPlaceholder: "",
  isSelectedRowKeys: false,
  loading: false,
  isFormSearchBtn: false,
  isExpandAllRows: false,
});

const emits = defineEmits([
  "onSelectChange", // 选中表格数据change事件
  "onColumnChange", // columns 发生变化时
  "onPagesChange", // 页码发生变化时
  "onReload", // 刷新表格
  "onDetail",
  "onEdit", // 表格内置编辑
  "onDelete", // 表格内置删除行
  "onSearchBlur", // 表格搜索
]);

const pages = toRef(props, "pages");
const columnStorages = ref<IColumns[]>(props.columns); // 暂存 被删除的columns
const menuChecked = ref<string[]>([]); // 选中显示隐藏表头
const menuCheckList = ref<IColumns[]>([]); // 表头的数据列
const dataSource = ref<IDataSource[]>(props.dataSource);
const selectedRowKeys = ref<string[]>([]);
const expandedRowKeys = ref<string[]>([]);
const oldKeyword = ref<string>(""); // 旧的 搜索内容 防止重复调用接口
const keyword = ref<string>(""); // 搜索
const menuOrSearch = ref<string>("menu");
const isDropdownVisible = ref<boolean>(false);
const isOpenSearch = ref<boolean>(false); // 展开搜索栏区域

onMounted(() => {
  // 修改 columns
  menuCheckList.value = props.columns.filter(
    (item) => ![item.dataIndex, item.key].includes("operate")
  );
  menuChecked.value = unref(menuCheckList).map((item) => item.dataIndex);
  // 默认是否展开
  expandAllRows();
});
// 监听 展开收起
watch(
  () => props.isExpandAllRows,
  () => expandAllRows()
);

// 刷新表格
const onReload = () => {
  emits("onReload");
};

// 展开收起 - 内置 务必添加 key
const expandAllRows = () => {
  // 是否存在 children 节点 不包括 [] 空数组
  const isChildren = unref(dataSource).some((item) => item.children);

  // console.log(isChildren, "expandAllRows");
  if (!isChildren) return;

  // expandedRowKeys.value = ["1", "1-1", "1-1-1"];
  let keys: string[] = [];
  if (props.isExpandAllRows) {
    (function childrenFn(list: IDataSource[]) {
      list.forEach((item) => {
        // 是否存在 key
        if (!item.key) throw new Error("no key in" + JSON.stringify(item));
        keys.push(item.key);
        //若子数组存在 children 继续递归
        if (item.children) childrenFn(item.children);
      });
    })(unref(dataSource));
  } else {
    keys = [];
  }
  expandedRowKeys.value = keys;
};

/** 分页
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
    if (unref(menuChecked).includes(item.dataIndex)) {
      arr.push(item);
    }
  });
  // 操作,默认需要
  const newColumns = unref(columnStorages);
  arr.push(newColumns[newColumns.length - 1]);
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
  selectedRowKeys.value = changableRowKeys;
  emits("onSelectChange", changableRowKeys);
};
// 搜索 input blur 事件
const onSearchBlur = () => {
  // 当新数据 = 旧数据 不传输事件
  if (unref(keyword) === unref(oldKeyword)) return;
  oldKeyword.value = unref(keyword);
  emits("onSearchBlur", unref(keyword));
};

const rowSelection = computed(() => {
  return {
    selectedRowKeys: unref(selectedRowKeys), // 指定选中项的 key 数组，需要和 onChange 进行配合
    onChange: onSelectChange, // 选中项发生变化时的回调
    hideDefaultSelections: true, // 去掉『全选』『反选』两个默认选项
    fixed: true, // 把选择框列固定在左边
  };
});
</script>

<template>
  <div class="default-main">
    <div class="container-table">
      <!-- formSearch -->
      <Transition name="zoom-in">
        <div v-show="isOpenSearch" class="table-form">
          <slot name="formSearch"></slot>
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
          <!-- 左侧按钮 可自定义左侧按钮内容 -->
          <slot name="leftBtn"></slot>
        </a-space>
        <a-space>
          <a-input
            :placeholder="props.keywordPlaceholder"
            v-model:value="keyword"
            @blur="onSearchBlur"
          />
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
              <a-radio-button
                value="search"
                @click="onOpenSearch"
                v-if="isFormSearchBtn"
              >
                <SearchOutlined />
              </a-radio-button>
            </a-tooltip>
          </a-radio-group>
        </a-space>
      </div>
      <a-table
        :row-selection="props.isSelectedRowKeys ? rowSelection : null"
        :dataSource="dataSource"
        :loading="props.loading"
        :columns="props.columns"
        v-model:expandedRowKeys="expandedRowKeys"
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
        <template #bodyCell="row">
          <slot name="bodyCell" v-bind="row"></slot>
        </template>
      </a-table>
    </div>
  </div>
</template>

<style lang="less" scoped>
@import "./index.less";
</style>
