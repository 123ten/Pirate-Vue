<!-- 通用表格 -->
<script setup lang="ts">
import {computed, inject} from "vue";
import {EditOutlined, PlusOutlined, ZoomInOutlined} from "@ant-design/icons-vue";
import {sortNumber} from "@/utils/common";
import {TableSettingsType} from "@/types/tableSettingsType";
import {tableSettingKey} from "@/utils/tableSettings";

const tableSettings = inject<TableSettingsType>(tableSettingKey)

const operations = computed(() => tableSettings?.table.operations || [])
const selectedRowKeys = computed(() => tableSettings?.table.selectedRowKeys || [])

const rowSelection = computed(() => ({
  selectedRowKeys: tableSettings?.table.selectedRowKeys,
  onChange: tableSettings?.selectChange,
}))

defineOptions({
  name: 'CustomITable',
})
</script>

<template>
  <div class="box-border p-4">
    <i-table
        v-if="tableSettings"
        :row-key="tableSettings.table.rowKey"
        :columns="tableSettings.table.columns"
        :dataSource="tableSettings.table.dataSource"
        :pages="tableSettings.table.pages"
        :loading="tableSettings.table.loading"
        :remark="tableSettings.table.remark"
        :model="tableSettings.table.queryForm"
        :i18n-prefix="tableSettings.table.i18nPrefix"
        :row-selection="rowSelection"
        :refresh="operations.includes('refresh')"
        @refresh="tableSettings.queryAll"
        @query="tableSettings.queryAll"
        @reset="tableSettings.queryAll"
        @pages-change="tableSettings.pagesChange"
    >
      <template #leftActions>
        <i-tooltip
            v-if="operations.includes('create')"
            :title="$t('title.create')"
            :content="$t('title.create')"
            @click="tableSettings.openForm(0)"
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
                @confirm="tableSettings.deleteByIds('delete',selectedRowKeys)"
            />
          </template>
        </i-tooltip>
        <!--        <expand-all-rows-tooltip-->
        <!--            v-model:expand="defaultExpandAllRows"-->
        <!--            :disabled="!dataSource.length"-->
        <!--        />-->
      </template>
      <template #number="{index}">
        {{ sortNumber(index, tableSettings.table.pages) }}
      </template>
      <template #bodyCell="score">
        <slot name="bodyCell" v-bind="score"/>
        <slot :name="score.column.dataIndex" v-bind="score">
        </slot>
      </template>
      <template #operation="{ record }">
        <a-space>
          <i-tooltip
              v-if="operations.includes('row-detail')"
              :title="$t('title.detail')"
              size="small"
              @click="tableSettings.openDetail(record[tableSettings.table.rowKey])"
          >
            <template #icon>
              <zoom-in-outlined/>
            </template>
          </i-tooltip>
          <i-tooltip
              v-if="operations.includes('row-update')"
              :title="$t('title.update')"
              size="small"
              @click="tableSettings.openForm(1, record.id)"
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
                  @confirm="tableSettings.deleteByIds('row-delete',[record.id])"
              />
            </template>
          </i-tooltip>
        </a-space>
      </template>
    </i-table>
  </div>
</template>

