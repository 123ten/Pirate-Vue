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
import Sortable from "sortablejs";
import type { IColumns, IPages, IPagination, TStyle } from "@/types/index";

//#region interface
interface IDataSource {
  key: string;
  children?: IDataSource[];
}
interface IProps {
  columns: IColumns[]; // 表格列的配置描述
  dataSource: IDataSource[]; //
  selectedRowKeys?: string[]; // 选中的表格多选
  pageSizeOptions?: string[]; // 指定每页可以显示多少条
  pages?: IPages; // 页码
  formOptions?: any;
  size?: "large" | "middle" | "small";
  scroll?: null;
  keywordPlaceholder?: string; // 搜索框 占位内容
  isSelectedRowKeys?: boolean; // 是否显示表格多选框
  loading?: boolean; // 表格加载状态
  isFormSearchBtn?: boolean; // 是否显示 form 按钮 搭配插槽 formSearch 一起使用
  isExpandAllRows?: boolean; // 控制展开所有行
  isDragVisible?: boolean; // 是否允许拖拽行 搭配 class drop-row-btn
}
interface ISortTableEnd {
  newIndex: number;
  oldIndex: number;
}
//#endregion

// #region props
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
  scroll: null,
  keywordPlaceholder: "",
  isSelectedRowKeys: false,
  loading: false,
  isFormSearchBtn: false,
  isExpandAllRows: false,
  isDragVisible: false,
});
// #endregion
// #region emits
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
//#endregion

// 内置搜索
const formSeach = reactive<any>({});

const pages = reactive<IPages>(props.pages);
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
  props.isExpandAllRows && expandAllRows();

  props.isDragVisible && rowDrop();
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
  if (!isChildren) return;

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

// 行拖拽
const rowDrop = () => {
  const tbody = document.querySelector(
    ".ant-table-container .ant-table-content tbody"
  );
  const _this = this;
  let nowDrageRow = 0; // 当前拖拽的索引
  const sortable = Sortable.create(tbody, {
    animation: 200,
    handle: ".drop-row-btn", // 指定只能选中 drop-row-btn
    onEnd({ newIndex, oldIndex }: ISortTableEnd) {
      console.log("newIndex, oldIndex", newIndex, oldIndex);

      // const currRow = _this.fofList.splice(oldIndex, 1)[0];
      // _this.list.splice(newIndex, 0, currRow);
      // _this.list.forEach((item, index) => {
      //   item.orderNum = index + 1;
      // });
      //获取拖动后容器中的每一项的位置排序
      const arr = sortable.toArray();
      console.log("位置排序", arr);
    },
    // 开始拖拽的时候
    onStart: function (evt: any) {
      console.log("evt", evt, evt.oldIndex);

      nowDrageRow = evt.oldIndex;
    },
  });
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
  pages.pageSize = pagination.pageSize;
  pages.current = pagination.current;
  pages.total = pagination.total;
  // const page: IPages = {
  //   pageSize: pagination.pageSize,
  //   current: pagination.current,
  //   total: pagination.total,
  // };
  console.log("pages", pages);

  emits("onPagesChange", pages);
  //   console.log(pagination, filters, sorter, currentDataSource, "current, size");
};

