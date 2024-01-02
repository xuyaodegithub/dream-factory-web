<template>
  <main class="move_models">
    <div v-for="(item, idx) in moveModels" :key="item.label" class="years_box">
      <div class="title_dec">{{ item.label }}</div>
      <div class="img_list">
        <div
          class="img_item"
          v-for="(it, ix) in item.list"
          :key="it"
          @click="changeToFirst(idx, ix)"
        >
          <a-image :src="it.avatarUrl" :preview="false" :width="200"></a-image>
          <div class="model_item_name">{{ it.modelName }}</div>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { defineProps, computed } from 'vue'

const props: any = defineProps({
  changeFirstImg: Function,
  moveImgList: Array
})
//按年龄分类
const moveModels = computed(() => {
  const map: any = [
    { label: '婴幼儿', min: 0, max: 10, list: [], ageRange: 'INFANT' },
    { label: '儿童', min: 11, max: 20, list: [], ageRange: 'CHILD' },
    { label: '成人', min: 21, max: 30, list: [], ageRange: 'ADULT' },
    { label: '老年人', min: 31, max: 40, list: [], ageRange: 'SENIOR' },
    { label: '其他', min: 41, max: 1000, list: [], ageRange: '' }
  ]
  return map
    .map((item: any) => {
      const { ageRange, list } = item
      const l = props?.moveImgList.filter((i: any) => i.ageRange === ageRange)
      return {
        ...item,
        list: [...list, ...l]
      }
    })
    .filter(({ list }: any) => !!list.length)
})

function changeToFirst(idx: number, ix: number) {
  const img: string = moveModels.value[idx].list[ix]
  props?.changeFirstImg(img)
  // moveModels.value[idx].list[ix] = newImg
}
</script>

<style scoped lang="less">
.move_models {
  width: 840px;
  max-height: 700px;
  min-height: 400px;
  overflow: auto;
  padding-top: 24px;

  .years_box {
    font-size: 14px;
    color: #333333;
    line-height: 20px;
    margin-bottom: 24px;

    .title_dec {
      font-size: 14px;
      margin-bottom: 12px;
    }

    .img_list {
      display: flex;
      align-items: center;
      //justify-content: space-between;
      flex-wrap: wrap;

      .img_item {
        margin: 0 5px 5px 0;

        .model_item_name {
          font-size: 14px;
          line-height: 20px;
          text-align: center;
        }
      }

      :deep(.ant-image) {
        cursor: pointer;
      }
    }
  }
}
</style>
