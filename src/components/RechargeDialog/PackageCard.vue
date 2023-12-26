<template>
  <div :class="{ 'card-container': true, active }">
    <div class="package-name">{{ info.skuName }}</div>
    <div class="package-price">{{ info.unitPrice }}元</div>
    <div class="package-content">{{ info.description }}</div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  info: {
    type: Object,
    require: true
  },
  active: Boolean
})
</script>

<style lang="less">
.card-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: fit-content;
  cursor: pointer;
  &.active {
    background-color: rgb(160, 207, 255);
  }

  .package-name {
    font-size: 12px;
  }

  .package-price {
    font-size: 18px;
    line-height: 44px;
    font-weight: 700;
  }

  .package-content {
    font-size: 12px;
    color: #666;
  }
}
</style>
