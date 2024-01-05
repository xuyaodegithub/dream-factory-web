<template>
  <main class="ModelChangingFace">
    <div class="left_upload">
      <a-skeleton :loading="leftLoading" active :paragraph="{ rows: 10 }">
        <div class="opera_content">
          <div class="upload_box">
            <a-upload-dragger
              v-model:fileList="fileList"
              name="file"
              :maxCount="maxLen"
              :multiple="true"
              action="/"
              :disabled="needDis"
              @change="imgUpload"
              :customRequest="() => {}"
              :accept="acceptFileList"
              :showUploadList="false"
              :withCredentials="true"
            >
              <div class="ant-upload-drag-icon">
                <UploadOutlined />
              </div>
              <div class="ant-upload-text">上传图片或将图片拖拽到此处</div>
              <div class="ant-upload-hint" v-if="!fileList.length">
                格式：jpg,png,jpeg,图片大小不超过50M,最多可以上传20张图片<br />
                上传的图片请不要遮挡模特的脸部，应正视镜头，侧脸和低头角度不宜过大
              </div>
              <div class="file_list" v-else @click.stop="">
                <div class="upload_befor" v-if="!allSuccess">
                  <a-progress :strokeWidth="8" :percent="progress" :showInfo="false" />
                  <span style="color: #333333">{{ progress }}%</span>
                  <p class="loading">图片正在上传中，请稍后...</p>
                </div>
                <div class="upload_success" v-else>
                  <PictureOutlined />
                  <div class="center_text">
                    <CheckCircleOutlined />
                    成功上传 <span>{{ fileList.length }}</span> 张图片
                  </div>
                  <EyeOutlined @click.stop="previewImg" />
                  <DeleteOutlined @click.stop="deleteFiles" />
                </div>
              </div>
            </a-upload-dragger>
          </div>
          <div class="select_model">
            <div class="title_dec">选择模特</div>
            <a-carousel
              arrows
              :dots="false"
              ref="carousel"
              :afterChange="(idx: number) => (modelActive = idx)"
            >
              <template #prevArrow>
                <LeftCircleOutlined />
              </template>
              <template #nextArrow>
                <RightCircleOutlined />
              </template>
              <div v-for="(item, idx) in defaultImgList" :key="idx">
                <a-image
                  :src="item.avatarUrl"
                  :preview="false"
                  :fallback="fallback"
                  :width="300"
                ></a-image>
                <div class="model_item_name">{{ item.modelName }}</div>
              </div>
            </a-carousel>
          </div>
          <div class="model_example">
            <a-image
              :class="{ active: modelActive === idx }"
              @click.stop="selectModel(idx)"
              v-for="(item, idx) in defaultImgList"
              :key="idx"
              :src="item.avatarUrl"
              :preview="false"
              :width="80"
              :fallback="fallback"
            ></a-image>
            <a-popover placement="rightBottom" trigger="click" v-model:open="visibleMove">
              <template #title>
                <div class="concat_us">
                  更多模特<span class="concat_us_dec"
                    >（想要专属模特?请联系商务定制）,<a-button
                      type="link"
                      size="small"
                      @click="openContractUs"
                      >立即联系</a-button
                    ></span
                  >
                </div>
              </template>
              <template #content>
                <MoveModels :moveImgList="moveImgList" :changeFirstImg="changeFirstImg" />
              </template>
              <div class="ant-image last" v-if="imgList.length > 9">查看更多</div>
            </a-popover>
          </div>
          <div class="select_number">
            <label>单张图片换脸数量</label>
            <a-select ref="select" v-model:value="pictureNumer" style="width: 120px">
              <a-select-option v-for="item in selectNumberList" :value="item" :key="item">{{
                item
              }}</a-select-option>
            </a-select>
            张
          </div>
          <div class="select_number">
            <label>微笑推荐</label>
            <a-switch v-model:checked="modelSmile" />
          </div>
        </div>
        <div class="confirm_box">
          <span class="consumption" v-if="!!consumption">本次消耗：{{ consumption }} 算力</span>
          <a-button type="primary" :disabled="!allSuccess" @click="confirmTask">点击生成</a-button>
        </div>
      </a-skeleton>
    </div>
    <div class="right_perview">
      <RightContent ref="rightContent" :resultInfo="resultInfo" />
    </div>
    <ContactDialog :open="openContactDialog" :close="() => (openContactDialog = false)" />
    <upLoadFile
      v-if="openPerviewModal"
      :open="openPerviewModal"
      :close="() => (openPerviewModal = false)"
      :allFileId="allFileId"
    />
  </main>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onBeforeMount, watch, watchEffect } from 'vue'
