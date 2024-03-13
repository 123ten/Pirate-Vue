<!-- 角色组管理 -->
<script setup lang="ts">
import {ReloadOutlined, SearchOutlined, TableOutlined,} from "@ant-design/icons-vue";
import {
  computed,
  defineEmits,
  defineExpose,
  defineProps,
  onMounted,
  reactive,
  ref,
  toRef,
  unref,
  watch,
  withDefaults,
} from "vue";
import {ColumnFilterItem} from "ant-design-vue/es/table/interface";
import Sortable from "sortablejs";
import {IColumns, IDataSource, IPages, IPagination} from "@/types";
import {FormInstance} from "ant-design-vue";
import {useI18n} from "vue-i18n";
import ITooltip from "@/components/IComponents/ITooltip/index.vue";

//#region interface
interface IProps {
  columns: IColumns[]; // 表格列的配置描述
  dataSource: IDataSource[]; //
  selectedRowKeys?: string[]; // 选中的表格多选
  pagination?: IPagination; // 指定每页可以显示多少条
  pages?: IPages; // 页码
  formOptions?: any;
  size?: "large" | "middle" | "small";
  scroll?: null;
  keywordPlaceholder?: string; // 关键字搜索框 占位内容
  keywordVisible?: boolean; // 是否显示关键字搜索框
  isSelectedRowKeys?: boolean; // 是否显示表格多选框
  loading?: boolean; // 表格加载状态
  isExpandAllRows?: boolean; // 控制展开所有行
  isDragVisible?: boolean; // 是否允许拖拽行 搭配 class drop-row-btn
}

interface ISortTableEnd {
  newIndex: number;
  oldIndex: number;
}

//#endregion

// #region props/emits
const props = withDefaults(defineProps<IProps>(), {
  columns: () => [],
  dataSource: () => [],
  selectedRowKeys: () => [],
  pagination: () => ({
    // 可能是这边的问题 要是有分页问题吧
    pageSize: 10,
    current: 1,
    total: 0,
  }),
  pages: () => ({
    size: 10,
    page: 1,
    total: 0,
  }),
  scroll: null,
  keywordPlaceholder: "请输入关键字",
  keywordVisible: true,
  isSelectedRowKeys: false,
  loading: false,
  isExpandAllRows: false,
  isDragVisible: false,
});
const emits = defineEmits([
  "selectChange", // 选中表格数据change事件
  "columnChange", // columns 发生变化时
  "pagesChange", // 页码发生变化时
  "reload", // 刷新表格
  "searchBlur", // 表格搜索
  "query",
  "reset",
]);
// #endregion

// 国际化
const {locale} = useI18n();

// 内置搜索
const formRef = ref<FormInstance>();
const formSearch = reactive<any>({});

