<script setup lang="ts">
import {useRouter, useRoute} from 'vue-router'
import {
  StepBackwardOutlined
} from '@ant-design/icons-vue';

const router = useRouter()
const route = useRoute()
const pageList = import.meta.glob('../../assets/indexPage/index*.png', {eager: true})
const modelList = import.meta.glob('@/assets/indexPage/model*.png', {eager: true})

function add() {
  router.push('/')
}
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
      <div class="model_item" v-for="item in Object.keys(modelList)" :key="item">
        <a-image :src="modelList[item].default" :preview="false"/>
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
    height: 550px;

    .model_item {
      height: 100%;
     /deep/ .ant-image{
        height: 100%;
      }
      /deep/.ant-image-img {
        height: 100%;
        width: auto;
        display: block;
      }
    }
  }
}
</style>