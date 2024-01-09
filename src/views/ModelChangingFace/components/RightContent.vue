<template>
  <main class="RightContent">
    <div class="concat_us">
      <div>
        结果预览：
        <a-button type="primary" class="down_load_btn" @click="downLoadImgs()">批量下载</a-button>
      </div>
      <a-button type="primary" class="view_history" @click="() => router.push('/historyChange')">
        查看历史记录
      </a-button>
    </div>
    <div class="result_list" id="listDom">
      <div class="empty_box" v-if="!processList.length">
        <a-empty description="快去左侧上传图片试试吧~" />
      </div>
      <div class="not_empty_box" v-else>
        <div class="process_list" v-for="it in processList" :key="it.processId">
          <div :class="{ task_date: true, process_fail: it.processStatus === FAILED }">
            任务时间：{{ it?.processName || formatDate(Date.now()) }}
            <span style="margin-left: 20px" v-if="it.processStatus === FAILED"
              >任务失败，或部分失败，请换一张图片试试吧。</span
            >
          </div>
          <div class="result_list_box" v-for="item in it.list" :key="item.fileId">
            <div
              class="result_list_box_item"
              v-for="n in it.number"
              :key="n"
              @click="checkThis(item, n - 1)"
            >
              <HeartOutlined
                v-if="it.processStatus === SUCCEED"
                :class="{ checked: checkedStatus(item, n - 1) }"
              />
              <a-image
                :src="imageUrlMethod(it, item, n - 1)"
                :preview="false"
                :width="200"
                v-if="[FAILED, SUCCEED].includes(it.processStatus)"
              ></a-image>
              <!--              //失败了不能预览-->
              <div class="skeleton_img" v-else>
                <a-skeleton-image class="placeholder_img" />
                <a-skeleton-button active size="small" class="placeholder_button" />
                <div class="placeholder_text">图片生成中，请稍后...</div>
              </div>
              <!-- //失败图标 -->
              <a-popover>
                <template #content>
                  <p>{{ item.failedReason || '-' }}</p>
                </template>
                <ExclamationCircleOutlined
                  v-if="it.processStatus === FAILED && !item.processedFileList?.length"
                />
              </a-popover>

              <div
                class="previewMask"
                @click.stop="perviewCurrent(item, n - 1)"
                v-if="
                  [SUCCEED, FAILED].includes(it.processStatus) && item.processedFileList?.length
                "
              >
                <EyeOutlined />
                预览
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--    图片预览modal-->
    <a-modal v-model:open="open" width="70%" wrap-class-name="full-modal" :footer="null">
      <span @click="perviewNext(false)"><left-outlined /></span>
      <a-image :src="perviewObj.originalFileUrl" :preview="false">
        <template #placeholder>
          <a-image :src="perviewObj.thumbnailFileUrl" width="100%" :preview="false" />
        </template>
      </a-image>
      <div class="sec-img">
        <HeartOutlined
          :class="{ checked: perviewChecked }"
          v-if="!!perviewObj.resOriginalFileUrl"
        />
        <a-image :src="perviewObj.resOriginalFileUrl || fallback" width="100%" :preview="false">
          <template #placeholder>
            <a-image
              :src="perviewObj.resThumbnailFileUrl || fallback"
              width="100%"
              :preview="false"
            />
          </template>
        </a-image>
      </div>
      <span @click="perviewNext(true)"><right-outlined /></span>
      <a-button
        type="primary"
        class="view_btn"
        @click="checkThis()"
        v-if="!!perviewObj.resOriginalFileUrl"
      >
        {{ perviewChecked ? '取消认可' : '认可这张图' }}
      </a-button>
    </a-modal>
    <DownLoad :downShow="downShow" :close="() => (downShow = false)" :handleOk="handleOk" />
  </main>
</template>