import { acceptFileList, customRequest, maxLen, selectNumberList } from '@/config/file'
import {
  UploadOutlined,
  PictureOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  LeftCircleOutlined,
  RightCircleOutlined,
  EyeOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'
import RightContent from './components/RightContent.vue'
import MoveModels from './components/MoveModels.vue'
import upLoadFile from './components/uploadFile.vue'
import { initModelsList } from '@/services'
import { userInfo } from '@/stores'
import { uploadImg, getFiles } from '@/services'
import { fallback } from '@/config'
import { createVNode } from 'vue'
const imgList: any = ref([])
const fileList: any = ref([])
const timer: any = ref(null)
const modelActive = ref<number>(0)
const carousel: any = ref(null)
const pictureNumer = ref(1)
const modelSmile = ref(false)
const visibleMove = ref(false)
const leftLoading = ref(true)
const resultInfo = reactive<any>({
  list: [],
  number: pictureNumer.value,
  modelSmile: false,
  modelId: ''
})
const rightContent: any = ref(null)
const hasNewFile: any = ref(false)
const openContactDialog: any = ref(false)
const openPerviewModal: any = ref(false)
//是否全部上传成功
const allSuccess = computed(() => {
  const { value } = fileList
  return !!value.length && value.every((i: any) => i.uploadEnd)
})
//进度
const progress = computed(() => {
  const { value } = fileList
  const success = value.filter((i: any) => i.uploadEnd)
  return parseInt(String((success.length / value.length) * 100))
})
//需要禁用按钮
const needDis: any = computed(() => {
  const { value } = fileList
  const len = value.length
  return (len > 0 && progress.value < 100) || len >= maxLen
})
//算力消耗
const consumption = computed(() => {
  const len = fileList.value.length
  return len * pictureNumer.value
})
//默认展示的模特
const defaultImgList = computed(() => {
  return imgList.value.slice(0, 9)
})
//更多内的模特
const moveImgList = computed(() => {
  return imgList.value.slice(9)
})
const currentSmile = computed(() => {
  return imgList.value[modelActive.value]?.recommendSmile || false
})
const allFileId = computed(() => {
  return fileList.value.map((item: any) => item.fileId || '')
})
watch(
  currentSmile,
  (n: any) => {
    modelSmile.value = n
  },
  { deep: true, immediate: true }
)
onBeforeMount(async () => {
  const {
    data: { items = [] }
  } = await initModelsList({})
  imgList.value = items
  leftLoading.value = false
})

function deleteFiles() {
  fileList.value = []
}

function imgUpload(fileObj: any) {
  const { file, fileList: l }: any = fileObj
  const isDel = l.find((i: any) => i.uid === file.uid)
  if (l.length >= maxLen && !isDel) {
    // 由於是一个一个上传的  只需要最后一次提示就好
    if (timer.value) {
      clearTimeout(timer.value)
      timer.value = null
    }
    timer.value = setTimeout(() => {
      message.warning(`最多可以上传${maxLen}个文件，超出部分将会被忽略`)
    }, 200)
    return
  }
  uploadImgs(fileObj)
}

function selectModel(idx: number) {
  carousel.value.goTo(idx)
  modelActive.value = idx
}

function confirmTask() {
  if (hasNewFile.value) {
    resultInfo.list = JSON.parse(JSON.stringify(fileList.value))
    resultInfo.number = pictureNumer.value
    resultInfo.modelSmile = modelSmile.value
    resultInfo.modelId = imgList.value[modelActive.value]?.modelId || 1
    hasNewFile.value = false
  } else {
    Modal.confirm({
      title: '当前图片已全部生成任务，请重新上传',
      icon: createVNode(ExclamationCircleOutlined),
      content: createVNode('div', { style: '' }, '确定后会自动清除已上传的图片'),
      okText: '确定',
      cancelText: '取消',
      onOk() {
        fileList.value = []
      },
      onCancel() {
        console.log('Cancel')
      },
      class: 'test'
    })
  }
}

function changeFirstImg(img: any) {
  const { modelId } = img
  const firstImg = imgList.value[0]
  const idx = imgList.value.findIndex((i: any) => i.modelId === modelId)
  imgList.value[0] = img
  if (idx > -1) {
    imgList.value.splice(idx, 1, firstImg)
  }
  selectModel(0)
  console.log(moveImgList.value, 'pppp')
}

async function uploadImgs({ file }: any) {
  const { uid, originFileObj = {} } = file
  const formData: any = new FormData()
  formData.append('files', originFileObj)
  const {
    data: { items }
  }: any = await uploadImg(formData)
  const idx = fileList.value.findIndex((i: any) => i.uid === uid)
  if (idx > -1) {
    fileList.value[idx].uploadEnd = true
    fileList.value[idx].fileId = items[0].fileId
    hasNewFile.value = true
  }
}
function openContractUs() {
  openContactDialog.value = true
  visibleMove.value = false
}
async function previewImg() {
  if (progress.value > 0 && progress.value < 100) return message.warning('图片上传中，请稍后')
  if (!fileList.value.length) return message.warning('请先上传图片')
  openPerviewModal.value = true
}

function getBase64(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}
</script>

<style scoped lang="less">
.ModelChangingFace {
  height: 100%;
  overflow: hidden;
  display: flex;

  .left_upload {
    padding: 12px 0;
    width: 540px;
    background-color: #ffffff;
    height: 100%;
    overflow: hidden;
    margin-right: 48px;
    box-shadow: 1px 0 3px #ebe9e9;
    // border-right: 1px solid rgba(5, 5, 5, 0.3);
    display: flex;
    flex-direction: column;

    :deep(.ant-skeleton) {
      height: 100%;
      position: relative;
    }

    .opera_content {
      flex: 1;
      overflow: auto;
      padding: 0 24px;
    }

    .upload_box {
      height: 160px;
    }

    .ant-upload-drag-icon {
      margin-bottom: 0px;
    }

    .ant-upload-text {
      font-size: 16px;
    }

    .ant-upload-hint {
      margin-top: 16px;
      font-size: 14px;
      color: #999;
    }

    :deep(.anticon-upload) {
      font-size: 28px !important;
    }

    .file_list {
      box-shadow: 0 0 2px #999999;
      border-radius: 4px;
      width: 80%;
      margin: 12px auto 0;

      .upload_befor {
        padding: 6px 12px 24px;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .ant-progress {
        width: 70%;
        margin-right: 12px;
      }

      .loading {
        position: absolute;
        left: 50%;
        bottom: 0;
        font-size: 12px;
        color: #999999;
        transform: translate(-50%, 30%);
      }

      .upload_success {
        display: flex;
        align-items: center;
        padding: 12px 24px;
        font-size: 14px;

        .center_text {
          display: flex;
          align-items: center;
        }

        .anticon-picture {
          font-size: 24px;
          margin-right: 48px;
        }

        .anticon-check-circle {
          margin-right: 12px;
          font-size: 18px;
          color: #389e0d;
        }

        .anticon-delete,
        .anticon-eye {
          color: #333;
          font-size: 18px;
          color: #ff4d4f;
        }
        .anticon-eye {
          color: #999999;
          margin-left: auto;
        }

        & > span {
          color: #008dff;
          margin: 0 4px;
        }
      }
    }

    .select_model {
      margin-top: 12px;
      padding: 10px 36px;
      max-height: 550px;
      overflow: hidden;

      :deep(.ant-carousel) {
        padding: 12px 0 0 0;
      }

      .title_dec {
        font-size: 14px;
        margin-left: -36px;
      }

      .anticon-left-circle,
      .anticon-right-circle {
        color: #666666;
        z-index: 66;
        font-size: 24px;
      }

      :deep(.ant-image) {
        display: block;
        margin: 0 auto;
      }

      .model_item_name {
        font-size: 14px;
        text-align: center;
        color: #333333;
        line-height: 36px;
      }
    }

    .model_example {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      margin-top: 12px;
      padding: 10px;
      box-shadow: 0 0 2px #e2e0e0;

      :deep(.ant-image) {
        cursor: pointer;
        box-sizing: border-box;
        margin: 5px;
        overflow: hidden;

        img {
          border: 2px solid #eeeeee;
        }

        .active {
          border-color: #4d7bea;
        }

        &.last {
          height: 80px;
          width: 80px;
          line-height: 80px;
          text-align: center;
          color: #4d7bea;
          border: 2px solid #eeeeee;
        }
      }
    }

    .select_number {
      display: flex;
      align-items: center;
      margin-top: 20px;

      .ant-select {
        margin-right: 10px;
      }

      label {
        margin-right: 12px;
      }
    }

    .confirm_box {
      margin-top: 14px;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      border-top: 1px solid #eeeeee;
      padding: 0 24px;

      .consumption {
        font-size: 14px;
        margin-right: 36px;
        color: #878a95;
      }

      .ant-btn-primary {
        height: 48px;
        line-height: 48px;
        padding: 0;
        width: 160px;
      }
    }
  }

  .right_perview {
    box-shadow: -1px 0 3px rgba(159, 157, 157, 0.3);
    flex: 1;
    height: 100%;
    overflow-y: auto;
    background-color: #fbf9f9;
    padding: 24px;
  }
}

.concat_us {
  display: flex;
  font-size: 16px;

  &_dec {
    font-size: 14px;
    color: #999999;
  }

  .view_history {
    margin-left: auto;
  }
}
</style>
