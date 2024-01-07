<template>
  <a-modal
    :open="openModal"
    :title="title"
    :footer="null"
    @cancel="close"
    class="down_dialog"
    width="800px"
  >
    <div class="all_replace" v-if="list.length">
      <a-button
        type="primary"
        @click="downLoad(1)"
        style="margin-right: 24px"
        :disabled="messageBox"
        >下载全部</a-button
      >
      <a-button type="primary" @click="downLoad(2)" :disabled="messageBox">下载认可</a-button>
    </div>
    <div class="all_img">
      <div class="img-item" v-for="it in list" :key="it.fileId" @click="choseThis(it)">
        <HeartOutlined :class="{ checked: checkedFileIds.includes(it.fileId) }" />
        <a-image :src="it.thumbnailFileUrl" :preview="false" :width="230"></a-image>
      </div>
      <a-empty description="暂无记录可以查看" v-if="!list.length" />
    </div>
    <div class="down_dec">通过压缩包形式下载图片，已认可的图片为预览图片时点击“认可这张图”</div>
  </a-modal>
</template>

<script setup lang="ts">
import { defineProps, computed, onMounted, ref } from 'vue'
import { formatDate } from '@/config/formatDate'
import { rotationProcessResult, getZipDownLoadUrl } from '@/services'
import { HeartOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

const props: any = defineProps({
  openModal: Boolean,
  itemInfo: Object,
  close: Function
})
const list: any = ref([])
const messageBox: any = ref(null)
const checkedFileIds = ref<string[]>([])
const title = computed(() => {
  const { processName, startTime } = props.itemInfo
  return `${processName}：${formatDate(startTime)}`
})
function choseThis(item: any) {
  const { fileId } = item
  const idx = checkedFileIds.value.findIndex((i: string) => i === fileId)
  if (idx > -1) checkedFileIds.value.splice(idx, 1)
  else checkedFileIds.value.push(fileId)
}
async function downLoad(type: number) {
  if (type === 2 && !checkedFileIds.value.length) return message.warning('请先选择要下载的图片')
  if (type === 1 && !list.value.length) return message.warning('当前无图片可以下载')
  messageBox.value = message.loading('正在生成文件zip包，请稍后...', 0)

  //下载全部
  const payload = {
    fileIdList: type === 1 ? list.value.map((i: any) => i.fileId) : checkedFileIds.value
  }
  const data = await getZipDownLoadUrl(payload)
  const blob = new Blob([data], { type: 'application/zip' })
  const objurl = URL.createObjectURL(blob)
  console.log(objurl, 'objurl')
  const saveLink = document.createElement('a')
  saveLink.href = objurl
  saveLink.download = `${type === 1 ? '全部图片.zip' : '认可图片.zip'}`
  saveLink.click()
  URL.revokeObjectURL(objurl)
  setTimeout(() => {
    messageBox.value()
    messageBox.value = null
  }, 1500)
}
onMounted(async () => {
  const { processId = '' } = props?.itemInfo || {}
  console.log(processId, 'processId')
  if (processId) {
    const {
      data: { taskList = [] }
    }: any = await rotationProcessResult(processId)
    list.value = taskList.reduce((pre: any, item: any) => {
      const { processedFileList } = item
      return [...pre, ...processedFileList]
    }, [])
  }
})
</script>

<style lang="less">
.down_dialog {
  top: 15%;

  .all_replace,
  .all_img {
    display: flex;
    font-size: 14px;
    color: #333333;
    padding: 12px 0;
    align-items: center;
    max-height: 500px;
    position: relative;
    overflow: auto;
    flex-wrap: wrap;
    .img-item {
      position: relative;
      margin: 0 12px 12px 0;
      cursor: pointer;
      .anticon-heart {
        position: absolute;
        font-size: 24px;
        top: 12px;
        right: 12px;
        z-index: 99;
        color: #999999;

        &.checked {
          color: #f16d2b;
        }
      }
    }
    label {
      margin-right: 24px;
      width: 120px;
      text-align: right;
    }
    .ant-empty {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .all_img {
    min-height: 350px;
  }

  .down_dec {
    font-size: 14px;
    color: #999999;
    margin-top: 24px;
  }
}
</style>
