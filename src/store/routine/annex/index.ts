/**
 * 管理员日志列表
 */
import {defineStore} from "pinia";
import {adminMenuUpsert, getAdminMenuById} from "@/api/auth/admin";
import {getFileList} from "@/api/files";
import {RoutineAnnexStoreState} from "@/store/routine/annex/types";

export const useRoutineAnnexStore = defineStore("routineAnnexStore", {
  state(): RoutineAnnexStoreState {
    return {
      queryForm: {
        name: "",
        username: "",
        usertype: '',
        mimetype: "",
        filename: "",
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
     * 获取管理员菜单规则列表
     */
    async getFileListRequest() {
      const params = {
        page: this.pages.page,
        size: this.pages.size,
        ...this.queryForm,
      };
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
    /**
     * 获取管理员菜单规则详情
     */
    async getAdminMenuByIdRequest(id?: number) {
      this.isModalLoading = true;
      try {
        const {data} = await getAdminMenuById(id);
        data.parentId = data.parentId || undefined;
        this.formState = data;
      } finally {
        this.isModalLoading = false;
      }
    },
    /**
     * 新增/编辑 管理员菜单规则
     */
    async adminMenuUpsertRequest() {
      this.isModalLoading = true;
      try {
        const {data} = await adminMenuUpsert(this.formState);
        return data;
      } finally {
        this.isModalLoading = false;
      }
    },
  },
});
