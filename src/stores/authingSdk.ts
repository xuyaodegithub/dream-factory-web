import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
interface sdkInter {
  getLoginState:Function | null
  loginWithRedirect:Function | null
  isRedirectCallback?:Function | null
  handleRedirectCallback?:Function | null
  isLoad:boolean,
}
export const authingSdk = defineStore('authingSdk', ()=>{
  const sdk:any = ref(null)
  function initSdk(sdkInfo:any) {
    sdk.value=sdkInfo
  }

return { sdk, initSdk }

})
