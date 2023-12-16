<script setup lang="ts">
import {useRouter, useRoute} from 'vue-router'
import {
  StepBackwardOutlined
} from '@ant-design/icons-vue';
import {onMounted, ref} from "vue";

const router = useRouter()
const route = useRoute()
const pageList: any = import.meta.glob('../../assets/indexPage/index*.png', {eager: true})
const modelList: any = import.meta.glob('@/assets/indexPage/model*.png', {eager: true})
const imageList: any = ref([])

async function initImages() {
  const hBase = 540//瀑布流高度基数
  const clientW = window.innerWidth
  const list = Object.keys(modelList).map((item) => {
    return new Promise(resolve => {
      const img = new Image()
      img.onload = () => {
        resolve(img)
      }
      img.src = modelList[item].default
    })
  })
  const l = await Promise.all(list)
  let wArr: number = 0
  let imgArr: Array<any> = []
  l.forEach((item: any, idx: number) => {
    const {width, height, src} = item
    const scale = width / height
    const w = hBase * scale
    wArr = wArr + w + 24
    imgArr.push({src, w, h: hBase})
    if (wArr > clientW) {
      const len = imgArr.length
      const realH = hBase * (clientW - 24 * len) / (wArr - 24 * len)
      imageList.value = [...imageList.value, ...imgArr.map((it: any) => {
        return {
          ...it,
          w: realH * scale,
          h: realH
        }
      })]
      wArr = 0
      imgArr = []
    }
    if (idx === l.length - 1 && imgArr.length) {
      imageList.value = [...imageList.value, ...imgArr]
    }
  })
}

onMounted(async () => {
  await initImages()
  console.log(imageList.value, '-=-=', imageList)
})

</script>

<template>
  <main class="content">
    <div class="page_image" v-for="(item,idx) in Object.keys(pageList)" :key="item">
      <a-image :src="pageList[item].default" :preview="false"></a-image>
      <div class="use-btn-cover" v-if="idx===0">
        <a-button size="large">立即使用</a-button>
        <a-button size="large">合作咨询</a-button>
      </div>
    </div>
    <div class="exhibition-of-works">
      <div class="model_item" v-for="item in imageList" :key="item">
        <a-image :src="item.src" :preview="false" :height="item.h"></a-image>
      </div>
    </div>
  </main>
</template>
<style lang="less" scoped>
.content {
  height: 100%;
  overflow: auto;

  .page_image {
    margin-bottom: 80px;
    position: relative;

    .use-btn-cover {
      position: absolute;
      left: 14%;
      bottom: 25%;
      display: flex;

      .ant-btn {
        height: 54px;
        line-height: 54px;
        padding: 0;
        width: 140px;
      }

      .ant-btn:first-child {
        margin-right: 60px;
        background-color: #eecf9f;

        &:hover {
          color: #333333;
          border-color: #eecf9f;
        }
      }
    }

    img {
      display: block;
      width: 100%;
    }
  }

  .exhibition-of-works {
    display: flex;
    flex-wrap: wrap;
    padding: 24px 0;
    margin-bottom: 40px;

    .model_item {
      padding: 12px;
      box-sizing: border-box;
      border-radius: 10px;
      overflow: hidden;

      :deep(.ant-image-img) {
        box-shadow: 0 0 2px #999999;
        display: block;
        border-radius: 10px;
        overflow: hidden;

        &:hover {
          transform: scale(1.5);
          transition: all linear .3s;
        }
      }
    }
  }
}
</style>
