<template>
  <a-modal :open="open" title="已上传的图片预览" :footer="null" :width="800" @cancel="close">
    <div class="all_img">
      <div class="img-item" v-for="it in list" :key="it.fileId">
        <a-image :src="it.fileUrl" :preview="false" :width="230"></a-image>
      </div>
      <a-spin v-if="loading" />
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
import { defineProps, computed, onMounted, ref } from 'vue'
import { getFiles } from '@/services'

const props: any = defineProps({
  open: Boolean,
  handleOk: Function,
  close: Function,
  allFileId: Array
})
const list = ref<any[]>([])
const loading = ref(true)
onMounted(async () => {
  const fileIdList = props.allFileId
  try {
    const { data: { items = [] } = {} } = await getFiles({ fileIdList })
    list.value = items
  } catch (e: any) {}
  loading.value = false
})
</script>

<style scoped lang="less">
.all_img {
  display: flex;
  font-size: 14px;
  color: #333333;
  padding: 12px 0;
  max-height: 500px;
  position: relative;
  overflow: auto;
  flex-wrap: wrap;
  .img-item {
    position: relative;
    margin: 0 12px 12px 0;
    max-height: 230px;
    overflow: hidden;
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
  position: relative;
  .ant-spin {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
