<!-- 角色组管理 -->
<script setup lang="ts">
import {
  SyncOutlined,
  PlusOutlined,
  DeleteOutlined,
  TableOutlined,
  SearchOutlined,
  EditOutlined,
} from "@ant-design/icons-vue";
import { computed, onMounted, reactive, ref, unref } from "vue";

interface IColumns {
  title: string;
  dataIndex: string;
  key: string;
  align: string; // 表格对齐方式 center | left | right
  fixed?: string; // 表头左右固定 left | right
  // responsive?: string[];
  width?: number | string; // 表头宽度

  resizable?: boolean; // 表头是否可伸缩
  minWidth?: number; // 拖动列最小宽度，会受到表格自动调整分配宽度影响
  maxWidth?: number; // 拖动列最大宽度，会受到表格自动调整分配宽度影响
}
interface IDataSource {
  key: string;
  name: string;
  age: number;
  address: string;
  isDelVisible?: boolean;
}
const formSeach = reactive({}); // 搜索
const columns = ref<IColumns[]>([
  {
    title: "姓名",
    dataIndex: "name",
    key: "name",
    align: "center",
  },
  {
    title: "年龄",
    dataIndex: "age",
    key: "age",
    align: "center",
    resizable: true,
    width: 100,
    minWidth: 100,
    maxWidth: 200,
  },
  {
    title: "住址",
    dataIndex: "address",
    key: "address",
    align: "center",
  },
  {
    title: "操作",
    dataIndex: "operate",
    key: "operate",
    align: "center",
    fixed: "right",
    width: 100,
  },
]);
const columnStorages = ref<IColumns[]>(columns.value); // 暂存 被删除的columns
const dataSource = ref<IDataSource[]>([
  {
    key: "1",
    name: "胡彦斌",
    age: 32,
    address: "西湖区湖底公园1号",
  },
  {
    key: "2",
    name: "胡彦祖",
    age: 42,
    address: "西湖区湖底公园1号",
  },
  {
    key: "1",
    name: "胡彦斌",
    age: 32,
    address: "西湖区湖底公园1号",
  },
  {
    key: "2",
    name: "胡彦祖",
    age: 42,
    address: "西湖区湖底公园1号",
  },
  {
    key: "1",
    name: "胡彦斌",
    age: 32,
    address: "西湖区湖底公园1号",
  },
  {
    key: "2",
    name: "胡彦祖",
    age: 42,
    address: "西湖区湖底公园1号",
  },
  {
    key: "1",
    name: "胡彦斌",
    age: 32,
    address: "西湖区湖底公园1号",
  },
  {
    key: "2",
    name: "胡彦祖",
    age: 42,
    address: "西湖区湖底公园1号",
  },
  {
    key: "1",
    name: "胡彦斌",
    age: 32,
    address: "西湖区湖底公园1号",
  },
  {
    key: "2",
    name: "胡彦祖",
    age: 42,
    address: "西湖区湖底公园1号",
  },
  {
    key: "1",
    name: "胡彦斌",
    age: 32,
    address: "西湖区湖底公园1号",
  },
  {
    key: "2",
    name: "胡彦祖",
    age: 42,
    address: "西湖区湖底公园1号",
  },
  {
    key: "1",
    name: "胡彦斌",
    age: 32,
    address: "西湖区湖底公园1号",
  },
  {
    key: "2",
    name: "胡彦祖",
    age: 42,
    address: "西湖区湖底公园1号",
  },
  {
    key: "1",
    name: "胡彦斌",
    age: 32,
    address: "西湖区湖底公园1号",
  },
  {
    key: "2",
    name: "胡彦祖",
    age: 42,
    address: "西湖区湖底公园1号",
  },
  {
    key: "1",
    name: "胡彦斌",
    age: 32,
    address: "西湖区湖底公园1号",
  },
  {
    key: "2",
    name: "胡彦祖",
    age: 42,
    address: "西湖区湖底公园1号",
  },
  {
    key: "1",
    name: "胡彦斌",
    age: 32,
    address: "西湖区湖底公园1号",
  },
  {
    key: "2",
    name: "胡彦祖",
    age: 42,
    address: "西湖区湖底公园1号",
  },
  {
    key: "1",
    name: "胡彦斌",
    age: 32,
    address: "西湖区湖底公园1号",
  },
  {
    key: "2",
    name: "胡彦祖",
    age: 42,
    address: "西湖区湖底公园1号",
  },
  {
    key: "1",
    name: "胡彦斌",
    age: 32,
    address: "西湖区湖底公园1号",
  },
  {
    key: "2",
    name: "胡彦祖",
    age: 42,
    address: "西湖区湖底公园1号",
  },
]);
const menuChecked = ref<string[]>([]);
const menuCheckList = ref<IColumns[]>([]);
const selectedRowKeys = ref<IDataSource["key"][]>([]);
const menuOrSearch = ref("menu");
const isDropdownVisible = ref(false);
const isDelAllVisible = ref(false);
const isOpenSearch = ref(false);
const isTableLoading = ref(false); // 表格加载状态

