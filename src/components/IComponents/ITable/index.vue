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
import Sortable from "sortablejs";
import {IColumns, IDataSource, IPages, IPagination} from "@/types";
import {FormInstance, FormProps, TableProps} from "ant-design-vue";
import {useI18n} from "vue-i18n";
import ITooltip from "@/components/IComponents/ITooltip/index.vue";
import {cloneDeep, throttle} from "lodash-es";

// 国际化
const {locale, t} = useI18n();

//#region interface
interface I18nPrefix {
  table: string;
  columns: string;
}

interface IProps {
  columns: IColumns[]; // 表格列的配置描述
  dataSource: TableProps['dataSource']; // 数据数组
  rowSelection?: TableProps['rowSelection']; // 表格行是否可选择
  pagination?: TableProps['pagination']; // 指定每页可以显示多少条
  pages?: IPages; // 页码
  formOptions?: FormProps;
  tableOptions?: TableProps;
  size?: TableProps['size']; // 表格大小
  rowKey?: TableProps['rowKey']; // 表格行 key 的取值
  scroll?: TableProps['scroll']; // 设置横向或纵向滚动，也可用于指定滚动区域的宽和高
  i18nPrefix?: I18nPrefix; // 国际化前缀
  childrenColumnName?: TableProps['childrenColumnName']; // 指定树形结构的列名 默认 children
  keywordPlaceholder?: string; // 关键字搜索框 占位内容
  keywordVisible?: boolean; // 是否显示关键字搜索框
  loading?: boolean; // 表格加载状态
  defaultExpandAllRows?: boolean; // 控制展开所有行
  draggable?: boolean; // 是否允许拖拽行 搭配 class drop-row-btn
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
  size: "small",
  rowKey: "key",
  childrenColumnName: 'children', // 默认 'children'
  scroll: () => ({x: true}),
  i18nPrefix: () => ({table: "table", columns: "columns"}),
  keywordPlaceholder: undefined, // t("placeholder.keyword")
  keywordVisible: true,
  loading: false,
  defaultExpandAllRows: false,
  draggable: false,
});
const emits = defineEmits([
  "pagesChange", // 页码发生变化时
  "reload", // 刷新表格
  "searchBlur", // 表格搜索
  "query",
  "reset",
]);
// #endregion
const columnsCache: IColumns[] = cloneDeep(props.columns); // 缓存 columns

// 内置搜索
const formRef = ref<FormInstance>();
const formSearch = reactive<any>({});

const menuChecked = ref<string[]>([]); // 选中显示隐藏表头
const menuCheckList = ref<IColumns[]>([]); // 表头的数据列
const pages = toRef(props, "pages"); // 分页
const columns = toRef(props, "columns"); // 表格列配置项
const expandedRowKeys = ref<string[]>([]);
const oldKeyword = ref<string>(""); // 旧的 搜索内容 防止重复调用接口
const keyword = ref<string>(""); // 搜索
const menuOrSearch = ref<string>("menu");
const isDropdownVisible = ref<boolean>(false);
const isOpenSearch = ref<boolean>(false); // 展开搜索栏区域

onMounted(() => {
  // 修改 columns
  menuCheckList.value = columns.value.filter(
      (item) => ![item.dataIndex, item.key].includes("operation")
  );
  menuChecked.value = unref(menuCheckList).map((item) => item.dataIndex);

  // 默认是否展开
  props.defaultExpandAllRows && expandAllRows();

  props.draggable && rowDrop();
});

/**
 * @description 节流刷新表格
 */
const onReload = throttle(() => {
  emits("reload");
}, 500);

// 监听 展开收起
watch(
    () => props.defaultExpandAllRows,
    () => expandAllRows()
);

/**
 * @description 获取行的 key
 * @param record
 */
const getRowKey = (record) => {
  const rowKey = props.rowKey;
  if (typeof rowKey === "function") return rowKey(record)
  return rowKey || "key";
}

// 展开收起 - 内置 务必添加 key
const expandAllRows = () => {
  const childrenColumnName = props.childrenColumnName;
  let keys: string[] = [];
  if (props.defaultExpandAllRows) {
    // 递归 children key值
    void (function childrenFn(list: IDataSource[]) {
      list.forEach((item) => {
        const rowKey = getRowKey(item)
        // 是否存在 key
        if (!item[rowKey]) throw new Error("no key in" + JSON.stringify(item));
        keys.push(item[rowKey]);
        //若子数组存在 children 继续递归
        if (item[childrenColumnName]) childrenFn(item[childrenColumnName]);
      });
    })(props.dataSource);
  } else {
    keys = [];
  }
  expandedRowKeys.value = keys;
};

