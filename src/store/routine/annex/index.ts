/**
 * 管理员日志列表
 */
import {defineStore} from "pinia";
import {getFileList, removeFile} from "@/api/routine/files";
import {RoutineAnnexStoreState} from "@/store/routine/annex/types";
import {calculateNextPage, formatDateRange} from "@/utils/common";
import {notification} from "ant-design-vue";

export const useRoutineAnnexStore = defineStore("routineAnnexStore", {
  state(): RoutineAnnexStoreState {
    return {
      queryForm: {
        // updateRange: []
      },
      dataSource: [],
      formState: {},
      pages: {
        page: 1,
        size: 10,
        total: 0,
      },
      remark: "",
      isTableLoading: false,
      isModalLoading: false,
    };
  },
  actions: {
    /**
     * 获取附件列表
     */
    async getFileListRequest() {
      const params = {
        page: calculateNextPage(this.pages),
        size: this.pages.size,
        ...this.queryForm,
        createRange: formatDateRange(this.queryForm.createRange),
        updateRange: formatDateRange(this.queryForm.updateRange),
      };
      console.log('getFileListRequest', params, this.queryForm)
      this.isTableLoading = true;
      try {
        const {data} = await getFileList(params);
        console.log(data, "getFileList");
        this.remark = data.remark;
        this.dataSource = data.records;

        this.pages = {
          size: data.size,
          page: data.page,
          total: data.total,
        };
      } finally {
        this.isTableLoading = false;
      }
    },
    /** 删除附件 */
    async removeFileRequest(ids: number[]) {
      await removeFile(ids);
      this.pages.total -= ids.length;
      console.log('this.pages', this.pages)
      notification.success({
        message: "Success",
        description: "Success"
      })
    }
  },
});
