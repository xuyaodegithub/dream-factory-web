<template>
    <a-card :hoverable="true">
        <template #title>
            <div class="card-header">
                <div class="subscription-name">{{ cardContent.subscriptionName }}</div>
                <div class="subscription-price">
                    {{ cardContent.subscriptionPrice }}/月起
                </div>
            </div>
        </template>
        <div class="subscription-button">
            <a-button type="primary" @click="showModal">立即订阅</a-button>
        </div>
        <div class="subscription-desc">
            <div class="desc-title">包含</div>
            <div v-for="item in cardContent?.subscriptionDesc" :key="item.index" class="desc-info">
                <CheckCircleOutlined />
                {{ item }}
            </div>
        </div>
    </a-card>
    <RechargeDialog ref="RechargeModal" :open="openRechargeDialog" @update:open="handleRechargeDialogUpdate" />
</template>

<script setup lang="ts">
import { reactive, defineProps, onMounted } from 'vue';
import { CheckCircleOutlined } from '@ant-design/icons-vue';
import { ref } from 'vue';
import RechargeDialog from '@/components/RechargeDialog/index.vue';

interface CardContent {
    subscriptionId: number;
    subscriptionPrice: string;
    subscriptionName: string;
    subscriptionDesc: any[];
}
const RechargeModal: any = ref(null)
const props = defineProps<{
    cardContent: CardContent
}>();
//打开充值弹窗
const openRechargeDialog = ref<boolean>(false);
onMounted(async () => {
    //openRechargeDialog.value = false;
    console.log("openRechargeDialog", openRechargeDialog.value)
})

const showModal = () => {
    RechargeModal.value.dialogOpen.value = true
    console.log(RechargeModal.value.dialogOpen.value, 'RechargeModal.value.dialogOpen.value ')
};

const handleRechargeDialogUpdate = (value: boolean) => {
    openRechargeDialog.value = value;
}

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
        font-size: 16px;
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

        .desc-title {
            font-size: 16px;
            line-height: 32px;
        }

        .desc-info {
            font-size: 14px;
            line-height: 26px;
        }
    }

    &:hover {
        border-color: @hover-bg-color;
        border-radius: 10px;
        transition: border-color 0.5s ease, border-radius 0.5s ease;

        :deep(.ant-card-head) {
            background-color: @hover-bg-color;
            color: #ffffff;
            transition: background-color 0.5s ease, color 0.5s ease;
        }
    }

}
</style>
