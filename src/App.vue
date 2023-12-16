<script setup lang="ts">
import {
  onMounted,
  ref,
  onBeforeMount,
  nextTick,
  computed,
  watch,
  reactive,
  defineProps
} from 'vue'
import { RouterView } from 'vue-router'
import NavBar from '@/components/NavBar/index.vue'
const props = defineProps<{
  title?: string
  likes?: number
}>()
import { initAuthingWebUse, getLoginState } from '@/authingConfig'
import { useRouter, useRoute } from 'vue-router'
import { Authing } from '@authing/web'
import { authingSdk, userInfo } from '@/stores'
const router = useRouter()
const route = useRoute()
const state = reactive({
  loginState: null
})
const a = ref(11)
const b = ref(22)
const loading = ref(false)
const c = computed(() => a.value + b.value)
onBeforeMount(() => {
  console.log(props, '-=-=', c)
})
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
  a.value++
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
