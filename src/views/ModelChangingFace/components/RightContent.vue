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
          任务时间：{{ formatDate(Date.now()) }}
        </div>
        <div class="result_list_box" v-for="item in allList" :key="item.uid">
          <div class="result_list_box_item" v-for="n in resNum" :key="n">
            <CheckCircleOutlined v-if="item.uploadEnd" :class="{checked:checkedImg.includes(item.uid)}"/>
            <a-image src="/src/assets/indexPage/model1.png" @click="checkThis(item)" :preview="false" :width="200"
                     :height="200" v-if="item.uploadEnd"></a-image>
            <div class="skeleton_img" v-else>
              <a-skeleton-image class="placeholder_img"/>
              <a-skeleton-button active size="small" class="placeholder_button"/>
              <div class="placeholder_text">图片生成中，请稍后...</div>
            </div>
            <div class="previewMask" @click="perviewCurrent(item)">
              <EyeOutlined/>
              预览
            </div>
          </div>
        </div>
      </div>
    </div>
    <a-modal
        v-model:open="open"
        width="100%"
        wrap-class-name="full-modal"
        :footer="null"
    >
      <a-image src="/src/assets/indexPage/model1.png" :preview="false"></a-image>
      <a-image src="/src/assets/indexPage/model1.png" :preview="false"></a-image>
    </a-modal>
  </main>
</template>

<script setup lang="ts">
import {defineProps, computed, onMounted, ref} from "vue";
import {formatDate} from '@/config/formatDate'
import {
  EyeOutlined, CheckCircleOutlined
} from '@ant-design/icons-vue';

const props = defineProps({
  resultInfo: {
    type: Object,
    default: () => ({list: [], number: 4})
  },
})
const checkedImg: any = ref([])
const open: any = ref(false)
const isFirstIn = computed(() => !props.resultInfo?.list.length)
const allList = computed(() => {
  return props.resultInfo?.list || []
})
const resNum = computed(() => {
  return props.resultInfo?.number || 4
})

function checkThis(item: any) {
  const {uid} = item
  const idx = checkedImg.value.findIndex((i: string) => i === uid)
  if (idx > -1) {
    checkedImg.value.splice(idx, 1)
  } else checkedImg.value.push(uid)
}

function perviewCurrent(item: any) {
  open.value = true
}
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

    .not_empty_box {
      padding: 24px;

      .task_date {
        font-size: 14px;
        color: #333333;
        margin-bottom: 24px;
      }

      .result_list_box {
        display: flex;
        align-items: center;
        margin-bottom: 24px;
        flex-wrap: wrap;

        &_item {
          margin: 0 14px 14px 0;
          width: 200px;
          height: 200px;
          position: relative;
          overflow: hidden;

          .skeleton_img {
            position: absolute;
            width: 100%;
            height: 100%;
            z-index: 22;

            .placeholder_img {
              position: absolute;
              width: 100%;
              height: 100%;

              :deep(.ant-skeleton-image) {
                width: 100%;
                height: 100%;
              }
            }

            .placeholder_button, .placeholder_text {
              position: absolute;
              left: 50%;
              bottom: 14px;
              width: 88%;
              transform: translateX(-50%);
              font-size: 14px;
              line-height: 24px;
              text-align: center;
              color: #666666;

              :deep(.ant-skeleton-button) {
                width: 100%;
                height: 100%;
              }
            }

            .placeholder_button {
              width: 100%;
              height: 100%;
              bottom: 0;
            }
          }

          :deep(.anticon-eye) {
            font-size: 18px;
            margin-right: 8px;
          }

          :deep(.anticon-check-circle) {
            position: absolute;
            top: 10px;
            right: 10px;
            font-size: 28px;
            z-index: 99;
            cursor: pointer;

            &.checked {
              color: #52c41a;
            }
          }
        }

        :deep(.ant-image:hover ~ .previewMask) {
          transform: translateY(0);
        }

        :deep(.ant-image) {
          cursor: pointer;
        }

        .previewMask {
          display: flex;
          align-items: center;
          position: absolute;
          width: 100%;
          color: #ffffff;
          background-color: rgba(0, 0, 0, .6);
          justify-content: center;
          font-size: 14px;
          line-height: 36px;
          left: 0;
          bottom: 0;
          z-index: 111;
          transform: translateY(100%);
          transition: all linear .2s;
          cursor: pointer;

          &:hover {
            transform: translateY(0);
          }
        }
      }
    }
  }

}
</style>
<style lang="less">
.full-modal .ant-modal{
  top: 0!important;
  height: 100%;
  padding: 40px;
  .ant-modal-content{
    background-color: rgba(0,0,0,0);
    box-shadow: none;
    height: 100%;
    width: auto;
    .ant-modal-close .ant-modal-close-x{
      font-size: 24px;
      color: #ffffff;
    }
    .ant-modal-body{
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      overflow: auto;
      .ant-image{
        width: 40%;
        padding: 20px;
      }
    }
  }
}
</style>
