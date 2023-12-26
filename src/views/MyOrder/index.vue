<template>
  <main class="my-order">
    <div class="order-title">订单历史记录</div>
    <div class="table_content">
      <a-config-provider :locale="zhCN">
        <a-table
          :dataSource="dataSource"
          :columns="columns"
          :loading="loading"
          :pagination="pagination"
          @change="handleTableChange"
          sticky
          :locale="zhCN"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="['creatTime', 'finishTime'].includes(column.key)">
              <span>
                {{ formatDate(record[column.key]) }}
              </span>
            </template>
            <template v-else-if="column.key === 'status'">
              <span>
                {{ record.status === 1 ? '已完成' : '待支付' }}
              </span>
            </template>
            <template v-else-if="column.key === 'action'">
              <!--              v-if="record.orderStatus"-->
              <a-button type="link">支付</a-button>
              <a-button type="link" @click="toBuy(record)">去购买</a-button>
            </template>
          </template>
          <template #emptyText>
            <a-empty description="暂无订单" />
          </template>
        </a-table>
      </a-config-provider>
    </div>
    <RechargeDialog :open="openRechargeDialog" :close="() => (openRechargeDialog = false)" />
  </main>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { formatDate } from '@/config/formatDate'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import RechargeDialog from '@/components/RechargeDialog/index.vue'
import { initOrderlList } from '@/services'
import { columns } from '@/config'
import { useRouter } from 'vue-router'
const router = useRouter()
const loading = ref(true)
const pageIndex = ref(1)
const pageSize = ref(10)
const totalCount = ref(0)
const openRechargeDialog = ref(false)
const dataSource: any = ref([])
const pagination = computed(() => ({
  total: totalCount.value,
  current: pageIndex.value,
  pageSize: pageSize.value
}))

function handleTableChange(page: number, size: number) {
  pageIndex.value = page
  pageSize.value = size
  initList()
}

function toBuy(record: any) {
  const { skuId } = record
  router.push(`/payOrder?skuId=${skuId}`)
}

async function initList() {
  loading.value = true
  try {
    const payload: any = {
      pageSize: pageSize.value,
      pageIndex: pageIndex.value
    }
    const {
      data: { totalCount, items }
    } = await initOrderlList(payload)
    totalCount.value = totalCount
    dataSource.value = items
  } catch (e: any) {}
  loading.value = false
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
  margin: 24px 0;
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
