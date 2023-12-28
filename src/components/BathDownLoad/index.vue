<template>
  <a-modal :open='openModal' :title="title" :footer='null' @cancel='close' class='down_dialog' width='800px'>
    <div class='all_replace'>
      <a-button type='primary' @click='downLoad(1)'>批量下载</a-button>
    </div>
    <div class='all_img'>

    </div>
    <div class='down_dec'>
      通过压缩包形式下载图片，已认可的图片为预览图片时点击“认可这张图”
    </div>
  </a-modal>
</template>

<script setup lang='ts'>
import { defineProps, computed,onMounted } from 'vue'
import { formatDate } from '@/config/formatDate'
import {rotationProcessResult} from '@/services'
const props: any = defineProps({
  openModal: Boolean,
  itemInfo: Object,
  close: Function,
  handleOk:Function
})
const title = computed(() => {
  const {processName,startTime} =props.itemInfo
   return  `${processName}：${formatDate(startTime)}`
})
function downLoad(k:number){
  props.handleOk && props.handleOk(k)
}
onMounted(async ()=>{
  // const {processId = ''} = props?.itemInfo || {}
  // console.log(processId,'processId')
  // if(processId){
  //   const {data:{baseFile:{originalFileUrl,thumbnailFileUrl}={},}}:any = await rotationProcessResult(processId)
  // }
})
</script>

<style lang='less'>
.down_dialog {
  top: 30%;

  .all_replace, .all_img {
    display: flex;
    font-size: 14px;
    color: #333333;
    padding: 12px 0;
    align-items: center;
    max-height: 500px;
    overflow: auto;

    label {
      margin-right: 24px;
      width: 120px;
      text-align: right;
    }
  }

  .down_dec {
    font-size: 14px;
    color: #999999;
    margin-top: 24px;
  }
}

</style>
