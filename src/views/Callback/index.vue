<template>
  <main class="callback">
    <a-spin tip="登录中，请稍后..." />
  </main>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { handleAuthingLoginCallback } from '@/authingConfig'
import { userInfo } from '@/stores'
import { useGuard } from '@authing/guard-vue3'
import { removeToken } from '@/utils/index'
const guard = useGuard()
const userStore: any = userInfo()
onMounted(async () => {
  removeToken()
  await handleAuthingLoginCallback()
})
</script>

<style scoped lang="less">
.callback {
  height: 100%;
  position: relative;
  .ant-spin {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
