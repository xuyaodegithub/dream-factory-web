<template>
  <a-modal
    :keyboard="false"
    :maskClosable="false"
    :open="open"
    class="dia-container"
    :width="850"
    @cancel="close"
    :footer="null"
  >
    <template #title>
      <a-space>
        <span class="dia-title">算力充值</span>
        <span class="title-tip">(1元=1算力值)</span>
      </a-space>
    </template>
    <div class="package-card-container">
      <package-card
        v-for="(packageInfo, idx) in packageInfos"
        :key="packageInfo.skuId"
        :info="packageInfo"
        :active="selectIdx === idx"
        @click="() => (selectIdx = idx)"
      />
    </div>
    <div class="payment-info">
      <div class="payment-text">
        付款金额：<span class="payment-amount">{{ accPrice }}</span>
      </div>
      <a-button
        type="primary"
        class="to-pay-btn"
        size="large"
        @click="toPay"
        :disabled="!!htmlContent"
        >去支付</a-button
      >
      <div class="alipay-tip">
        <AlipayCircleOutlined
          :style="{ fontSize: '24px', color: '#6493e0', verticalAlign: 'middle' }"
        />
        <span class="tip-text">请使用支付宝扫码支付</span>
      </div>
    </div>
    <div class="illustrate">
      说明：
      <ul class="illu-ul">
        <li>算力值换算规则：1元=1算力值</li>
        <li>充值后的算力有对应的有效期，无法提现、退款或转赠他人</li>
        <li>充值成功后，可在【我的订单】中查看充值明细，并申请开票。</li>
      </ul>
    </div>
    <div id="htmlContent" v-html="htmlContent"></div>
  </a-modal>
</template>

<script setup lang="ts">
import { defineProps, ref, onMounted, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { AlipayCircleOutlined } from '@ant-design/icons-vue'
import PackageCard from './PackageCard.vue'
import { initSkusList, initPayOrder } from '@/services'
import { message } from 'ant-design-vue'

const router = useRouter()
const props: any = defineProps({
  open: {
    type: Boolean,
    default: false
  },
  close: Function
})
const selectIdx = ref<any>('')
const htmlContent = ref('')
const packageInfos = ref<any[]>([])
//当前所选套餐金额
const accPrice = computed(() => {
  const item = packageInfos.value[selectIdx.value] || {}
  return item.unitPrice || 0
})
// 从后端获取套餐数据
const getPackageIfos = async () => {
  // 假设此处使用axios或fetch从后端获取数据
  try {
    const {
      data: { items }
    } = await initSkusList({})
    packageInfos.value = items
    // 对返回的数据进行处理
  } catch (error) {
    console.error('API 请求出错：', error)
    // 处理错误情况
  }
}
async function toPay() {
  if (selectIdx.value === '') return message.warning('请先选择套餐')
  const item = packageInfos.value[selectIdx.value]
  const { skuId } = item
  const {
    data: { orderId, qrcodeFormStr }
  } = await initPayOrder({ skuList: [{ skuId: skuId, skuCnt: 1 }] })
  htmlContent.value = qrcodeFormStr
  await nextTick()
  const hide = message.loading('正在前往支付，请稍后...', 0)
  setTimeout(() => {
    try {
      hide()
      props.close && props.close()
    } catch (e: any) {}
    document.forms[0].submit()
    htmlContent.value = ''
  }, 1500)
}
onMounted(async () => {
  getPackageIfos()
})
</script>

<style lang="less" scoped>
.dia-container {
  .dia-title {
    font-size: 16px;
    font-weight: bold;
  }

  .title-tip {
    font-size: 12px;
  }

  .package-card-container {
    margin-top: 30px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 8px;
  }

  .payment-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;

    .payment-text {
      font-size: 24px;
      line-height: 60px;
      .payment-amount {
        color: #a63c26;
        font-weight: 500;
      }
    }
    .to-pay-btn {
      width: 160px;
      margin: 20px 0;
    }

    .alipay-tip {
      display: inline-block;

      .tip-text {
        margin-left: 5px;
      }
    }
  }

  .illustrate {
    margin-top: 24px;

    .illu-ul {
      margin-left: -23px;

      li {
        line-height: 1.8;
      }
    }
  }
}
</style>
