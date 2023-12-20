<template>
  <main class='my-order'>
    <div class='order-title'>订单历史记录</div>
    <div class='table_content'>
      <a-config-provider :locale="zhCN">
    <a-table :dataSource='dataSource' :columns='columns' :loading="loading" :pagination="pagination"  @change="handleTableChange" sticky  :locale="zhCN">
      <template #bodyCell='{ column, record }'>
        <template v-if="['creatTime','finishTime'].includes(column.key)">
          <span>
            {{ formatDate(record[column.key]) }}
          </span>
        </template>
        <template v-else-if="column.key === 'status'">
          <span>
            {{ record.status ===1 ? '已完成' : '待支付' }}
          </span>
        </template>
        <template v-else-if="column.key === 'action'">
          <a-button type='link' >支付</a-button>
          <a-button type='link' @click='toBuy(record)'>去购买</a-button>
        </template>
      </template>
      <template #emptyText>
        暂无订单
      </template>
    </a-table>
      </a-config-provider>
    </div>
    <RechargeDialog :open="openRechargeDialog" :close='()=>openRechargeDialog=false'/>
  </main>
</template>

<script lang='ts' setup>
import { ref,computed } from 'vue'
import { formatDate } from '@/config/formatDate'
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import RechargeDialog from '@/components/RechargeDialog/index.vue'
const loading = ref(false)
const current = ref(1)
const pageSize = ref(10)
const openRechargeDialog=ref(false)
const pagination = computed(() => ({
  total: 200,
  current: current.value,
  pageSize: pageSize.value,
}));
function handleTableChange(page,size){
  console.log(page,size)
}
function toBuy(record:any){
  console.log(record)
  openRechargeDialog.value=true
}
const columns = [
  {
    title: '订单ID',
    dataIndex: 'id',
    key: 'id'
  },
  {
    title: '订单创建时间',
    dataIndex: 'creatTime',
    key: 'creatTime'
  },
  {
    title: '算力值',
    dataIndex: 'value',
    key: 'value'
  },{
    title: '订单金额',
    dataIndex: 'amount',
    key: 'amount'
  },{
    title: '订单时间',
    dataIndex: 'finishTime',
    key: 'finishTime'
  },{
    title: '订单状态',
    dataIndex: 'status',
    key: 'status'
  },{
    title: '操作',
    key: 'action',
  }
]
const a = [
  {
    id: '1',
    creatTime: Date.now(),
    value: 32,
    amount: 100,
    finishTime: Date.now(),
    status: 1,
  },
  {
    id: '2',
    creatTime: Date.now(),
    value: 32,
    amount: 200,
    finishTime: Date.now(),
    status: 2,
  },
  {
    id: '3',
    creatTime: Date.now(),
    value: 32,
    amount: 300,
    finishTime: Date.now(),
    status: 2,
  },
  {
    id: '3',
    creatTime: Date.now(),
    value: 32,
    amount: 300,
    finishTime: Date.now(),
    status: 2,
  },
  {
    id: '3',
    creatTime: Date.now(),
    value: 32,
    amount: 300,
    finishTime: Date.now(),
    status: 2,
  },
  {
    id: '3',
    creatTime: Date.now(),
    value: 32,
    amount: 300,
    finishTime: Date.now(),
    status: 2,
  },
  {
    id: '3',
    creatTime: Date.now(),
    value: 32,
    amount: 300,
    finishTime: Date.now(),
    status: 2,
  },
  {
    id: '3',
    creatTime: Date.now(),
    value: 32,
    amount: 300,
    finishTime: Date.now(),
    status: 2,
  },
  {
    id: '3',
    creatTime: Date.now(),
    value: 32,
    amount: 300,
    finishTime: Date.now(),
    status: 2,
  },
  {
    id: '3',
    creatTime: Date.now(),
    value: 32,
    amount: 300,
    finishTime: Date.now(),
    status: 2,
  },

]
const dataSource: any = ref(a)
</script>

<style scoped lang='less'>
.order-title {
  font-size: 24px;
  color: #333;
  text-align: center;
  margin: 36px 0;
}

.my-order {
  height: 100%;
  padding: 24px;
  background-color: #ffffff;
  display:flex;
  flex-direction: column;
  .table_content{
    flex: 1;
    overflow: auto;
  }
}
</style>
