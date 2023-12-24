<template>
  <main class='RightContent'>
    <div class='concat_us'>
      <div>结果预览：</div>
      <a-button type='primary' class='view_history' size='large' @click='()=>router.push("/historyChange")'>
        查看历史记录
      </a-button>
    </div>
    <div class='result_list'>
      <div class='empty_box' v-if='isFirstIn'>
        <a-empty description='快去左侧上传图片试试吧~'/>
      </div>
      <div class='not_empty_box' v-else>
        <div class='task_date'>
          任务时间：{{ taskList[0]?.processName || formatDate(Date.now()) }}
          <a-button type='primary' class='view_history' size='large' @click='()=>downShow=true'>批量下载</a-button>
        </div>
        <div class='result_list_box' v-for='item in allList' :key='item.uid'>
          <div class='result_list_box_item' v-for='n in item.number' :key='n'>
            <CheckCircleOutlined v-if='item.thumbnailFileUrl' :class='{checked:checkedImg.includes(item.uid)}'/>
            <a-image :src='item.thumbnailFileUrl' @click='checkThis(item)' :preview='false' :width='200'
                     v-if='item.thumbnailFileUrl'></a-image>
            <div class='skeleton_img' v-else>
              <a-skeleton-image class='placeholder_img'/>
              <a-skeleton-button active size='small' class='placeholder_button'/>
              <div class='placeholder_text'>图片生成中，请稍后...</div>
            </div>
            <div class='previewMask' @click.stop='perviewCurrent(item)'>
              <EyeOutlined/>
              预览
            </div>
          </div>
        </div>
      </div>
    </div>
    <a-modal
        v-model:open='open'
        width='80%'
        wrap-class-name='full-modal'
        :footer='null'
    >
      <span><left-outlined/></span>
      <a-image :src='mapImg' :preview='false'></a-image>
      <div class='sec-img'>
        <CheckCircleOutlined :class='{checked:true}'/>
        <a-image :src='mapImg' :preview='false'></a-image>
      </div>
      <span><right-outlined/></span>
      <a-button type='primary' class='view_btn'>认可这张图</a-button>
    </a-modal>
    <DownLoad :downShow='downShow' :close='()=>downShow=false' :handleOk='handleOk'/>
  </main>
</template>

<script setup lang='ts'>
import {defineProps, computed, onMounted, ref, watch, nextTick} from 'vue'
import {useRouter} from 'vue-router'
import {formatDate} from '@/config/formatDate'
import {
  EyeOutlined, CheckCircleOutlined
} from '@ant-design/icons-vue'
import DownLoad from '@/components/DownLoad/index.vue'
import {commitProcess, rotationProcessResult, getImgDownUrl, getProcessIdImgDownUrl} from '@/services'
//processStatus PENDING - 排队中 PROCESSING - 处理中 FAILED - 已失败 SUCCEED - 已完成

const [PENDING, PROCESSING, FAILED, SUCCEED] = ['PENDING', 'PROCESSING', 'FAILED', 'SUCCEED']
const router = useRouter()
const mapImg: any = new URL('@/assets/carouse/carouse1.png', import.meta.url).href
const props = defineProps({
  resultInfo: {
    type: Object,
    default: () => ({list: [], number: 4, modelSmile: false, modelId: ''})
  }
})
import {
  LeftOutlined,
  RightOutlined
} from '@ant-design/icons-vue'
import axios from "axios";

const checkedImg: any = ref([])
const open: any = ref(false)
const downShow: any = ref(false)
const taskList: any = ref([])
const isFirstIn = computed(() => !props.resultInfo?.list.length)
const allList = computed(() => {
  return taskList.value.reduce((pre: any, i: any) => {
    const {list, number} = i
    console.log(number, 'number')
    return [...pre, ...list.map((s: any) => ({...s, number}))]
  }, [])
})
const taskUids = computed(() => {
  return taskList.value.reduce((pre: any, i: any) => {
    const {list} = i
    return [...pre, ...list.map((t: any) => t.uid)]
  }, [])
})
watch(props.resultInfo, () => {
  createTask()
}, {deep: true})

async function createTask() {
  const {list, number, modelSmile, modelId} = props.resultInfo
  const l = [...list].filter((i: any) => !taskUids.value.includes(i.uid)).map((item: any) => {
    return {
      ...item,
    }
  })
  if (!l.length) return
  const task = {list: l, modelSmile, number, modelId}
  startTask(task)
}

async function startTask(task: any) {
  const {list, modelSmile, number, modelId} = task
  const payload = {
    modelId,
    fileIdList: list.map((i: any) => i.fileId),
    modelSmile,
    copyCount: number
  }
  //开始任务
  const {data: {processId = ''} = {}} = await commitProcess(payload)
  if (processId) {
    taskList.value.push({...task, processId, processName: Date.now()})
    rotationResults(processId)
  }
}

//轮训结果
async function rotationResults(processId: string | number) {
  try {
    const {data: {taskList: resList = [], processStatus, processName},} = await rotationProcessResult(processId)
    const currIdx = taskList.value.findIndex(({processId: id}: any) => id === processId)
    const {list = []} = taskList.value[currIdx]
    resList.forEach((item: any) => {
      const {baseFile: {fileId, originalFileUrl, thumbnailFileUrl} = {}, processedFileList} = item
      const currfileIdx = list.findIndex(({fileId: fId}: any) => fId === fileId)
      if (currfileIdx > -1) {
        list[currfileIdx] = {...list[currfileIdx], originalFileUrl, thumbnailFileUrl, processedFileList}
      }
    })
    taskList.value[currIdx] = {...taskList.value[currIdx], list, processName}
    // console.log(taskList.value, 'taskList.value')
    if (![FAILED, SUCCEED].includes(processStatus)) setTimeout(() => rotationResults(processId), 1500)
  } catch (e: any) {
    setTimeout(() => rotationResults(processId), 1500)
  }

}

onMounted(() => {
  // rotationResults(10)
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

function handleOk(type: number) {
  console.log(type, 'type')
  downShow.value = false
}
</script>

<style scoped lang='less'>
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

        .ant-btn {
          margin-left: 24px;
        }
      }

      .result_list_box {
        display: flex;
        align-items: center;
        margin-bottom: 24px;
        flex-wrap: wrap;

        &_item {
          margin: 0 12px 12px 0;
          width: 200px;
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
<style lang='less'>
.full-modal .ant-modal {
  top: 0 !important;
  height: 100%;
  padding: 40px;

  .ant-modal-content {
    background-color: rgba(0, 0, 0, 0);
    box-shadow: none;
    height: 100%;
    padding: 0;

    .ant-modal-close .ant-modal-close-x {
      font-size: 24px;
      color: #ffffff;
      margin-left: 100px;
    }

    .ant-modal-body {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      overflow: auto;
      width: 100%;

      .view_btn {
        position: absolute;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
      }

      .ant-image, .sec-img {
        width: 48%;

        &:nth-child(2) {
          margin-right: 20px;
        }
      }

      .sec-img {
        position: relative;

        .ant-image {
          width: 100%;
        }
      }

      .anticon-left, .anticon-right {
        font-size: 48px;
        position: absolute;
        top: 50%;
        color: #ffffff;
        cursor: pointer;
      }

      .anticon-left {
        left: 0;
        transform: translate(-200%, -50%);
      }

      .anticon-right {
        right: 0;
        transform: translate(200%, -50%);
      }

      .anticon-check-circle {
        position: absolute;
        top: 24px;
        right: 24px;
        z-index: 99;
        font-size: 36px;
        //color: #7cb305;
        color: #999999;
      }
    }
  }
}
</style>
