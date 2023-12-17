<template>
    <a-card :hoverable="true">
        <template #title>
            <div class="card-header">
                <div class="subscription-name">{{ cardContent.subscriptionName }}</div>
                <div class="subscription-price">
                    <span>{{ cardContent.subscriptionPrice }}/月起</span>
                </div>
            </div>
        </template>
        <div class="subscription-button">
            <a-button type="primary" @click="subscribe">立即订阅</a-button>
        </div>
        <div class="subscription-desc">
            <h3>包含</h3>
            <div v-for="item in cardContent.subscriptionDesc" :key="item.index">
                <CheckCircleOutlined />
                {{ item }}
            </div>
        </div>
    </a-card>
</template>

<script setup lang="ts">
import { reactive, defineProps } from 'vue';
import { CheckCircleOutlined } from '@ant-design/icons-vue';
interface CardContent {
    subscriptionId: number;
    subscriptionPrice: string;
    subscriptionName: string;
    subscriptionDesc: string[];
}

const props = defineProps<{
    cardContent?: CardContent
}>();


const subscribe = () => {
    // TODO: Implement subscription logic
    console.log('Subscribe clicked');
};
</script>

<style  lang="less" scoped>
@hover-bg-color: #1677ff;

.ant-card {
    width: 250px;
    height: 350px;
    margin: 0 50px;
    border-radius: 8px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);

    .card-header {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .subscription-name {
        margin-top: 15px;
    }

    .subscription-price {
        font-size: 32px;
        margin-bottom: 10px;
    }

    .subscription-button {
        display: flex;
        justify-content: center;

        .ant-btn {
            width: 100%;
        }
    }

    .subscription-desc {
        margin-top: 15px;
    }

    &:hover {
        border-color: @hover-bg-color;
        border-radius: 10px;

        :deep(.ant-card-head) {
            background-color: @hover-bg-color;
            color: #ffffff;
        }
    }
}
</style>