// 选中显示表格列
const handleCheckboxChange = () => {
  const arr = [];
  const _columns = unref(columnStorages);
  _columns.forEach((item) => {
    if (unref(menuChecked).includes(item.dataIndex)) {
      arr.push(item);
    }
  });
  // 操作,默认需要
  arr.push(_columns[_columns.length - 1]);
  emits("onColumnChange", arr);
};
// 显示与隐藏 form
const handleOpenSearch = () => {
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
const handleSearchBlur = () => {
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
/**
 * @description 表单搜索配置项
 */
const formColumns = computed(() => {
  const columns = props.columns ? props.columns : [];
  const rowColumns: IColumns[][] = [];
  let count = 0;
  columns
    .filter((item) => item.search)
    .forEach((item, index) => {
      if (index % 4 === 0) {
        rowColumns[count] = [];
        count++;
      }
      // console.log(rowColumns[count - 1], count, index);
      rowColumns[count - 1].push(item);
    });
  return rowColumns;
});

const columnsComputed = computed(() => {
  const columns = props.columns ? props.columns : [];
  const _columns = columns.map((column) => {
    if (column.minWidth) {
      column.customHeaderCell = () => {
        return {
          style: {
            minWidth: column.minWidth + "px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          },
        };
      };
    }
    return column;
  });
  return _columns;
});
</script>

<template>
  <div class="default-main">
    <div class="container-table">
      <!-- formSearch -->
      <Transition name="zoom-in">
        <div v-show="isOpenSearch && formColumns.length" class="i-table-form">
          <slot name="formSearch">
            <div class="i-table-form-default">
              <a-form
                :model="formSeach"
                layout="inline"
                name="basic"
                autocomplete="off"
                class="i-table-form"
                v-bind="props.formOptions"
              >
                <a-row
                  v-for="(arr, index) in formColumns"
                  :key="index"
                  style="width: 100%"
                >
                  <a-col
                    v-for="item in arr"
                    :key="item.dataIndex"
                    :span="item.span || 6"
                  >
                    <a-form-item
                      :label="item.title"
                      :name="item.dataIndex"
                      class="i-form-item"
                    >
                      <slot :name="`${item.dataIndex}Search`">
                        <!-- input 输入框 -->
                        <a-input
                          v-if="!item.type || item.type === 'input'"
                          v-model:value="formSeach[item.dataIndex]"
                          allow-clear
                          :placeholder="item.title || item.placeholder"
                        />
                        <!-- select 下拉框 -->
                        <a-select
                          v-else-if="item.type === 'select'"
                          v-model:value="formSeach[item.dataIndex]"
                          allow-clear
                          :placeholder="item.title || item.placeholder"
                        >
                          <a-select-option
                            v-for="option in item.options"
                            :key="option.value"
                            :value="option.value"
                          >
                            {{ option.label }}
                          </a-select-option>
                        </a-select>
                        <!-- radio 单选框 -->
                        <a-radio-group
                          v-else-if="item.type === 'radio'"
                          v-model:value="formSeach[item.dataIndex]"
                        >
                          <a-radio
                            v-for="option in item.options"
                            :key="option.value"
                            :value="option.value"
                          >
                            {{ option.label }}
                          </a-radio>
                        </a-radio-group>
                      </slot>
                    </a-form-item>
                  </a-col>
                </a-row>
              </a-form>
              <a-space class="i-form-operate">
                <a-button type="primary">查询</a-button>
                <a-button>重置</a-button>
              </a-space>
            </div>
          </slot>
        </div>
      </Transition>
      <div class="table-header">
        <a-space>
          <ITooltip title="刷新" type="reload">
            <template #icon>
              <SyncOutlined
                @click="onReload"
                style="color: #fff; font-size: 14px"
              />
            </template>
          </ITooltip>
          <!-- 左侧按钮 可自定义左侧按钮内容 -->
          <slot name="leftBtn"></slot>
        </a-space>
        <a-space>
          <a-input
            :placeholder="props.keywordPlaceholder"
            v-model:value="keyword"
            @blur="handleSearchBlur"
            allow-clear
            class="table-header_search"
          />
          <a-radio-group v-model:value="menuOrSearch" style="display: flex">
            <a-popover
              v-model:visible="isDropdownVisible"
              trigger="click"
              overlayClassName="i-popover-menu"
            >
              <template #content>
                <a-checkbox-group
                  v-model:value="menuChecked"
                  style="width: 100%"
                  @change="handleCheckboxChange"
                >
                  <label
                    class="i-popover-item d-block"
                    style="text-align: left"
                    v-for="item in menuCheckList"
                    :key="item.key || item.dataIndex"
                  >
                    <a-checkbox
                      :value="item.key || item.dataIndex"
                      style="white-space: nowrap"
                    >
                      {{ item.title }}
                    </a-checkbox>
                  </label>
                </a-checkbox-group>
              </template>
              <a-radio-button value="menu">
                <TableOutlined title="筛选" />
              </a-radio-button>
            </a-popover>
            <a-tooltip>
              <template #title v-if="!isOpenSearch"> 展开通用搜索 </template>
              <a-radio-button
                value="search"
                @click="handleOpenSearch"
                v-if="isFormSearchBtn && formColumns.length"
              >
                <SearchOutlined />
              </a-radio-button>
            </a-tooltip>
          </a-radio-group>
        </a-space>
      </div>
      <a-table
        :row-selection="props.isSelectedRowKeys ? rowSelection : null"
        :data-source="dataSource"
        :loading="props.loading"
        :columns="columnsComputed"
        :scroll="props.scroll || { x: true }"
        v-model:expandedRowKeys="expandedRowKeys"
        bordered
        :size="props.size || 'small'"
        @resize-column="handleResizeColumn"
        @change="handlePageSizeChange"
        :pagination="{
          showQuickJumper: true,
          showSizeChanger: true,
          total: pages.total,
          pageSize: pages.pageSize,
          current: pages.current,
          showTotal: (total) => `共 ${total} 条`,
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
