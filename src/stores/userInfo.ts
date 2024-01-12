import {defineStore} from 'pinia'
import {ref} from 'vue'

interface user {
  leftTokenCount: number
  phone: number | string
  photo: string
  token: string
  Tenant: string
  username: string
  email:string
}

export const userInfo = defineStore('userInfo', () => {
  const userInfo = ref<user>({leftTokenCount: 0, phone: '', photo: '', token: '', Tenant: '',username:'',email:''})

  function saveUserInfo(info: any) {
    userInfo.value = {...userInfo.value, ...info}
  }

  function clearUserInfo() {
    userInfo.value = {leftTokenCount: 0, phone: '', photo: '', token: '', Tenant: '',username:'',email:''}
  }

  return {userInfo, saveUserInfo,clearUserInfo}
})
