<template>
  <a-modal :open='downShow' title='批量下载图片' :footer='null' @cancel='close' class='down_dialog' width='500px'>
    <div class='all_replace'>
      <label>下载全部替换图片</label>
      <a-button type='primary' @click='handleOk(1)'>下载</a-button>
    </div>
    <div class='all_img'>
      <label>下载已认可图片</label>
      <a-button type='primary' @click='handleOk(2)'>下载</a-button>
    </div>
    <div class='down_dec'>
      通过压缩包形式下载图片，已认可的图片为预览图片时点击“认可这张图”
    </div>
  </a-modal>
</template>

<script setup lang='ts'>
import { defineProps } from 'vue'

const props: any = defineProps({
  downShow: Boolean,
  close: Function,
  handleOk: Function
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
