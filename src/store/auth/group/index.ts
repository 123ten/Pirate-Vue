/**
 * 角色组
 */
import {defineStore} from "pinia";
import {adminMenuStatus, adminMenuUpsert, getRoleById, getRoleList} from "@/api/auth/admin";
import {RoleStoreState} from "./types";


export const useRoleStore = defineStore("roleStore", {
  state(): RoleStoreState {
    return {
      formSearch: {},
      dataSource: [],
      formState: {
        parentId: undefined,
        id: undefined,
        path: undefined,
        description: undefined,
        name: undefined,
        title: undefined,
        component: undefined,
        icon: undefined,
        type: 1,
        status: 1,
        cache: 0,
        frame: 1,
        sort: 0,
      },
      isTableLoading: false,
      isModalLoading: false,
    }
  },
  actions: {
    /**
     * 获取角色组列表
     */
    async getRoleListRequest() {
      this.isTableLoading = true;
      try {
        const {data} = await getRoleList(this.formSearch);
        console.log(data, "getRoleList");
        this.dataSource = data.records;
      } finally {
        this.isTableLoading = false;
      }
    },
    /**
     * 获取角色组详情
     */
    async getRoleByIdRequest(id?: number) {
      this.isModalLoading = true;
      try {
        const {data} = await getRoleById(id);
        data.parentId = data.parentId || undefined;
        this.formState = data
      } finally {
        this.isModalLoading = false;
      }
    },
    /**
     * 新增/编辑 角色组
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
    /**
     * 角色组 修改状态
     */
    async adminMenuStatusRequest(params) {
      await adminMenuStatus(params);
    }
  }
})
