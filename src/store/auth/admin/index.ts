import {defineStore} from "pinia";
import {getAdminList} from "@/api/admin";
import {AdminStoreState} from "@/store/auth/admin/types";


export const useAdminStore = defineStore("adminStore", {
  state: (): AdminStoreState => {
    return {
      pages: {
        page: 1,
        size: 10,
        total: 0
      },
      formSearch: {},
      dataSource: [],
      isTableLoading: false,
    };
  },
  getters: {},
  actions: {
    /**
     * 获取管理员列表
     */
    async getAdminListRequest() {
      const params = {
        page: this.pages.page,
        size: this.pages.size,
        ...this.formSearch,
      };
      this.isTableLoading = true;
      try {
        const {data} = await getAdminList(params);
        console.log(data, "getAdminList");
        this.dataSource = data.records

        this.pages = {
          size: data.size,
          page: data.page,
          total: data.total,
        };
      } finally {
        this.isTableLoading = true;
      }
    }
  },
});
