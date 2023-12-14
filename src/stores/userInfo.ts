import { defineStore } from 'pinia'
import { ref } from 'vue'

export const userInfo = defineStore('userInfo', ()=>{
  const userInfo = ref(null)
  function saveUserInfo(info:any) {
    userInfo.value=info
  }

  return { userInfo, saveUserInfo }
})