// 行拖拽
const rowDrop = (out: number[]) => {
  const tbody = document.querySelector(
      ".ant-table-container .ant-table-content tbody"
  );
  let nowDragRow = 0; // 当前拖拽的索引
  const sortable = Sortable.create(tbody, {
    animation: 200,
    handle: ".drop-row-btn", // 指定只能选中 drop-row-btn
    onEnd({newIndex, oldIndex}: ISortTableEnd) {
      console.log("newIndex, oldIndex", newIndex, oldIndex);
      //获取拖动后容器中的每一项的位置排序
      // const arr = sortable.toArray(out);
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
 */
const handlePageSizeChange = (
    pagination: TableProps['pagination'],
) => {
  if (!pagination) throw new Error("pagination is undefined");
  const {current = 1, pageSize = 10, total = 0} = pagination;
  pages.value = {
    size: pageSize,
    page: current,
    total: total
  }
  emits("pagesChange", pages.value);
};

// 选中显示表格列
const handleCheckboxChange = () => {
  const arr: IColumns[] = []
  const _columns = cloneDeep(columnsCache);
  _columns.forEach((item: IColumns) => {
    if (unref(menuChecked).includes(item.dataIndex)) {
      arr.push(item);
    }
  });
  arr.push(_columns[_columns.length - 1]);
  // 操作,默认需要
  columns.value.length = 0
  columns.value.push(...arr);
};
// 显示与隐藏 form
const handleOpenSearch = () => {
  isOpenSearch.value = !unref(isOpenSearch);
};
// 表格可伸缩
const handleResizeColumn = (w: number, col: any) => {
  col.width = w;
};

/**
 * @description 表格上方搜索框失焦 搜索 input blur 事件
 */
const handleSearchBlur = () => {
  // 当新数据 = 旧数据 不传输事件
  if (keyword.value === oldKeyword.value) return;
  oldKeyword.value = keyword.value;
  emits("searchBlur", keyword.value);
};

const pagination = computed(() => {
  return props.pagination === false ? false : {
    showQuickJumper: true,
    showSizeChanger: true,
    showTotal: showTotal,
    total: pages.value.total,
    pageSize: pages.value.size,
    current: pages.value.page,
  }
})

/**
 * @description 表单搜索配置项
 */
const formColumns = computed(() => {
  const rowColumns: IColumns[][] = [];
  let count = 0;
  columns.value
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
  return columns.value.map((column: IColumns) => {
    column.customHeaderCell = (column) => {
      if (column.minWidth) {
        return {
          style: {
            ...column.style,
            minWidth: (column.minWidth) + 'px',
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          },
        };
      } else {
        return {
          style: {
            ...column.style,
            width: (column.width) + 'px',
          },
        };
      }
    };
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

const localesNameFn = (column: IColumns) => {
  if (!props.i18nPrefix) return column.title;
  const il8nName = (column.dataIndex || column.i18nName) as string;
  const {table = 'table', columns = 'columns'} = props.i18nPrefix;
  return table + "." + columns + "." + il8nName
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
                            :picker="item.dateType"
                            v-bind="item.propOptions"
                        />
                      </slot>
                    </a-form-item>
                  </a-col>
                </a-row>
              </a-form>
              <a-space class="i-form-operation">
                <a-button type="primary" @click="onQuery">查询</a-button>
                <a-button @click="onReset">重置</a-button>
              </a-space>
            </div>
          </slot>
        </div>
      </transition>
      <div class="table-header">
        <a-space>
          <i-tooltip
              :title="$t('title.refresh')"
              type="reload"
              @click="onReload"
          >
            <template #icon>
              <reload-outlined
                  :spin="props.loading"
                  style="color: #fff; font-size: 14px"
              />
            </template>
          </i-tooltip>
          <!-- 左侧按钮 可自定义左侧按钮内容 -->
          <slot name="leftActions"></slot>
        </a-space>
        <!-- 右侧功能区域 -->
        <a-space>
          <a-input
              v-if="keywordVisible"
              v-model:value="keyword"
              :placeholder="props.keywordPlaceholder || $t('placeholder.keyword')"
              allow-clear
              class="table-header_search"
              @blur="handleSearchBlur"
          />
          <a-radio-group v-model:value="menuOrSearch" class="flex">
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
                      class="i-popover-item block"
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
              <a-radio-button value="menu" :title="$t('title.filter')">
                <table-outlined/>
              </a-radio-button>
            </a-popover>
            <a-tooltip>
              <template #title v-if="!isOpenSearch">{{ $t('placeholder.expandUniversalSearch') }}</template>
              <a-radio-button
                  v-if="formColumns.length"
                  value="search"
                  @click="handleOpenSearch"
              >
                <search-outlined/>
              </a-radio-button>
            </a-tooltip>
          </a-radio-group>
        </a-space>
      </div>
      <a-table
          v-model:expanded-row-keys="expandedRowKeys"
          :row-key="props.rowKey"
          :row-selection="props.rowSelection"
          :data-source="props.dataSource"
          :loading="props.loading"
          :columns="columnsComputed"
          :children-column-name="props.childrenColumnName"
          :scroll="props.scroll"
          :size="props.size"
          :pagination="pagination"
          bordered
          @resize-column="handleResizeColumn"
          @change="handlePageSizeChange"
      >
        <template #headerCell="{column}">
          <slot name="headerCell">
            <template v-for="item in columnsComputed" :key="item.dataIndex">
              <template v-if="item.dataIndex === column.dataIndex && item.isI18n">
                {{ $t(localesNameFn(item)) }}
              </template>
            </template>
          </slot>
        </template>
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
