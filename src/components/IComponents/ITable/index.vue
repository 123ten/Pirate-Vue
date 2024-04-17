<!-- 角色组管理 -->
<script setup lang="ts">
import {InfoCircleFilled, ReloadOutlined, SearchOutlined, TableOutlined,} from "@ant-design/icons-vue";
import {computed, defineEmits, defineExpose, defineProps, onMounted, ref, toRaw, watch, withDefaults,} from "vue";
import Sortable from "sortablejs";
import {IColumns, IPagination, RecordType} from "@/types";
import {FormInstance} from "ant-design-vue";
import {useI18n} from "vue-i18n";
import ITooltip from "@/components/IComponents/ITooltip/index.vue";
import {cloneDeep, throttle} from "lodash-es";
import {ITableProps} from "@/types/table";
import QueryForm from './components/QueryForm/index.vue'
import QueryFormItem from './components/QueryFormItem/index.vue'
import Ellipsis from "@/components/IComponents/IOther/Ellipsis/index.vue";

// 国际化
const {locale} = useI18n();

//#region interface
interface ISortTableEnd {
  newIndex: number;
  oldIndex: number;
}

// 菜单/搜索
type OperationRadioType = 'menu' | 'search';

//#endregion

// #region props/emits
const props = withDefaults(defineProps<ITableProps>(), {
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
  operationKey: 'operation', // 默认操作列的 Key名
  size: "small",
  rowKey: "key",
  childrenColumnName: 'children', // 默认 'children'
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
console.log('columnsCache', columnsCache)
const formRef = ref<FormInstance>();

const menuChecked = ref<(IColumns['dataIndex'] | IColumns['key'])[]>([]); // 选中显示隐藏表头
const menuCheckList = ref<IColumns[]>([]); // 表头的数据列
const expandedRowKeys = ref<string[]>([]);
const oldKeyword = ref<string>(""); // 旧的 搜索内容 防止重复调用接口
const keyword = ref<string>(""); // 搜索
const operationRadio = ref<OperationRadioType | undefined>();
const isOpenSearch = ref<boolean>(false); // 展开搜索栏区域
const menuCheckAll = ref<boolean>(true); // 全选

onMounted(() => {
  // 修改 columns
  menuCheckList.value = columnsCache.filter((item) => ![item.dataIndex, item.key].includes(props.operationKey));
  menuChecked.value = menuCheckList.value.map((item) => item.dataIndex);

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

// 监听 menuChecked
watch(
    () => menuChecked.value,
    (menuChecked) => {
      menuCheckAll.value = menuChecked.length === menuCheckList.value.length;
    }
)

/**
 * @description: 有值置空 没有赋值
 * @param key
 */
const handleMenuOrSearchRadio = (key: OperationRadioType) => {
  operationRadio.value = operationRadio.value === key ? undefined : key;
  if (key === 'search') {
    isOpenSearch.value = !isOpenSearch.value;
  }
}

const handleMenuCheckAll = () => {
  if (menuCheckAll.value) {
    menuChecked.value = []
  } else {
    menuChecked.value = menuCheckList.value.map((item) => item.dataIndex);
  }
}

/**
 * @description 获取行的 key
 * @param record
 */
const getRowKey = (record: RecordType) => {
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
    void (function childrenFn(list: RecordType[]) {
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
const rowDrop = (out?: number[]) => {
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
    pagination: IPagination,
) => {
  if (!pagination) throw new Error("pagination is undefined");
  const {current = 1, pageSize = 10, total = 0} = pagination;
  const pages = {
    size: pageSize,
    page: current,
    total: total
  }
  emits("pagesChange", pages);
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
    total: props.pages.total,
    pageSize: props.pages.size,
    current: props.pages.page,
  }
})

/**
 * @description 表单搜索配置项 使用缓存的 columns
 */
const formColumns = computed(() => {
  const rowColumns: IColumns[][] = [];
  let count = 0;
  columnsCache
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
  return cloneDeep(columnsCache).filter((column: IColumns) => [...menuChecked.value, props.operationKey].includes(column.key || column.dataIndex))
});

/**
 * @description 搜索查询
 */
const onQuery = () => {
  emits("query", toRaw(props.model));
};

const onReset = () => {
  formRef.value?.resetFields()
  emits("reset");
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
      <a-alert
          v-if="props.remark"
          :message="props.remark"
          type="gray"
          show-icon
          closable
      >
        <template #icon>
          <info-circle-filled style="color: #909399"/>
        </template>
      </a-alert>
      <!-- queryForm -->
      <transition name="zoom-in">
        <!-- z-0 层级低于 table-header -->
        <div
            v-if="isOpenSearch && formColumns.length"
            class="i-table-form relative z-0 pb-0 origin-bottom overflow-hidden"
        >
          <slot name="queryForm">
            <query-form
                ref="formRef"
                :model="model"
                :columns="formColumns"
                @keyup.enter.native="onQuery"
                @query="onQuery"
                @reset="onReset"
                v-bind="props.formOptions"
            >
              <template #default="scope">
                <slot v-bind="scope">
                  <query-form-item :column="scope.column" :model="model"/>
                </slot>
              </template>
            </query-form>
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
                  class="w-[1em] h-[1em]"
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
          <a-radio-group v-model:value="operationRadio" class="flex">
            <a-popover
                trigger="click"
                overlayClassName="i-popover-menu"
            >
              <template #content>
                <!--  全选  -->
                <label
                    class="i-popover-item block"
                    style="text-align: left"
                >
                  <a-checkbox v-model:checked="menuCheckAll" class="whitespace-nowrap" @click="handleMenuCheckAll">
                    全选
                  </a-checkbox>
                </label>
                <!--  这是两部分  -->
                <a-checkbox-group
                    v-model:value="menuChecked"
                    class="w-[100%]"
                >
                  <label
                      v-for="item in menuCheckList"
                      :key="item.key || item.dataIndex"
                      class="i-popover-item block"
                      style="text-align: left"
                  >
                    <a-checkbox
                        :value="item.key || item.dataIndex"
                        class="whitespace-nowrap"
                    >
                      {{ item.title }}
                    </a-checkbox>
                  </label>
                </a-checkbox-group>
              </template>
              <a-radio-button
                  value="menu"
                  :title="$t('title.filter')"
                  @click="handleMenuOrSearchRadio('menu')"
              >
                <table-outlined/>
              </a-radio-button>
            </a-popover>
            <a-tooltip placement="bottomRight">
              <template #title v-if="!isOpenSearch">
                {{ $t('placeholder.expandUniversalSearch') }}
              </template>
              <a-radio-button
                  v-if="formColumns.length"
                  value="search"
                  @click="handleMenuOrSearchRadio('search')"
              >
                <search-outlined/>
              </a-radio-button>
            </a-tooltip>
          </a-radio-group>
        </a-space>
      </div>
      <a-table
          v-model:expanded-row-keys="expandedRowKeys"
          :row-key="rowKey"
          :row-selection="rowSelection"
          :data-source="dataSource"
          :loading="loading"
          :columns="columnsComputed"
          :children-column-name="childrenColumnName"
          :scroll="scroll"
          :size="size"
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
          <slot name="bodyCell" v-bind="score"/>
          <slot :name="score.column.dataIndex" v-bind="score">
            <ellipsis v-if="score.column.ellipsis" :value="score.value" tooltip/>
          </slot>
        </template>
      </a-table>
    </div>
  </div>
</template>

<style lang="less" scoped>
@import "index.less";
</style>
