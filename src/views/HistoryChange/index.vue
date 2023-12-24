<template>
  <main class='history_list'>
    <div class='history_list_title'>历史记录</div>
    <div class='history_list_list'>
      <a-card hoverable style='width: 19%' v-for='item in list' :key='item.name' @click='openDetail(item)'>
        <a-card-meta :title='`${item.name}：${formatDate(item.time)}`'>
          <template #description>费用：{{ item.pay }}算力</template>
        </a-card-meta>
        <template #cover>
          <img alt='example' :src='item.img' />
        </template>
      </a-card>
    </div>
    <BathDownLoad :openModal='openModal' :close='()=>openModal=false' :itemInfo='selectItem'/>
  </main>
</template>

<script setup lang='ts'>
import { ref } from 'vue'
import {formatDate} from '@/config/formatDate'
const openModal = ref(false)
const selectItem = ref({})
const a = [
  { name: '任务1', pay: 4, img: new URL('@/assets/carouse/carouse1.png', import.meta.url).href, time: Date.now() },
  { name: '任务2', pay: 4, img: new URL('@/assets/carouse/carouse1.png', import.meta.url).href, time: Date.now() },
  { name: '任务3', pay: 4, img: new URL('@/assets/carouse/carouse1.png', import.meta.url).href, time: Date.now() },
  { name: '任务4', pay: 4, img: new URL('@/assets/carouse/carouse1.png', import.meta.url).href, time: Date.now() },
  { name: '任务5', pay: 4, img: new URL('@/assets/carouse/carouse1.png', import.meta.url).href, time: Date.now() },
  { name: '任务6', pay: 4, img: new URL('@/assets/carouse/carouse1.png', import.meta.url).href, time: Date.now() },
  { name: '任务6', pay: 4, img: new URL('@/assets/carouse/carouse1.png', import.meta.url).href, time: Date.now() },
  { name: '任务6', pay: 4, img: new URL('@/assets/carouse/carouse1.png', import.meta.url).href, time: Date.now() },
  { name: '任务6', pay: 4, img: new URL('@/assets/carouse/carouse1.png', import.meta.url).href, time: Date.now() },
  { name: '任务6', pay: 4, img: new URL('@/assets/carouse/carouse1.png', import.meta.url).href, time: Date.now() },
  { name: '任务6', pay: 4, img: new URL('@/assets/carouse/carouse1.png', import.meta.url).href, time: Date.now() },
  { name: '任务6', pay: 4, img: new URL('@/assets/carouse/carouse1.png', import.meta.url).href, time: Date.now() },
  { name: '任务6', pay: 4, img: new URL('@/assets/carouse/carouse1.png', import.meta.url).href, time: Date.now() },
  { name: '任务6', pay: 4, img: new URL('@/assets/carouse/carouse1.png', import.meta.url).href, time: Date.now() },
  { name: '任务6', pay: 4, img: new URL('@/assets/carouse/carouse1.png', import.meta.url).href, time: Date.now() },
  { name: '任务6', pay: 4, img: new URL('@/assets/carouse/carouse1.png', import.meta.url).href, time: Date.now() },
  { name: '任务6', pay: 4, img: new URL('@/assets/carouse/carouse1.png', import.meta.url).href, time: Date.now() },
  { name: '任务6', pay: 4, img: new URL('@/assets/carouse/carouse1.png', import.meta.url).href, time: Date.now() },
  { name: '任务6', pay: 4, img: new URL('@/assets/carouse/carouse1.png', import.meta.url).href, time: Date.now() },
  { name: '任务6', pay: 4, img: new URL('@/assets/carouse/carouse1.png', import.meta.url).href, time: Date.now() },
  { name: '任务6', pay: 4, img: new URL('@/assets/carouse/carouse1.png', import.meta.url).href, time: Date.now() },
  { name: '任务6', pay: 4, img: new URL('@/assets/carouse/carouse1.png', import.meta.url).href, time: Date.now() },
  { name: '任务6', pay: 4, img: new URL('@/assets/carouse/carouse1.png', import.meta.url).href, time: Date.now() },
  { name: '任务6', pay: 4, img: new URL('@/assets/carouse/carouse1.png', import.meta.url).href, time: Date.now() },
  { name: '任务6', pay: 4, img: new URL('@/assets/carouse/carouse1.png', import.meta.url).href, time: Date.now() },
  { name: '任务6', pay: 4, img: new URL('@/assets/carouse/carouse1.png', import.meta.url).href, time: Date.now() },
  { name: '任务6', pay: 4, img: new URL('@/assets/carouse/carouse1.png', import.meta.url).href, time: Date.now() },
  { name: '任务6', pay: 4, img: new URL('@/assets/carouse/carouse1.png', import.meta.url).href, time: Date.now() },
  { name: '任务6', pay: 4, img: new URL('@/assets/carouse/carouse1.png', import.meta.url).href, time: Date.now() },
  { name: '任务6', pay: 4, img: new URL('@/assets/carouse/carouse1.png', import.meta.url).href, time: Date.now() },
  { name: '任务6', pay: 4, img: new URL('@/assets/carouse/carouse1.png', import.meta.url).href, time: Date.now() },
  { name: '任务6', pay: 4, img: new URL('@/assets/carouse/carouse1.png', import.meta.url).href, time: Date.now() },
  { name: '任务6', pay: 4, img: new URL('@/assets/carouse/carouse1.png', import.meta.url).href, time: Date.now() },
  { name: '任务6', pay: 4, img: new URL('@/assets/carouse/carouse1.png', import.meta.url).href, time: Date.now() },
  { name: '任务6', pay: 4, img: new URL('@/assets/carouse/carouse1.png', import.meta.url).href, time: Date.now() },
  { name: '任务6', pay: 4, img: new URL('@/assets/carouse/carouse1.png', import.meta.url).href, time: Date.now() },
  { name: '任务6', pay: 4, img: new URL('@/assets/carouse/carouse1.png', import.meta.url).href, time: Date.now() },
  { name: '任务6', pay: 4, img: new URL('@/assets/carouse/carouse1.png', import.meta.url).href, time: Date.now() },
  { name: '任务6', pay: 4, img: new URL('@/assets/carouse/carouse1.png', import.meta.url).href, time: Date.now() },
  { name: '任务6', pay: 4, img: new URL('@/assets/carouse/carouse1.png', import.meta.url).href, time: Date.now() },
  { name: '任务6', pay: 4, img: new URL('@/assets/carouse/carouse1.png', import.meta.url).href, time: Date.now() },
  { name: '任务6', pay: 4, img: new URL('@/assets/carouse/carouse1.png', import.meta.url).href, time: Date.now() },
  { name: '任务6', pay: 4, img: new URL('@/assets/carouse/carouse1.png', import.meta.url).href, time: Date.now() }
]
const list = ref(a)
function openDetail(item:any){
  console.log(item,'p[p[')
  selectItem.value=item
  openModal.value=true
}

</script>

<style scoped lang='less'>
.history_list {
  padding: 24px;
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #ffffff;

  &_title {
    font-size: 16px;
    text-align: center;
    color: #333333;
    line-height: 60px;
  }

  &_list {
    overflow: auto;
    display: flex;
    flex-wrap: wrap;
    padding: 12px;

    .ant-card {
      margin: 0 12px 12px 0;
    }
  }
}
</style>
