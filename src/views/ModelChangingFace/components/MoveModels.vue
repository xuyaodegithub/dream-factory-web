<template>
  <main class="move_models">
    <div v-for="(item,idx) in moveModels" :key="item.label" class="years_box">
      <div class="title_dec">{{item.label}}</div>
      <div class="img_list">
        <div class="img_item" v-for="(it,ix) in item.list" :key="it" @click='changeToFirst(idx,ix)'>
          <a-image :src="it" :preview="false" :width="200" :height="260"></a-image>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts" setup>
import {ref,defineProps} from 'vue'
const modelList: any = import.meta.glob('@/assets/moveModels/model*.png', {eager: true})
const imgList = Object.keys(modelList).map((item: any) => modelList[item].default)
const { changeFirstImg }:any = defineProps({
  changeFirstImg:Function
})
const moveModels = ref([
  {label: '1-3岁', list: imgList.slice(0, 4)},
  {label: '4-8岁', list: imgList.slice(4, 8)},
  {label: '9-15岁', list: imgList.slice(8, 12)},
  {label: '16-34岁', list: imgList.slice(12)},
])
function changeToFirst(idx:number,ix:number){
  const img:string = moveModels.value[idx].list[ix]
  const newImg = changeFirstImg(img)
  moveModels.value[idx].list[ix] = newImg
}
</script>

<style scoped lang="less">
.move_models {
  width: 840px;
  max-height: 700px;
  min-height: 400px;
  overflow: auto;
  padding-top: 24px;
  .years_box{
    font-size: 14px;
    color: #333333;
    line-height: 20px;
    margin-bottom: 24px;
    .title_dec{
      font-size: 14px;
      margin-bottom: 12px;
    }
    .img_list{
      display: flex;
      align-items: center;
      //justify-content: space-between;
      flex-wrap:wrap;
      .img_item{
        margin: 0 5px 5px 0;
      }
      :deep(.ant-image){
        cursor: pointer;
      }
    }
  }
}
</style>
