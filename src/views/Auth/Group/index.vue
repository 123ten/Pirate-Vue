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
const pages = ref<IPages>({
  pageSize: 10,
  current: 1,
  total: 0,
});
const isDelAllVisible = ref(false);
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
};

// 分页
const onPagesChange = (records: IPages) => {
  // console.log(records, "records");
  pages.value = records;
};

// 显示与隐藏表头
const onColumnChange = (columnsArr: IColumns[]) => {
  columns.value = columnsArr;
};
</script>

<template>
  <div class="default-main">
    <ITable
      :columns="columns"
      :dataSource="dataSource"
      :pages="pages"
      @onColumnChange="onColumnChange"
      @onDelCurrentConfirm="onDelCurrentConfirm"
      @onPagesChange="onPagesChange"
    >
      <template #formSearch>
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
          </a-space>
        </a-form>
      </template>
    </ITable>
  </div>
</template>

<style lang="less" scoped>
@import "./index.less";
</style>
