// store/loading.ts
import { defineStore } from "pinia";
export const loadingStore = defineStore("main", {
  state: () => {
    return {
      isDefaultLoading: false,
    };
  },
  getters: {},
  actions: {},
});
