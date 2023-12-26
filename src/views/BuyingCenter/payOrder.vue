<template>
  <div class="container">
    <template v-if="!htmlContent">
      <a-spin size="large" />
    </template>
    <template v-else>
      <div class="htmlContent" v-html="htmlContent"></div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { initPayOrder } from '@/services'

const route = useRoute()
const htmlContent = ref('')
const skuId = computed(() => {
  const {
    query: { skuId }
  } = route
  return skuId || ''
})

async function initForm() {
  const {
    data: { orderId, qrcodeFormStr }
  } = await initPayOrder({ skuList: [skuId.value] })
  htmlContent.value = qrcodeFormStr
}

onMounted(() => {
  initForm()
})
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  overflow: hidden;
  padding: 24px;
  position: relative;
  .ant-spin-spinning {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .htmlContent {
    height: 100%;
    overflow: auto;
  }
}
</style>
