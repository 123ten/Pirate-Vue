<!-- 通用表格 -->
<script setup lang="ts">
import {computed, inject, useSlots} from "vue";
import {DragOutlined, EditOutlined, PlusOutlined, ReloadOutlined, ZoomInOutlined} from "@ant-design/icons-vue";
import {sortNumber} from "@/utils/common";
import {TableSettingsType} from "@/types/tableSettingsType";
import {tableSettingKey} from "@/utils/tableSettings";
import ITooltip from "@/components/IComponents/ITooltip/index.vue";

const slots = useSlots()

const tableSettings = inject<TableSettingsType>(tableSettingKey, {} as any);

const table = computed(() => tableSettings?.table)

/** @param operations {Operation[]} 展示的操作按钮 */
const operations = computed(() => table.value?.operations || []);

const selectedRowKeys = computed(
  () => table.value?.selectedRowKeys || []
);

const rowSelection = computed(() => ({
  selectedRowKeys: table.value?.selectedRowKeys,
  onChange: tableSettings?.selectChange,
}));

/** @param hasTableChild {boolean} 列表数据是否有 children */
const hasTableChild = computed(() => operations.value.includes('expand') && table.value?.dataSource?.some(item => item.children?.length))

/** @param expandAllRowsDisabled {boolean} 是否禁用 展开/收起 按钮 */
const expandAllRowsDisabled = computed(() => operations.value.includes('expand') && table.value?.dataSource?.length && hasTableChild.value)

defineOptions({
  name: "CustomTable",
});
</script>

<template>
  <div class="box-border p-4">
    <i-table
      v-bind="table"
      :model="table.queryForm"
      :row-selection="rowSelection"
      :default-span="table.defaultSpan"
      @refresh="tableSettings?.queryAll"
      @query="tableSettings?.queryAll"
      @reset="tableSettings?.queryAll"
      @pages-change="tableSettings?.pagesChange"
    >
      <template #leftActions>
        <i-tooltip
          v-if="operations.includes('refresh')"
          :title="$t('title.refresh')"
          type="refresh"
          @click="tableSettings?.queryAll"
        >
          <template #icon>
            <reload-outlined :spin="tableSettings.table.loading"/>
          </template>
        </i-tooltip>
        <i-tooltip
          v-if="operations.includes('create')"
          :title="$t('title.create')"
          :content="$t('title.create')"
          @click="tableSettings?.openForm(0)"
        >
          <template #icon>
            <plus-outlined/>
          </template>
        </i-tooltip>
        <i-tooltip
          v-if="operations.includes('delete')"
          :title="$t('title.remove_selected_row')"
        >
          <delete-popconfirm
            placement="rightTop"
            size="middle"
            :button-text="$t('title.delete')"
            :disabled="!selectedRowKeys.length"
            @confirm="tableSettings?.deleteByIds('delete', selectedRowKeys)"
          />
        </i-tooltip>
        <expand-all-rows-tooltip
          v-if="operations.includes('expand')"
          v-model:expand="table.defaultExpandAllRows"
          :disabled="!expandAllRowsDisabled"
        />
      </template>
      <template #number="{ index }">
        {{ sortNumber(index, table.pages) }}
      </template>
      <template #bodyCell="score">
        <slot name="bodyCell" v-bind="score"/>
        <slot :name="score.column.dataIndex" v-bind="score"></slot>
      </template>
      <template #operation="{ record }">
        <a-space>
          <i-tooltip
            v-if="operations.includes('row-sortable')"
            title="拖动以排序"
            size="small"
            type="info"
            class="drop-row-btn"
          >
            <template #icon>
              <drag-outlined/>
            </template>
          </i-tooltip>
          <i-tooltip
            v-if="operations.includes('row-detail')"
            :title="$t('title.detail')"
            size="small"
            @click="tableSettings?.openDetail(record[table.rowKey!])"
          >
            <template #icon>
              <zoom-in-outlined/>
            </template>
          </i-tooltip>
          <i-tooltip
            v-if="operations.includes('row-update')"
            :title="$t('title.update')"
            size="small"
            @click="tableSettings?.openForm(1, record.id)"
          >
            <template #icon>
              <edit-outlined/>
            </template>
          </i-tooltip>
          <i-tooltip
            v-if="operations.includes('row-delete')"
            :title="$t('title.delete')"
          >
            <delete-popconfirm
              size="small"
              @confirm="tableSettings?.deleteByIds('row-delete', [record.id])"
            />
          </i-tooltip>
        </a-space>
      </template>
    </i-table>

    <!--  表单自定义 需要带上 form 前缀  -->
    <custom-form-modal v-if="table?.displayFormModal">
      <template #field="score">
        <template v-if="score.column.formSlot !== false">
          <slot :name="`form-${score.column.dataIndex}`" v-bind="score"/>
        </template>
      </template>
    </custom-form-modal>

    <!--  详情自定义 需要带上 detail 前缀  -->
    <custom-detail-modal v-if="table?.displayDetailModal">
      <template #field="score">
        <template v-if="score.column.detailSlot !== false">
          <slot :name="`detail-${score.column.dataIndex}`" v-bind="score"/>
        </template>
      </template>
    </custom-detail-modal>
  </div>
</template>