const menuChecked = ref<string[]>([]); // 选中显示隐藏表头
const menuCheckList = ref<IColumns[]>([]); // 表头的数据列
const pages = toRef(props, "pages"); // 暂存 被删除的columns
const columnStorages = toRef(props, "columns"); // 暂存 被删除的columns
const dataSource = toRef(props, "dataSource");
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
  emits("reload");
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
  let nowDragRow = 0; // 当前拖拽的索引
  const sortable = Sortable.create(tbody, {
    animation: 200,
    handle: ".drop-row-btn", // 指定只能选中 drop-row-btn
    onEnd({newIndex, oldIndex}: ISortTableEnd) {
      console.log("newIndex, oldIndex", newIndex, oldIndex);
      //获取拖动后容器中的每一项的位置排序
      const arr = sortable.toArray();
      console.log("位置排序", arr);
    },
    // 开始拖拽的时候
    onStart: function (evt: any) {
      console.log("evt", evt, evt.oldIndex);

      nowDragRow = evt.oldIndex;
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
    {currentDataSource}: any
) => {
  pages.value = {
    size: pagination.pageSize,
    page: pagination.current,
    total: pagination.total
  }
  emits("pagesChange", pages.value);
};

// 选中显示表格列
const handleCheckboxChange = () => {
  const arr: IColumns[] = [];
  const _columns = unref(columnStorages);
  _columns.forEach((item: IColumns) => {
    if (unref(menuChecked).includes(item.dataIndex)) {
      arr.push(item);
    }
  });
  // 操作,默认需要
  arr.push(_columns[_columns.length - 1]);
  emits("columnChange", arr);
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
  emits("selectChange", changableRowKeys);
};
/**
 * @description 表格上方搜索框失焦 搜索 input blur 事件
 */
const handleSearchBlur = () => {
  // 当新数据 = 旧数据 不传输事件
  if (unref(keyword) === unref(oldKeyword)) return;
  oldKeyword.value = unref(keyword);
  emits("searchBlur", unref(keyword));
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
      .filter((column: IColumns) => column.search)
      .forEach((column: IColumns, index: number) => {
        const _span: number = Number(column.span || 4);
        if (index % _span === 0) {
          rowColumns[count] = [];
          count++;
        }
        rowColumns[count - 1].push(column);
      });
  return rowColumns;
});

/**
 * @description 表格列配置项
 */
const columnsComputed = computed(() => {
  const columns = props.columns || [];

  return columns.map((column: IColumns) => {
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
});

/**
 * @description 搜索查询
 */
const onQuery = () => {
  console.log("formSearch", formSearch);
  emits("query", formSearch);
};

const onReset = () => {
  emits("reset");
  if (formRef.value) {
    formRef.value.resetFields();
  }
};

/**
 * @description 显示总条数
 * @param total 总条数
 */
const showTotal = (total: number) => {
  if (locale.value === "en") return `Total ${total} items`;
  return `共 ${total} 条`;
};

defineExpose({
  formRef,
});
</script>

<template>
  <div class="default-main">
    <div class="container-table">
      <!-- formSearch -->
      <transition name="zoom-in">
        <div v-if="isOpenSearch && formColumns.length" class="i-table-form">
          <slot name="formSearch">
            <div class="i-table-form-default">
              <a-form
                  ref="formRef"
                  :model="formSearch"
                  layout="inline"
                  name="basic"
                  autocomplete="off"
                  class="i-table-form-search"
                  @keyup.enter.native="onQuery"
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
                            v-model:value="formSearch[item.dataIndex]"
                            allow-clear
                            :placeholder="item.title || item.placeholder"
                            v-bind="item.propOptions"
                        />
                        <!-- select 下拉框 -->
                        <a-select
                            v-else-if="item.type === 'select'"
                            v-model:value="formSearch[item.dataIndex]"
                            allow-clear
                            :placeholder="item.title || item.placeholder"
                            v-bind="item.propOptions"
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
                            v-model:value="formSearch[item.dataIndex]"
                            v-bind="item.propOptions"
                        >
                          <a-radio
                              v-for="option in item.options"
                              :key="option.value"
                              :value="option.value"
                          >
                            {{ option.label }}
                          </a-radio>
                        </a-radio-group>
                        <!-- date-picker 日期选择框 -->
                        <a-date-picker
                            v-else-if="item.type === 'date'"
                            v-model:value="formSearch[item.dataIndex]"
                            :picker="item.dataType"
                            v-bind="item.propOptions"
                        />
                      </slot>
                    </a-form-item>
                  </a-col>
                </a-row>
              </a-form>
              <a-space class="i-form-operate">
                <a-button type="primary" @click="onQuery">查询</a-button>
                <a-button @click="onReset">重置</a-button>
              </a-space>
            </div>
          </slot>
        </div>
      </transition>
      <div class="table-header">
        <a-space>
          <i-tooltip title="刷新" type="reload">
            <template #icon>
              <reload-outlined
                  @click="onReload"
                  :spin="props.loading"
                  style="color: #fff; font-size: 14px"
              />
            </template>
          </i-tooltip>
          <!-- 左侧按钮 可自定义左侧按钮内容 -->
          <slot name="leftBtn"></slot>
        </a-space>
        <!-- 左侧功能区域 -->
        <a-space>
          <a-input
              v-if="keywordVisible"
              v-model:value="keyword"
              :placeholder="props.keywordPlaceholder"
              allow-clear
              class="table-header_search"
              @blur="handleSearchBlur"
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
                <table-outlined title="筛选"/>
              </a-radio-button>
            </a-popover>
            <a-tooltip>
              <template #title v-if="!isOpenSearch"> 展开通用搜索</template>
              <a-radio-button
                  value="search"
                  @click="handleOpenSearch"
                  v-if="formColumns.length"
              >
                <search-outlined/>
              </a-radio-button>
            </a-tooltip>
          </a-radio-group>
        </a-space>
      </div>
      <a-table
          v-model:expanded-row-keys="expandedRowKeys"
          :row-selection="props.isSelectedRowKeys ? rowSelection : null"
          :data-source="dataSource"
          :loading="props.loading"
          :columns="columnsComputed"
          :scroll="props.scroll || { x: true }"
          :size="props.size || 'small'"
          :pagination="{
          showQuickJumper: true,
          showSizeChanger: true,
          showTotal: showTotal,
          total: pages.total,
          pageSize: pages.size,
          current: pages.page,
          pagination: props.pagination,
        }"
          bordered
          @resize-column="handleResizeColumn"
          @change="handlePageSizeChange"
      >
        <template #bodyCell="score">
          <slot name="bodyCell" v-bind="score"></slot>
          <slot :name="score.column.dataIndex" v-bind="score"></slot>
        </template>
      </a-table>
    </div>
  </div>
</template>

<style lang="less" scoped>
@import "index.less";
</style>