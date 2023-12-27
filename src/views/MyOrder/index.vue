<template>
  <main class="my-order">
    <div class="order-title">订单历史记录</div>
    <a-tabs v-model:activeKey="activeKey" size="large" @change="changeTab">
      <a-tab-pane :key="1" tab="我的订单"></a-tab-pane>
      <a-tab-pane :key="2" tab="我的算力"></a-tab-pane>
    </a-tabs>
    <div class="table_content">
      <a-config-provider :locale="zhCN">
        <a-table
            :dataSource="dataSource"
            :columns="tableHead"
            :loading="loading"
            :pagination="pagination"
            @change="handleTableChange"
            sticky
            :locale="zhCN"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="['gmtCreate', 'gmtTakeEffect','gmtLoseEffect'].includes(column.key)">
              <span>
                {{ formatDate(record[column.key]) }}
              </span>
            </template>
            <template v-else-if="['orderStatus','status'].includes(column.key)">
              <span>
                {{ orderStatusTxt(record[column.key]) }}
              </span>
            </template>
            <template v-else-if="['count'].includes(column.key)">
              <span>
                {{ `${record.leftCount}/${record.totalCount}` }}
              </span>
            </template>
            <template v-else-if="column.key === 'action'">
              <div v-if="activeKey===1">
                <a-button type="link" @click="toPay(record)" v-if="record.orderStatus==='INIT'">支付</a-button>
                <a-button type="link" @click="toSkuPage" v-else>去购买</a-button>
              </div>
              <div v-else>
                <a-button type="link" @click="toSkuPage">去购买</a-button>
              </div>
            </template>
          </template>
          <template #emptyText>
            <a-empty description="暂无数据"/>
          </template>
        </a-table>
      </a-config-provider>
    </div>
    <RechargeDialog :open="openRechargeDialog" :close="() => (openRechargeDialog = false)"/>
    <div class="htmlContent" v-html="htmlContent"></div>
  </main>
</template>

<script lang="ts" setup>
import {ref, computed, onMounted, nextTick} from 'vue'
import {formatDate} from '@/config/formatDate'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import RechargeDialog from '@/components/RechargeDialog/index.vue'
import {initOrderlList, payOrderByMyOrder, getScrollToken} from '@/services'
import {columns, trafficKacket} from '@/config'
import {useRouter} from 'vue-router'
import {message} from 'ant-design-vue'

const router = useRouter()
const loading = ref(true)
const pageIndex = ref(1)
const pageSize = ref(10)
const total = ref(0)
const htmlContent = ref('')
const openRechargeDialog = ref(false)
const dataSource: any = ref([])
const activeKey = ref(1)
const pagination = computed(() => ({
  total: total.value,
  current: pageIndex.value,
  pageSize: pageSize.value
}))
const tableHead = computed(() => {
  return activeKey.value === 1 ? columns : trafficKacket
})
const isOrder = computed(() => {
  return activeKey.value === 1
})

function handleTableChange({current: page, pageSize: size}: any) {
  pageIndex.value = page
  pageSize.value = size
  initList()
}

async function initList() {
  loading.value = true
  try {
    const payload: any = {
      pageSize: pageSize.value,
      pageIndex: pageIndex.value
    }
    const {
      data: {totalCount, items}
    } = isOrder.value ? await initOrderlList(payload) : await getScrollToken(payload)
    total.value = totalCount
    dataSource.value = items
  } catch (e: any) {
  }
  loading.value = false
}

async function toPay(item: any) {
  const {orderId} = item
  const {
    data: {qrcodeFormStr}
  } = await payOrderByMyOrder({orderId})
  htmlContent.value = qrcodeFormStr
  await nextTick()
  message.loading({content: () => '正在前往支付，请稍后', duration: 1500})
  setTimeout(() => {
    document.forms[0].submit()
  }, 1500)
}

function orderStatusTxt(status: string) {
  //              订单状态，取值：INIT-待支付；PAID-已支付；SHIPPED-已发放流量包；EXPIRED-已过期-->
  //              流量包状态,INEFFECTIVE-未生效, EFFECTIVE-生效中, EXPIRED-已过期, CONSUMED-已使用-->

  const payload: any = {
    INIT: '待支付',
    PAID: '已支付',
    SHIPPED: '已发放流量包',
    EXPIRED: '已过期',
  }
  const payLoad2: any = {
    INEFFECTIVE: '未生效',
    EFFECTIVE: '生效中',
    EXPIRED: '已过期',
    CONSUMED: '已使用',
  }
  return isOrder.value ? payload[status] || '-' : payLoad2[status] || '-'
}

function toSkuPage() {
  router.push(`/buy`)
}

function changeTab() {
  pageIndex.value = 1
  pageSize.value = 10
  total.value = 0
  dataSource.value = []
  initList()
}

onMounted(() => {
  initList()
})
</script>

<style scoped lang="less">
.order-title {
  font-size: 24px;
  color: #333;
  text-align: center;
  margin: 12px 0;
}

.my-order {
  height: 100%;
  padding: 12px 24px;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;

  .table_content {
    flex: 1;
    overflow: auto;
  }
}
</style>
