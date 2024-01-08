<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { StepBackwardOutlined } from '@ant-design/icons-vue'
import { onMounted, ref, onUnmounted } from 'vue'
import { resizeImg } from '@/config'
const router = useRouter()
const route = useRoute()
const pageList: any = import.meta.glob('@/assets/indexPage/index*.png', { eager: true })
const modelList: any = import.meta.glob('@/assets/indexPage/model*.png', { eager: true })
const imageList: any = ref([])
const oriImgsInfo: any = ref([])

async function initImages() {
  const r = /(?<=\_).*?(?=\.)/g
  const list = Object.keys(modelList).map((item: any) => {
    const size: any = item.match(r)[0].split('-')
    return { width: +size[0], height: +size[1], src: modelList[item].default }
  })
  // const l = await Promise.all(list)
  oriImgsInfo.value = list
  imageList.value = resizeImg(oriImgsInfo.value)
}
function resize() {
  imageList.value = resizeImg(oriImgsInfo.value)
}
onMounted(async () => {
  await initImages()
  window.addEventListener('resize', resize)
})
onUnmounted(() => {
  window.removeEventListener('resize', resize)
})
</script>

<template>
  <main class="content">
    <div class="page_image" v-for="(item, idx) in Object.keys(pageList)" :key="item">
      <a-image :src="pageList[item].default" :preview="false"></a-image>
      <div class="use-btn-cover" v-if="idx === 0">
        <a-button size="large" @click="router.push('/changingFace')">立即使用</a-button>
        <!--        <a-button size="large">合作咨询</a-button>-->
      </div>
    </div>
    <div class="exhibition-of-works">
      <div class="model_item" v-for="item in imageList" :key="item">
        <a-image :src="item.src" :preview="false" :height="item.h"></a-image>
      </div>
    </div>
    <div class="index_footer">
      <a href="https://beian.miit.gov.cn/#/Integrated/index" target="_blank"
        >浙ICP备2022020264号-2</a
      >
    </div>
  </main>
</template>
<style lang="less" scoped>
.content {
  height: 100%;
  overflow: auto;
  background-color: #ffffff;

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
          transition: all linear 0.3s;
        }
      }
    }
  }
  .index_footer {
    text-align: center;
    background-color: #333333;
    line-height: 56px;
    a {
      color: #999999;
      &:hover {
        color: #ffffff;
      }
    }
  }
}
</style>
