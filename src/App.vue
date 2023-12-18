<script setup lang="ts">
import {
  onMounted,
  ref,
  reactive,
} from 'vue'
import { RouterView } from 'vue-router'
import NavBar from '@/components/NavBar/index.vue'
import { initAuthingWebUse, getLoginState } from '@/authingConfig'
import { useRouter, useRoute } from 'vue-router'
import { Authing } from '@authing/web'
import { authingSdk, userInfo } from '@/stores'
const router = useRouter()
const state = reactive({
  loginState: null
})
const loading = ref(false)
onMounted(async () => {
  await initAuthingWebUse(Authing)
  const authingSdkClass = authingSdk()
  const userInfoClass = userInfo()
  console.log(authingSdkClass, 'authingSdkClass', authingSdkClass.sdk)
  if (authingSdkClass?.sdk?.isRedirectCallback()) {
    console.log('redirect')

    /**
     * 以跳转方式打开 Authing 托管的登录页，认证成功后，
     * 需要配合 handleRedirectCallback 方法，在回调端点处理 Authing 发送
     * 的授权码或 token，获取用户登录态
     */
    authingSdkClass?.sdk?.handleRedirectCallback().then((res: any) => {
      userInfoClass.saveUserInfo(res)
      router.replace('/')
    })
  } else {
    // getLoginState()
  }
})

function add() {
  console.log(23)
}
</script>

<template>
  <a-layout>
    <NavBar />
    <a-layout-content>
      <router-view></router-view>
    </a-layout-content>
  </a-layout>
</template>

<style scoped lang="less">
.ant-layout {
  height: 100%;
  overflow: hidden;
}
</style>
