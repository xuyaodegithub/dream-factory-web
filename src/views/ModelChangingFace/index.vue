<template>
  <main class='ModelChangingFace'>
    <div class='left_upload'>
      <div class='opera_content'>
        <div class='upload_box'>
          <a-upload-dragger
            v-model:fileList='fileList'
            name='file'
            :maxCount='maxLen'
            :multiple='true'
            action='/'
            :disabled='needDis'
            @change='imgUpload'
            :customRequest='()=>{}'
            :accept='acceptFileList'
            :showUploadList='false'
            :withCredentials='true'
          >
            <div class='ant-upload-drag-icon'>
              <UploadOutlined />
            </div>
            <div class='ant-upload-text'>上传图片或将图片拖拽到此处</div>
            <div class='ant-upload-hint' v-if='!fileList.length'>
              格式：jpg,png,jpeg,图片大小不超过50M,最多可以上传20张图片<br>
              上传的图片请不要遮挡模特的脸部，应正视镜头，侧脸和低头角度不宜过大
            </div>
            <div class='file_list' v-else @click.stop=''>
              <div class='upload_befor' v-if='!allSuccess'>
                <a-progress :strokeWidth='8' :percent='progress' :showInfo='false' />
                <span style='color: #333333'>{{ progress }}%</span>
                <p class='loading'>文件正在上传中，请稍后...</p>
              </div>
              <div class='upload_success' v-else>
                <PictureOutlined />
                <div class='center_text'>
                  <CheckCircleOutlined />
                  成功上传 <span>{{ fileList.length }}</span> 张图片
                </div>
                <DeleteOutlined @click.stop='deleteFiles' />
              </div>
            </div>
          </a-upload-dragger>
        </div>
        <div class='select_model'>
          <div class='title_dec' @click='startPargress'>选择模特</div>
          <a-carousel arrows :dots='false' ref='carousel' :afterChange='(idx:number)=>modelActive=idx'>
            <template #prevArrow>
              <LeftCircleOutlined />
            </template>
            <template #nextArrow>
              <RightCircleOutlined />
            </template>
            <div v-for='(item,idx) in imgList' :key='idx'>
              <a-image :src='item' :preview='false' :width='300' :height='300'></a-image>
            </div>
          </a-carousel>
        </div>
        <div class='model_example'>
          <a-image :class='{active:modelActive===idx}' @click.stop='selectModel(idx)'
                   v-for='(item,idx) in imgList.slice(0,imgList.length-1)' :key='idx'
                   :src='item' :preview='false' :width='90'></a-image>
          <a-popover placement='rightBottom'>
            <template #title>
              <div class='concat_us'>更多模特<span class='concat_us_dec'>（想要专属模特?请联系商务定制）,<a-button
                type='link' size='small'>立即联系</a-button></span>
              </div>
            </template>
            <template #content>
              <MoveModels :changeFirstImg='changeFirstImg' />
            </template>
            <div class='ant-image last'>查看更多</div>
          </a-popover>
        </div>
        <div class='select_number'>
          <label>单张图片换脸数量</label>
          <a-select
            ref='select'
            v-model:value='pictureNumer'
            style='width: 120px'>
            <a-select-option v-for='item in selectNumberList' :value='item' :key='item'>{{ item }}</a-select-option>
          </a-select>
          张
        </div>
        <div class='select_number'>
          <label>微笑推荐</label>
          <a-switch v-model:checked='checkedSmile' />
        </div>
      </div>
      <div class='confirm_box'>
        <span class='consumption' v-if='!!consumption'>本次消耗：{{ consumption }} 算力</span>
        <a-button type='primary' :disabled='!allSuccess' @click='confirmTask'>点击生成</a-button>
      </div>
    </div>
    <div class='right_perview'>
      <RightContent ref='rightContent' :resultInfo='resultInfo' />
    </div>
  </main>
</template>

<script setup lang='ts'>
import { ref, computed, reactive } from 'vue'
import { acceptFileList, customRequest, maxLen, selectNumberList } from '@/config/file'
import {
  UploadOutlined,
  PictureOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  LeftCircleOutlined,
  RightCircleOutlined
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import RightContent from './components/RightContent.vue'
import MoveModels from './components/MoveModels.vue'

const modelList: any = import.meta.glob('@/assets/carouse/carouse*.png', { eager: true })
const imgList = ref(Object.keys(modelList).map((item: any) => modelList[item].default).slice(0, 10))
const fileList: any = ref([])
const timer: any = ref(null)
const modelActive = ref<number>(0)
const carousel: any = ref(null)
const pictureNumer = ref(4)
const checkedSmile = ref(false)
const resultInfo = reactive({ list: [], number: pictureNumer.value })
const rightContent: any = ref(null)
//是否全部上传成功
const allSuccess = computed(() => {
  const { value } = fileList
  return !!value.length && value.every((i: any) => i.uploadEnd)
})
//进度
const progress = computed(() => {
  const { value } = fileList
  const success = value.filter((i: any) => i.uploadEnd)
  return parseInt(String(success.length / value.length * 100))
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


function deleteFiles() {
  fileList.value = []
}

function imgUpload(file: File) {
  if (fileList.value.length >= maxLen) {
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
}

function selectModel(idx: number) {
  carousel.value.goTo(idx)
  modelActive.value = idx
}

function confirmTask() {
  resultInfo.list = JSON.parse(JSON.stringify(fileList.value))
  resultInfo.number = pictureNumer.value
}

function startPargress() {
  const idx = fileList.value.findIndex((i: any) => !i.uploadEnd)
  if (idx > -1) fileList.value[idx].uploadEnd = true
  console.log(fileList.value)
}

function changeFirstImg(img: string) {
  const firstImg = imgList.value[0]
  imgList.value[0] = img
  selectModel(0)
  return firstImg
}
</script>

<style scoped lang='less'>
.ModelChangingFace {
  height: 100%;
  overflow: hidden;
  display: flex;

  .left_upload {
    padding: 12px 24px;
    width: 600px;
    background-color: #ffffff;
    height: 100%;
    overflow: hidden;
    margin-right: 48px;
    border-right: 1px solid rgba(5, 5, 5, 0.3);
    display: flex;
    flex-direction: column;

    .opera_content {
      flex: 1;
      overflow: auto;
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

        .anticon-delete {
          margin-left: auto;
          color: #333;
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
      max-height: 500px;
      overflow: hidden;

      :deep(.ant-carousel) {
        padding: 12px 0;
      }

      .title_dec {
        font-size: 14px;
        margin-left: -36px;
      }

      .anticon-left-circle, .anticon-right-circle {
        color: #666666;
        z-index: 66;
        font-size: 24px;
      }

      :deep(.ant-image) {
        display: block;
        margin: 0 auto;
      }
    }

    .model_example {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      margin-top: 12px;
      padding: 10px;
      box-shadow: 0 0 2px #999999;

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
          height: 90px;
          width: 90px;
          line-height: 90px;
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
      border-top: 1px solid #999999;

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
    border-left: 1px solid rgba(5, 5, 5, 0.3);
    flex: 1;
    height: 100%;
    overflow-y: auto;
    background-color: #eeeeee;
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
