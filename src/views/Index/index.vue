<script setup lang="ts">
import { onMounted, onBeforeMount, ref, computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import NavBar from '@/components/NavBar/index.vue'
import { userInfo } from '@/stores'
import { useGuard } from '@authing/guard-vue3'
import { getLoginState } from '@/authingConfig'
import { initTenants, initBillings } from '@/services'
import { removeToken } from '@/utils'
const userStore: any = userInfo()
const showContent = ref(false)
const guard = useGuard()
const route: any = useRoute()
const isIndex = computed(() => {
  const { meta: { showRecord = false } = {} } = route
  return showRecord
})
onMounted(async () => {
  const loginStatus = await getLoginState()
  // const authClient: AuthenticationClient = await guard.getAuthClient()
  // const ref = await authClient.getNewAccessTokenByRefreshToken('')
  // console.log(ref,'pppp')
  // const res = await authClient.getAccessTokenByIdToken({
  //   // 控制台 -> 自建应用 -> 应用配置 -> 认证配置 -> 登录回调 URL
  //   redirectUri: 'http://dev.dreamher.cn:8080/callback',
  //   // 登录成功后，从用户信息中获取到的 ID Toten
  //   idToken: userStore.userInfo?.token
  // })
  // console.log('getAccessTokenByIdToken: ', res)
  //如果登录了就获取余额 和 租户信息
  if (loginStatus) await getTenantsWithBills()
  else removeToken()
  showContent.value = true
})

async function getTenantsWithBills() {
  try {
    // const [res1, res2] = await Promise.all([initTenants({}), initBillings({})])
    const res1 = await initTenants({})
    const {
      data: { items }
    }: any = res1
    userStore.saveUserInfo({ Tenant: items[0].tenantId })
    const res2 = await initBillings({})
    const {
      data: { leftTokenCount }
    } = res2
    userStore.saveUserInfo({ leftTokenCount })
    console.log({ leftTokenCount })
  } catch (e) {}
}
</script>

<template>
  <a-layout>
    <template v-if="!showContent">
      <a-spin size="large" />
    </template>
    <template v-else>
      <NavBar />
      <a-layout-content>
        <router-view></router-view>
      </a-layout-content>
      <a-layout-footer v-if="isIndex" class="index_footer">
        <a href="https://beian.miit.gov.cn/#/Integrated/index" target="_blank"
          >浙ICP备2022020264号-2</a
        >
      </a-layout-footer>
    </template>
  </a-layout>
</template>

<style scoped lang="less">
.ant-layout {
  height: 100%;
  overflow: hidden;
  position: relative;

  & > .ant-spin {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .index_footer {
    text-align: center;
    background-color: #333333;
    a {
      color: #999999;
      &:hover {
        color: #ffffff;
      }
    }
  }
}
</style>
