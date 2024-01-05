<template>
  <a-card :hoverable="true">
    <template #title>
      <div class="card-header">
        <div class="subscription-name">{{ cardContent.subscriptionName }}</div>
        <div class="subscription-price">
          {{ cardContent.subscriptionPrice }}
        </div>
      </div>
    </template>
    <div class="card-body-container">
      <div class="subscription-button">
        <a-button type="primary" @click="showModal">{{ cardContent.butootText }}</a-button>
      </div>
      <div class="subscription-desc">
        <div class="desc-title">包含</div>
        <div v-for="item in cardContent?.subscriptionDesc" :key="item.index" class="desc-info">
          <CheckOutlined />
          {{ item }}
        </div>
      </div>
    </div>
  </a-card>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import { CheckOutlined } from '@ant-design/icons-vue'
import { ref } from 'vue'

const emit = defineEmits(['showRechargeDialog', 'showContactDialog'])

interface CardContent {
  subscriptionId: number
  subscriptionPrice: string
  subscriptionName: string
  subscriptionDesc: any[]
  butootText: string
}

const props = defineProps({
  cardContent: {
    required: true,
    type: Object,
    default: () => ({ subscriptionId: 1, subscriptionName: '', butootText: '' })
  }
})

const showModal = () => {
  if (props.cardContent.subscriptionId === 1) {
    emit('showRechargeDialog')
  }
  if (props.cardContent.subscriptionId === 2) {
    emit('showContactDialog')
  }
}
</script>

<style lang="less" scoped>
@hover-bg-color: #1677ff;

.ant-card {
  text-align: left;
  width: 300px;
  height: 450px;
  margin: 0 50px;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);

  .card-header {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .subscription-name {
    margin-top: 20px;
    font-size: 16px;
  }

  .subscription-price {
    font-size: 32px;
    line-height: 1.8;
    margin-bottom: 15px;
  }

  .card-body-container {
    padding: 0 20px;

    .subscription-button {
      display: flex;
      justify-content: center;

      .ant-btn {
        width: 100%;
        font-size: 18px;
        height: 40px;
        font-weight: 600;
      }
    }

    .subscription-desc {
      margin-top: 15px;

      .desc-title {
        font-size: 16px;
        line-height: 32px;
      }

      .desc-info {
        font-size: 14px;
        line-height: 26px;
      }
    }
  }

  &:hover {
    border-color: @hover-bg-color;
    border-radius: 10px;
    transition:
      border-color 0.5s ease,
      border-radius 0.5s ease;

    :deep(.ant-card-head) {
      background-color: @hover-bg-color;
      color: #ffffff;
      transition:
        background-color 0.5s ease,
        color 0.5s ease;
    }
  }
}
</style>
