import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', () => {
  const appLoading = ref(false)
  function changeLoading() {
    appLoading.value=true
  }

  return { appLoading, changeLoading }
})
