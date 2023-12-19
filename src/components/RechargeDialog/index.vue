<template>
    <a-modal v-model:open="dialogOpen" @ok="handleOk" class="dia-container" :width="850">
        <template #title>
            <a-space>
                <span class="dia-title">算力充值</span>
                <span class="title-tip">(1元=1算力值)</span>
            </a-space>
        </template>
        <div class="package-card-container">
            <package-card />
            <package-card />
            <package-card />
            <package-card />
        </div>
        <div class="payment-info">
            <div class="payment-text">付款金额：<span class="payment-amount">2880</span></div>
            <div class="QR-code">二维码</div>
            <div class="alipay-tip">
                <AlipayCircleOutlined :style="{ fontSize: '24px', color: '#6493e0', verticalAlign: 'middle' }" />
                <span class="tip-text">请使用支付宝扫码支付</span>
            </div>
        </div>
        <div class="illustrate">
            说明：
            <ul class="illu-ul">
                <li>算力值换算规则：1元=1算力值</li>
                <li>充值后的算力有对应的有效期，无法提现、退款或转赠他人</li>
                <li>充值成功后，可在【我的订单】中查看充值明细，并申请开票。</li>
            </ul>
        </div>
    </a-modal>
</template>

<script setup lang="ts">
import { defineProps, ref, onMounted } from 'vue';
import { AlipayCircleOutlined } from '@ant-design/icons-vue';
import PackageCard from './PackageCard.vue';
const props = defineProps<{
    open: boolean;
}>();

const dialogOpen = ref(false);

onMounted(async () => {
    console.log("挂载对话框");
    console.log("open:", props.open);
    console.log("dialogOpen:", dialogOpen);
});

const emit = defineEmits(['update:open']);

const handleOk = (e: MouseEvent) => {
    console.log(e);
    //dialogOpen = false;
    emit('update:open', false);
};
</script>

<style lang="less" scoped>
.dia-container {

    .dia-title {
        font-size: 16px;
        font-weight: bold;
    }

    .title-tip {
        font-size: 12px;
    }

    .package-card-container {
        margin-top: 30px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        gap: 8px;
    }

    .payment-info {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 20px;

        .payment-text {
            font-size: 24px;
            line-height: 60px;

            .payment-amount {
                color: #a63c26;
                font-weight: 500;
            }
        }

        .QR-code {
            width: 200px;
            height: 200px;
            background-color: #ccc;
        }

        .alipay-tip {
            margin-top: 10px;
            display: inline-block;

            .tip-text {
                margin-left: 5px;
            }
        }
    }

    .illustrate {
        margin-top: 24px;

        .illu-ul {
            margin-left: -23px;

            li {
                line-height: 1.8;
            }
        }
    }
}
</style>