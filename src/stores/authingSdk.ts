import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
export const authingSdk = defineStore('authingSdk', ()=>{
  const sdk:any = ref(null)
  function initSdk(sdkInfo:any) {
    sdk.value = sdkInfo
  }

return { sdk, initSdk }
})
