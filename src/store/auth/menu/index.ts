/**
 * 管理员日志列表
 */
import {defineStore} from "pinia";
import {adminMenuUpsert, getAdminMenuById, getAdminMenuList} from "@/api/admin";
import {reactive, ref} from "vue";
import {AdminMenuDataSource, AdminMenuFormState} from "@/store/auth/menu/types";


export const useAdminMenuStore = defineStore("adminLogStore", () => {
  const formSearch = reactive({})
  const dataSource = ref<AdminMenuDataSource>([])
  const formState = reactive<AdminMenuFormState>({})
  const isTableLoading = ref<boolean>(false)
  const isModalLoading = ref<boolean>(false)

  /**
   * 获取管理员菜单规则列表
   */
  const getAdminMenuListRequest = async () => {
    isTableLoading.value = true;
    try {
      const {data} = await getAdminMenuList(formSearch);
      console.log(data, "getAdminMenuList");
      dataSource.value = data.records;
    } finally {
      isTableLoading.value = false;
    }
  }
  /**
   * 获取管理员菜单规则详情
   */
  const getAdminMenuByIdRequest = async (id?: number) => {
    isModalLoading.value = true;
    try {
      const {data} = await getAdminMenuById(id);
      data.parentId = data.parentId || undefined;
      Object.assign(formState, data)
    } finally {
      isModalLoading.value = false;
    }
  }

  /**
   * 新增/编辑 管理员菜单规则
   */
  const adminMenuUpsertRequest = async () => {
    isModalLoading.value = true;
    try {
      const {data} = await adminMenuUpsert(formState);
      return data;
    } finally {
      isModalLoading.value = false;
    }
  }

  return {
    formSearch,
    dataSource,
    formState,
    isTableLoading,
    isModalLoading,
    getAdminMenuListRequest,
    getAdminMenuByIdRequest,
    adminMenuUpsertRequest,
  }
})
