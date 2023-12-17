<template>
  <main class="RightContent">
    <div class="concat_us">
      <div>结果预览：</div>
      <a-button type="link" class="view_history">查看历史记录</a-button>
    </div>
    <div class="result_list">
      <div class="empty_box" v-if="isFirstIn">
        <a-empty description="快去左侧上传图片试试吧~"/>
      </div>
      <div class="not_empty_box" v-else>
        <div class="task_date">
          任务时间：{{formatDate(Date.now())}}
        </div>
        <div class="result_list_box" v-for="item in allList" :key="item.uid">
          <div class="result_list_box_item" v-for="n in resNum" :key="n">
            <a-image :src="item" :preview="true" :width="200" :height="200" v-if="item.uploadEnd"></a-image>
            <div class="skeleton_img" v-else>
              <a-skeleton-image class="placeholder_img"/>
              <a-skeleton-button active size="small" class="placeholder_button"/>
              <div class="placeholder_text">图片生成中，请稍后...</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import {defineProps, computed, onMounted} from "vue";
import {formatDate} from '@/config/formatDate'
const props = defineProps({
  resultInfo: {
    type: Object,
    default: () => ({list:[],number:4})
  },
  loading:{
    type:Boolean,
    default:false
  },
})
onMounted(() => {})
const isFirstIn = computed(() => !props.resultInfo?.list.length && !props.loading)
const allList = computed(()=>{
  return props.resultInfo?.list || []
})
const resNum = computed(()=>{
  return props.resultInfo?.number || 4
})

</script>

<style scoped lang="less">
.RightContent {
  height: 100%;
  display: flex;
  flex-direction: column;

  .concat_us {
    display: flex;
    font-size: 16px;
    margin-bottom: 12px;

    &_dec {
      font-size: 14px;
      color: #999999;
    }

    .view_history {
      margin-left: auto;
    }
  }

  .result_list {
    flex: 1;
    overflow: auto;
    border: 1px solid #999999;
    border-radius: 10px;
    position: relative;

    .empty_box {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
    .not_empty_box{
      padding: 24px;
      .task_date{
        font-size: 14px;
        color: #333333;
        margin-bottom: 24px;
      }
      .result_list_box{
        display: flex;
        align-items: center;
        margin-bottom: 24px;
        flex-wrap: wrap;
        &_item{
          margin:0 14px 14px 0;
          width: 200px;
          height: 200px;
          position: relative;
          .skeleton_img{
            position: absolute;
            width: 100%;
            height: 100%;
            z-index: 22;
            .placeholder_img{
              position: absolute;
              width: 100%;
              height: 100%;
              :deep(.ant-skeleton-image){
                width: 100%;
                height: 100%;
              }
            }
            .placeholder_button,.placeholder_text{
              position: absolute;
              left: 50%;
              bottom: 14px;
              width: 88%;
              transform: translateX(-50%);
              font-size:14px;
              line-height:24px;
              text-align:center;
              color:#666666;
              :deep(.ant-skeleton-button){
                width: 100%;
                height: 100%;
              }
            }
            .placeholder_button{
              width: 100%;
              height: 100%;
              bottom: 0;
            }
          }
        }
      }
    }
  }
}
</style>
