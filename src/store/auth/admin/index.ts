/**
 * 管理员列表
 */
import {defineStore} from "pinia";
import {adminUpsert, getAdminById, getAdminList} from "@/api/auth/admin";
import {AdminState} from "./types";


export const useAdminStore = defineStore("adminStore", {
  state: (): AdminState => {
    return {
      pages: {
        page: 1,
        size: 10,
        total: 0
      },
      dataSource: [],
      formSearch: {},
      formState: {
        id: undefined,
        roleIds: [],
        username: undefined,
        nickname: undefined,
        avatar: undefined,
        avatarPath: undefined,
        email: undefined,
        phone: undefined,
        password: undefined,
        status: 1,
        fileList: [],
      },
      remark: undefined,
      isTableLoading: false,
      isModalLoading: false,
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
        this.remark = data.remark;
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
     * 获取管理员详情
     */
    async getAdminByIdRequest(id?: number) {
      this.isModalLoading = true;
      try {
        const {data} = await getAdminById(id);
        const file = {
          // 按照要求乱填即可
          url: data.avatar,
          path: data.avatarPath,
          status: 'done',
          uid: '1',
        }
        data.fileList = data.avatar ? [file] : [];
        data.roleIds = data.roles.map((item: any) => item.id);
        this.formState = data
      } finally {
        this.isModalLoading = false;
      }
    },
    async adminUpsertRequest() {
      this.isModalLoading = true;
      const [response] = this.formState.fileList || []
      const params = {
        ...this.formState,
        fileList: undefined,
        avatar: response?.path,
      };
      try {
        const {data} = await adminUpsert(params);
        return data;
      } finally {
        this.isModalLoading = false;
      }
    }
  },
});