onMounted(() => {
  dataSource.value = dataSource.value.map((item) => {
    item.isDelVisible = false;
    return item;
  });
  menuCheckList.value = columns.value.filter(
    (item) => ![item.dataIndex, item.key].includes("operate")
  );
  menuChecked.value = menuCheckList.value.map(
    (item) => item.dataIndex || item.key
  );
  console.log(menuChecked.value, "menuChecked.value");
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
  if (!unref(selectedRowKeys).length) {
    isDelAllVisible.value = false;
  }
};
// 删除当前行-确定
const onDelCurrentConfirm = (record: IDataSource) => {
  console.log(record, "record");

  record.isDelVisible = false;
};
// 删除当前行-取消
const onDelCurrentcancel = (record: IDataSource) => {
  record.isDelVisible = false;
};

// 选中显示表格列
const onCheckboxChange = () => {
  console.log(menuChecked.value, columnStorages.value, "menuChecked");
  const arr = [];
  unref(columnStorages).forEach((item) => {
    if (menuChecked.value.includes(item.dataIndex || item.key)) {
      arr.push(item);
    }
  });
  // 操作,默认需要
  const columnS = unref(columnStorages);
  arr.push(columnS[columnS.length - 1]);
  columns.value = arr;
};
// 显示与隐藏 form
const onOpenSearch = () => {
  isOpenSearch.value = !unref(isOpenSearch);
};
// 表格可伸缩
const handleResizeColumn = (w: number, col: any) => {
  col.width = w;
};

const onSelectChange = (changableRowKeys: string[]) => {
  console.log("selectedRowKeys changed: ", changableRowKeys);
  selectedRowKeys.value = changableRowKeys;
};
const rowSelection = computed(() => {
  return {
    selectedRowKeys: unref(selectedRowKeys),
    onChange: onSelectChange,
    hideDefaultSelections: true,
  };
});
</script>

<template>
  <div class="default-main">
    <div class="container-table">
      <!-- <div></div> -->
      <Transition name="zoom-in">
        <div v-show="isOpenSearch" class="table-form">
          <a-form :model="formSeach" layout="inline" name="basic">
            <a-space direction="vertical">
              <a-row style="width: 100%">
                <a-col :span="6">
                  <a-form-item
                    label="UsernameUsernameUsername"
                    name="username"
                    :rules="[
                      {
                        required: true,
                        message: 'Please input your username!',
                      },
                    ]"
                  >
                    <a-input v-model:value="formSeach.username" />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item
                    label="Username"
                    name="username"
                    :rules="[
                      {
                        required: true,
                        message: 'Please input your username!',
                      },
                    ]"
                  >
                    <a-input v-model:value="formSeach.username" />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item
                    label="Username"
                    name="username"
                    :rules="[
                      {
                        required: true,
                        message: 'Please input your username!',
                      },
                    ]"
                  >
                    <a-input v-model:value="formSeach.username" />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item
                    label="Username"
                    name="username"
                    :rules="[
                      {
                        required: true,
                        message: 'Please input your username!',
                      },
                    ]"
                  >
                    <a-input v-model:value="formSeach.username" />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row style="width: 100%">
                <a-col :span="6">
                  <a-form-item
                    label="group"
                    name="username"
                    :rules="[
                      {
                        required: true,
                        message: 'Please input your username!',
                      },
                    ]"
                  >
                    <a-input v-model:value="formSeach.username" />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item
                    label="Username"
                    name="username"
                    :rules="[
                      {
                        required: true,
                        message: 'Please input your username!',
                      },
                    ]"
                  >
                    <a-input v-model:value="formSeach.username" />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item
                    label="Username"
                    name="username"
                    :rules="[
                      {
                        required: true,
                        message: 'Please input your username!',
                      },
                    ]"
                  >
                    <a-input v-model:value="formSeach.username" />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item
                    label="Username"
                    name="username"
                    :rules="[
                      {
                        required: true,
                        message: 'Please input your username!',
                      },
                    ]"
                  >
                    <a-input v-model:value="formSeach.username" />
                  </a-form-item>
                </a-col>
              </a-row>
            </a-space>
          </a-form>
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
              <template #overlay>
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
        :row-selection="rowSelection"
        :loading="isTableLoading"
        :dataSource="dataSource"
        :columns="columns"
        bordered
        @resizeColumn="handleResizeColumn"
        :pagination="{
          showQuickJumper: true,
          showSizeChanger:true,
          total: dataSource.length,
          pageSize: 20,
          current:1,
          showTotal: (total:number) =>`共 ${total} 条`,
          pageSizeOptions: ['10', '20', '30', '50', '100'],
        }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'operate'">
            <a-space>
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
                  @cancel="onDelCurrentcancel(record)"
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
