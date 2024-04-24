<!-- 通用表格 -->
<script setup lang="ts">
import {computed, inject} from "vue";
import {EditOutlined, PlusOutlined, ZoomInOutlined,} from "@ant-design/icons-vue";
import {sortNumber} from "@/utils/common";
import {TableSettingsType} from "@/types/tableSettingsType";
import {tableSettingKey} from "@/utils/tableSettings";

const tableSettings = inject<TableSettingsType>(tableSettingKey, {} as any);

const table = computed(() => tableSettings?.table)

const operations = computed(() => table.value?.operations || []);

const selectedRowKeys = computed(
  () => table.value?.selectedRowKeys || []
);

const rowSelection = computed(() => ({
  selectedRowKeys: table.value?.selectedRowKeys,
  onChange: tableSettings?.selectChange,
}));

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
      :refresh="operations.includes('refresh')"
      @refresh="tableSettings?.queryAll"
      @query="tableSettings?.queryAll"
      @reset="tableSettings?.queryAll"
      @pages-change="tableSettings?.pagesChange"
    >
      <template #leftActions>
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
          <template #content>
            <delete-popconfirm
              placement="rightTop"
              :disabled="!selectedRowKeys.length"
              @confirm="tableSettings?.deleteByIds('delete', selectedRowKeys)"
            />
          </template>
        </i-tooltip>
        <expand-all-rows-tooltip
          v-if="operations.includes('expand')"
          v-model:expand="table.defaultExpandAllRows"
          :disabled="!table.dataSource.length"
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
            v-if="operations.includes('row-detail')"
            :title="$t('title.detail')"
            size="small"
            @click="
              tableSettings?.openDetail(record[table.rowKey])
            "
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
            <template #content>
              <delete-popconfirm
                type="table-row"
                @confirm="tableSettings?.deleteByIds('row-delete', [record.id])"
              />
            </template>
          </i-tooltip>
        </a-space>
      </template>
    </i-table>
  </div>
  <!--  表单自定义 需要带上 form 前缀  -->
  <custom-form-modal v-if="table?.fieldModalVisible">
    <template #formItem="score">
      <slot :name="`form-${score.column.dataIndex}`" v-bind="score"/>
    </template>
  </custom-form-modal>
</template>
