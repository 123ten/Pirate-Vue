<!-- 选择文件 modal -->
<script setup lang="ts">
import {
  computed,
  onMounted,
  reactive,
  ref,
  toRaw,
  toRef,
  unref,
  withDefaults,
  watch,
} from "vue";
import { CheckOutlined, PlusOutlined } from "@ant-design/icons-vue";
import { IColumns, IPages } from "@/types/index";
interface IPropsModal {
  title: string; // modal 标题
  visible: boolean; // 控制 modal 开关
  maxFileNum?: string | number; // 选择文件数 默认 只能选择一个
}
const props = withDefaults(defineProps<IPropsModal>(), {
  title: "",
  visible: false,
  maxFileNum: 1,
});
const emits = defineEmits([
  "confirm", // 点击确定回调
  "cancel", // 点击遮罩层或右上角叉或取消按钮的回调
]);

interface IDataSource {
  key?: string | number;
  username?: string; // 用户名
  usertype?: string; // 用户类型 1 管理员 2 普通用户
  size?: string; // 文件大小
  mimetype?: string; // 文件类型
  full_url?: string; // 完整路径
  upload_count?: string; // 上传次数
  filename?: string; // 原始名称
  createTime?: string; // 最后上传时间
}

const columns = ref<IColumns[]>([
  {
    title: "ID",
    dataIndex: "id",
    align: "center",
    minWidth: 80,
  },
  {
    title: "大小",
    dataIndex: "size",
    align: "center",
    minWidth: 100,
  },
  {
    title: "文件类型",
    dataIndex: "mimetype",
    align: "center",
    minWidth: 100,
  },
  {
    title: "预览",
    dataIndex: "full_url",
    align: "center",
    minWidth: 100,
  },
  {
    title: "上传次数",
    dataIndex: "upload_count",
    align: "center",
    minWidth: 100,
  },
  {
    title: "原始名称",
    dataIndex: "filename",
    align: "center",
    minWidth: 150,
  },
]);
const dataSource = ref<IDataSource[]>([{}]);
const selectedRowKeys = ref<IDataSource["key"][]>([]);
const pages = ref<IPages>({
  pageSize: 10,
  current: 1,
  total: 0,
});

const formSeach = reactive({
  username: "",
  usertype: "",
  mimetype: "",
  upload_count: "",
  filename: "",
  createTime: "",
  end_count: "",
  start_count: "",
});

const avatarPreviewSrc = ref<string>("");

const fileNum = ref<string | number>(props.maxFileNum);

const isTableLoading = ref<boolean>(false); // 表格加载状态
const isAvatarPreviewSrc = ref<boolean>(false);
const tableRef = ref(null);

onMounted(() => {});

// 分页
const onPagesChange = (records: IPages) => {
  pages.value = records;
};

// 显示与隐藏表头
const onColumnChange = (newColumns: IColumns[]) => {
  columns.value = newColumns;
};
// 多选
const onSelectChange = (rowKeys: string[]) => {
  selectedRowKeys.value = rowKeys;
  // 更新选择数量
  fileNum.value = Number(props.maxFileNum) - rowKeys.length;
  console.log(rowKeys, "rowKeys");
};

const onSearch = () => {
  console.log(toRaw(formSeach));
};
</script>

<template>
  <IModal
    :visible="props.visible"
    :title="props.title"
    @confirm="emits('confirm')"
    @cancel="emits('cancel')"
  >
    <a-form-item-rest>
      <ITable
        :columns="columns"
        :dataSource="dataSource"
        :pages="pages"
        isSelectedRowKeys
        isFormSearchBtn
        :loading="isTableLoading"
        :scroll="{ x: true }"
        keywordPlaceholder="请输入原始名称"
        @onColumnChange="onColumnChange"
        @onPagesChange="onPagesChange"
        @onSelectChange="onSelectChange"
      >
        <template #formSearch>
          <a-form
            :model="formSeach"
            layout="inline"
            name="basic"
            autocomplete="off"
          >
            <a-space direction="vertical">
              <a-row style="width: 100%">
                <a-col :span="6">
                  <a-form-item label="用户名" name="username">
                    <a-input
                      v-model:value="formSeach.username"
                      allowClear
                      placeholder="用户名"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item label="用户类型" name="usertype">
                    <a-input
                      v-model:value="formSeach.usertype"
                      allowClear
                      placeholder="用户类型"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item label="文件类型" name="mimetype">
                    <a-input
                      v-model:value="formSeach.mimetype"
                      placeholder="文件类型"
                      allow-clear
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item label="上传次数" name="upload_count">
                    <a-input-group compact>
                      <a-form-item-rest>
                        <a-input-number
                          v-model:value="formSeach.start_count"
                          min="0"
                        />
                        <a-input
                          class="input-middleware"
                          placeholder="至"
                          disabled
                        />
                        <a-input-number
                          v-model:value="formSeach.end_count"
                          min="0"
                        />
                      </a-form-item-rest>
                    </a-input-group>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row style="width: 100%">
                <a-col :span="6">
                  <a-form-item label="原始名称" name="filename">
                    <a-input
                      v-model:value="formSeach.filename"
                      placeholder="原始名称"
                      allow-clear
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="最后上传时间" name="createTime">
                    <a-range-picker
                      style="width: 100%"
                      v-model:value="formSeach.createTime"
                      format="YYYY-MM-DD HH:mm:ss"
                      value-format="YYYY-MM-DD HH:mm:ss"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
            </a-space>
          </a-form>
          <a-space class="mt_8">
            <a-button type="primary" @click="onSearch">查询</a-button>
            <a-button>重置</a-button>
          </a-space>
        </template>
        <template #leftBtn>
          <ITooltip
            title="选择"
            content="选择"
            :disabled="!selectedRowKeys.length"
          >
            <template #icon>
              <CheckOutlined />
            </template>
          </ITooltip>
          还可以选择{{ fileNum }}个
        </template>
      </ITable>
      <IPreviewImage
        :src="avatarPreviewSrc"
        v-model:visible="isAvatarPreviewSrc"
      />
    </a-form-item-rest>
  </IModal>
</template>

<style lang="less" scoped>
@import "./index.less";
</style>
