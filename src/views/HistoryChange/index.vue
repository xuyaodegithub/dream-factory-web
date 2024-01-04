<template>
  <main class="history_list">
    <div class="back-to" @click="router.go(-1)"><LeftOutlined /> 返回</div>
    <div class="history_list_title">历史记录</div>
    <div class="history_list_list">
      <a-card
        hoverable
        style="width: 13%"
        v-for="item in list"
        :key="item.processId"
        @click="openDetail(item)"
      >
        <a-card-meta :title="`${item.processName}：${formatDate(item.startTime)}`">
          <template #description>费用：{{ item.consumedTokenCount }}算力</template>
        </a-card-meta>
        <template #cover>
          <div class="img-box">
            <img alt="example" :src="item.originalImageUrls" />
          </div>
        </template>
      </a-card>
      <a-empty v-if="!total" description="暂无历史记录" />
    </div>
    <a-config-provider :locale="zhCN">
      <a-pagination
        v-model:current="pageIndex"
        :total="total"
        v-if="!!total"
        @change="pageChange"
      />
    </a-config-provider>
    <BathDownLoad
      v-if="openModal"
      :openModal="openModal"
      :close="() => (openModal = false)"
      :itemInfo="selectItem"
    />
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { formatDate } from '@/config/formatDate'
import { getHistoryFace } from '@/services'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { LeftOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
const [PENDING, PROCESSING, FAILED, SUCCEED] = ['PENDING', 'PROCESSING', 'FAILED', 'SUCCEED']
const openModal = ref(false)
const selectItem = ref({})
const list = ref<any[]>([])
const pageSize = ref(10)
const pageIndex = ref(1)
const total = ref(0)
const router = useRouter()
function openDetail(item: any) {
  const { processStatus } = item
  const messageText: any = {
    [PENDING]: '任务排队中，请稍后再试',
    [PROCESSING]: '任务进行中，请稍后再试',
    [FAILED]: '当前任务已失败，去看看其他的吧',
    [SUCCEED]: ''
  }
  if (messageText[processStatus]) {
    message.warning(messageText[processStatus])
    return
  }
  selectItem.value = item
  openModal.value = true
}

async function initList() {
  const ppayload = {
    pageSize: pageSize.value,
    pageIndex: pageIndex.value
  }
  const {
    data: { items, totalCount }
  } = await getHistoryFace(ppayload)
  list.value = items
  total.value = totalCount || 0
}
function pageChange(page: number, size: number) {
  pageSize.value = size
  pageIndex.value = page
  initList()
}
onMounted(() => {
  initList()
})
</script>

<style scoped lang="less">
.history_list {
  padding: 24px;
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #ffffff;
  position: relative;
  overflow: auto;
  .back-to {
    position: absolute;
    left: 24px;
    top: 16px;
    cursor: pointer;
  }

  &_title {
    font-size: 16px;
    text-align: center;
    color: #333333;
    line-height: 60px;
  }

  &_list {
    // overflow: auto;
    display: flex;
    flex-wrap: wrap;
    padding: 12px;
    // min-height: 300px;
    position: relative;

    .ant-card {
      margin: 0 12px 12px 0;
    }
    .ant-empty {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
  :deep(.ant-pagination-item-link) {
    display: flex;
    align-items: center;
  }
  .ant-pagination {
    text-align: right;
  }
  .img-box {
    height: 230px;
    overflow: hidden;
    img {
      display: block;
      width: 100%;
    }
  }
}
</style>
