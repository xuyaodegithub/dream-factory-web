<template>
  <div class="container">
    <CheckCircleOutlined />
    <div class="alipay_success">
      <AlipayCircleOutlined
          :style="{ fontSize: '24px', color: '#6493e0', verticalAlign: 'middle' }"
      />
      支付成功
    </div>
    <div class="to_order_btn">
      <a-button type='primary' @click='router.replace("/myOrder")' size="large">查看订单</a-button>
    </div>
    <div class="success_dec">提示：需要开通发票，请联系商务进行线下开票，或联系商务小助手</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute,useRouter } from 'vue-router'
import {
  CheckCircleOutlined,AlipayCircleOutlined
} from '@ant-design/icons-vue'
const router = useRouter()
const route = useRoute()
onMounted(() => {})
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  overflow: auto;
  padding: 124px 24px 24px;
  position: relative;
  text-align: center;
  font-size: 24px;
  .anticon-check-circle{
    font-size: 120px;
    color: #52c41a;
  }
  .alipay_success{
    margin: 36px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    .anticon-alipay-circle{
      margin-right: 12px;
    }
  }
  .ant-btn{
    width: 160px;
  }
  .success_dec{
    font-size: 14px;
    color: #999999;
    margin-top: 36px;
  }
}
</style>
