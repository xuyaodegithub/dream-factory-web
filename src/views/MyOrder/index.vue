<template>
  <main class='my-order'>
    <div class='order-title'>订单历史记录</div>
    <a-table :dataSource='dataSource' :columns='columns'>
      <template #bodyCell='{ column, record }'>
        <template v-if="column.key === 'action'">
        <span>
          <a>Invite 一 {{ record.name }}</a>
          <a-divider type='vertical' />
          <a>Delete</a>
          <a-divider type='vertical' />
          <a class='ant-dropdown-link'>
            More actions
            <down-outlined />
          </a>
        </span>
        </template>
      </template>
    </a-table>
  </main>
</template>

<script lang='ts' setup>
import { ref } from 'vue'

const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age'
  },
  {
    title: '住址',
    dataIndex: 'address',
    key: 'address'
  }
]
const dataSource: any = ref([
  {
    key: '1',
    name: '胡彦斌',
    age: 32,
    address: '西湖区湖底公园1号'
  },
  {
    key: '2',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号'
  }
])
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
}
</style>
