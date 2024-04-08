/**
 * 管理员日志列表
 */
import {defineStore} from "pinia";
import {getAdminLogById, getAdminLogList} from "@/api/auth/adminLog";
import {AdminLogStoreState} from "./types";


export const useAdminLogStore = defineStore("adminLogStore", {
  state: (): AdminLogStoreState => {
    return {
      pages: {
        page: 1,
        size: 10,
        total: 0
      },
      formSearch: {},
      dataSource: [],
      detailInfo: {},
      isTableLoading: false,
      isDetailModalLoading: false,
    };
  },
  getters: {},
  actions: {
    /**
     * 获取管理员列表
     */
    async getAdminLogListRequest() {
      const params = {
        page: this.pages.page,
        size: this.pages.size,
        ...this.formSearch,
      };
      this.isTableLoading = true;
      try {
        const {data} = await getAdminLogList(params);
        console.log(data, "getAdminLogList");
        this.dataSource = data.records

        this.pages = {
          size: data.size,
          page: data.page,
          total: data.total,
        };
      } finally {
        this.isTableLoading = false;
      }
    },
    /**
     * 获取管理员日志详情
     */
    async getAdminLogByIdRequest(id?: number) {
      this.isDetailModalLoading = true;
      try {
        const {data} = await getAdminLogById(id);
        this.detailInfo = data
      } finally {
        this.isDetailModalLoading = false;
      }
    }
  },
});