<script setup lang="ts">
import { defineProps, computed, onMounted, ref, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { formatDate } from '@/config/formatDate'
import { EyeOutlined, CheckCircleOutlined, HeartOutlined } from '@ant-design/icons-vue'
import DownLoad from '@/components/DownLoad/index.vue'
import { commitProcess, rotationProcessResult, getZipDownLoadUrl, initBillings } from '@/services'
import { fallback } from '@/config'
import { userInfo } from '@/stores'
const userStore: any = userInfo()

//processStatus PENDING - 排队中 PROCESSING - 处理中 FAILED - 已失败 SUCCEED - 已完成

const [PENDING, PROCESSING, FAILED, SUCCEED] = ['PENDING', 'PROCESSING', 'FAILED', 'SUCCEED']
const router = useRouter()
const props = defineProps({
  resultInfo: {
    type: Object,
    default: () => ({ list: [], number: 4, modelSmile: false, modelId: '' })
  }
})
import { LeftOutlined, RightOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

const checkedImg: any = ref([])
const open: any = ref(false)
const downShow: any = ref(false)
const processList: any = ref([])
const perViewFileId = ref('')
const perviewObj = computed(() => {
  // const idx = allImages.value.findIndex((i: any) => i.fileId === fileId)
  const idx = allImages.value.findIndex((i: any) => i.fileId === perViewFileId.value)
  if (idx > -1) return allImages.value[idx]
  else return {}
})
const taskUids = computed(() => {
  return processList.value.reduce((pre: any, i: any) => {
    const { list } = i
    return [...pre, ...list.map((t: any) => t.uid)]
  }, [])
})
//当前预览图片是否认可状态
const perviewChecked = computed(() => {
  return checkedImg.value.includes(perViewFileId.value)
})
const allFileIds = computed(() => {
  return processList.value.reduce((per: Array<any>, item: any) => {
    const { list }: any = item
    const fileIds = list.reduce(
      (p: any, it: any) => [...p, ...it.processedFileList.map((i: any) => i.fileId)],
      []
    )
    return [...per, ...fileIds]
  }, [])
})
const allImages = computed(() => {
  return processList.value
    .reduce((per: Array<any>, item: any) => {
      const { list }: any = item
      const files = list.reduce(
        (p: any, it: any) => [
          ...p,
          ...it.processedFileList.map((i: any) => ({
            fileId: i.fileId,
            originalFileUrl: it.originalFileUrl || '',
            thumbnailFileUrl: it.thumbnailFileUrl || '',
            resOriginalFileUrl: i.originalFileUrl || '',
            resThumbnailFileUrl: i.thumbnailFileUrl || ''
          }))
        ],
        []
      )
      return [...per, ...files]
    }, [])
    .filter((i: any) => i.resThumbnailFileUrl)
})
watch(
  props.resultInfo,
  () => {
    createTask()
  },
  { deep: true }
)

async function createTask() {
  const { list, number, modelSmile, modelId } = props.resultInfo
  const l = [...list]
    .filter((i: any) => !taskUids.value.includes(i.uid))
    .map((item: any) => {
      return {
        processedFileList: [],
        originalFileUrl: '',
        thumbnailFileUrl: '',
        taskStatus: PENDING,
        failedReason: '',
        ...item
      }
    })
  if (!l.length) return
  const task = { list: l, modelSmile, number, modelId }
  startTask(task)
}

async function startTask(task: any) {
  const { list, modelSmile, number, modelId } = task
  const payload = {
    modelId,
    fileIdList: list.map((i: any) => i.fileId),
    modelSmile,
    copyCount: number
  }
  //开始任务
  const { data: { processId = '' } = {} } = await commitProcess(payload)
  if (processId) {
    processList.value.unshift({
      ...task,
      processId,
      processName: Date.now(),
      processStatus: PROCESSING
    })
    rotationResults(processId)
    // await nextTick()
    // const dom: any = document.querySelector('#listDom')
    // dom.scrollTop = dom.scrollHeight
  }
}

//轮训结果
async function rotationResults(processId: string | number) {
  try {
    const {
      data: { taskList: resList = [], processStatus, processName }
    } = await rotationProcessResult(processId)
    const currIdx = processList.value.findIndex(({ processId: id }: any) => id === processId)
    const { list = [] } = processList.value[currIdx]
    resList.forEach((item: any) => {
      const {
        baseFile: { fileId = '', originalFileUrl = '', thumbnailFileUrl = '' } = {},
        processedFileList = [],
        taskStatus = SUCCEED,
        failedReason = '换脸失败'
      }: any = item
      const currfileIdx = list.findIndex(({ fileId: fId }: any) => fId === fileId)
      if (currfileIdx > -1) {
        list[currfileIdx] = {
          ...list[currfileIdx],
          originalFileUrl,
          thumbnailFileUrl,
          processedFileList,
          taskStatus,
          failedReason: failedReason || '换脸失败'
        }
      }
    })
    processList.value[currIdx] = { ...processList.value[currIdx], list, processName }
    if (![FAILED, SUCCEED].includes(processStatus))
      setTimeout(() => rotationResults(processId), 1500)
    if ([FAILED, SUCCEED].includes(processStatus)) {
      processList.value[currIdx].processStatus = processStatus
      updataBill()
      console.log(processList.value, '------')
    }
    // console.log(processList.value, 'ppppppppp')
  } catch (e: any) {}
}

onMounted(() => {
  // rotationResults(10)
})

function checkThis(item?: any, n: number = 0) {
  if (item) {
    const { processedFileList = [] } = item || {}
    const fileId = processedFileList[n]?.fileId || ''
    const i: number = checkedImg.value.findIndex((t: string) => t === fileId)
    if (i > -1) {
      checkedImg.value.splice(i, 1)
    } else checkedImg.value.push(fileId)
    return
  }
  const i: number = checkedImg.value.findIndex((t: string) => t === perViewFileId.value)
  if (i > -1) {
    checkedImg.value.splice(i, 1)
  } else checkedImg.value.push(perViewFileId.value)
}

function checkedStatus(item: any, idx: number) {
  const { processedFileList } = item
  return checkedImg.value.includes(processedFileList[idx]?.fileId) || false
}

function perviewCurrent(item: any, n: number) {
  const { processedFileList = [] } = item
  const fileId = processedFileList[n]?.fileId || ''
  if (!fileId) return
  // const idx = allImages.value.findIndex((i: any) => i.fileId === fileId)
  perViewFileId.value = fileId
  open.value = true
  // const { originalFileUrl, thumbnailFileUrl, processedFileList } = item
  // perviewObj.value = { originalFileUrl, thumbnailFileUrl, processedFileList, index: n }
}

function perviewNext(type: boolean) {
  const idx = allImages.value.findIndex((item: any) => item.fileId === perViewFileId.value)
  if (type) {
    const ix = allImages.value.findIndex(
      (item: any, i: number) => item.resOriginalFileUrl && i > idx
    )
    if (ix > -1) perViewFileId.value = allImages.value[ix]?.fileId || ''
    else {
      const i = allImages.value.findIndex((item: any) => item.resOriginalFileUrl)
      perViewFileId.value = allImages.value[i]?.fileId || ''
    }
  } else {
    const ix = allImages.value.findLastIndex(
      (item: any, i: number) => item.resOriginalFileUrl && i < idx
    )
    if (ix > -1) perViewFileId.value = allImages.value[ix]?.fileId || ''
    else {
      const i = allImages.value.findLastIndex((item: any) => item.resOriginalFileUrl)
      perViewFileId.value = allImages.value[i]?.fileId || ''
    }
  }
}
function downLoadImgs() {
  if (!allFileIds.value.length) return message.warning('当前无图片可以下载，请先去上传试试吧')
  downShow.value = true
}
async function handleOk(type: number) {
  if (type === 2 && !checkedImg.value.length) return message.warning('请先选择认可的图片')
  const hide = message.loading('正在生成文件zip包，请稍后...', 0)

  //下载全部
  const payload = {
    fileIdList: type === 1 ? allFileIds.value : checkedImg.value
  }
  downShow.value = false
  const data = await getZipDownLoadUrl(payload)
  const blob = new Blob([data], { type: 'application/zip' })
  const objurl = URL.createObjectURL(blob)
  const saveLink = document.createElement('a')
  saveLink.href = objurl
  saveLink.download = `${type === 1 ? '全部图片.zip' : '认可图片.zip'}`
  saveLink.click()
  URL.revokeObjectURL(objurl)
  setTimeout(() => {
    hide()
  }, 1500)

  // window.open(data)
}
async function updataBill() {
  const res2 = await initBillings({})
  const {
    data: { leftTokenCount }
  } = res2
  userStore.saveUserInfo({ leftTokenCount })
}
function imageUrlMethod(it: any, item: any, n: number) {
  const { processStatus = '' } = it
  const { processedFileList = [], thumbnailFileUrl = '' } = item
  if (processedFileList.length) {
    return processedFileList[n]?.thumbnailFileUrl || thumbnailFileUrl
  }
  if (processStatus === FAILED) {
    return processedFileList.length
      ? processedFileList[n]?.thumbnailFileUrl || thumbnailFileUrl
      : thumbnailFileUrl
  }
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

    .down_load_btn {
      margin-left: 24px;
    }

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
        margin-bottom: 12px;

        .ant-btn {
          margin-left: 24px;
        }

        &.process_fail {
          color: #ff4d4f;
        }
      }

      .result_list_box {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        flex-wrap: wrap;

        &_item {
          margin: 0 12px 12px 0;
          width: 200px;
          min-height: 200px;
          position: relative;
          overflow: hidden;
          .anticon-exclamation-circle {
            position: absolute;
            right: 10px;
            top: 10px;
            font-size: 18px;
            color: #ff4d4f;
            cursor: pointer;
          }

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

            .placeholder_button,
            .placeholder_text {
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

          :deep(.anticon-heart) {
            position: absolute;
            top: 10px;
            right: 10px;
            font-size: 28px;
            z-index: 99;
            cursor: pointer;
            font-weight: 400;
            color: #999999;

            &.checked {
              color: #f16d2b;
            }
          }
        }

        .result_list_box_item:hover .previewMask {
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
          background-color: rgba(0, 0, 0, 0.6);
          justify-content: center;
          font-size: 14px;
          line-height: 36px;
          left: 0;
          bottom: 0;
          z-index: 111;
          transform: translateY(100%);
          transition: all linear 0.2s;
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
      border-radius: 10px;

      .view_btn {
        position: absolute;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
      }

      .ant-image,
      .sec-img {
        width: 45%;
        position: relative;
        pointer-events: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        &:nth-child(2) {
          margin-right: 20px;
        }
      }

      .sec-img {
        //position: relative;

        .ant-image {
          width: 100%;
        }
      }

      .anticon-left,
      .anticon-right {
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

      .anticon-heart {
        position: absolute;
        top: 24px;
        left: 24px;
        z-index: 99;
        font-size: 36px;
        //color: #7cb305;
        color: #999999;
        font-weight: 400;
        &.checked {
          color: #f16d2b;
        }
      }
    }
  }
}
</style>
