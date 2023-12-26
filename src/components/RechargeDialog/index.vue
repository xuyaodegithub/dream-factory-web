<template>
    <a-modal :open="open" class="dia-container" :width="850" @cancel='close' :footer="null">
        <template #title>
            <a-space>
                <span class="dia-title">算力充值</span>
                <span class="title-tip">(1元=1算力值)</span>
            </a-space>
        </template>
        <div class="package-card-container">
            <package-card v-for="packageInfo in packageInfos" :key="packageInfo.id" :info="packageInfo" />
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
import { defineProps, ref, onMounted, defineEmits, toRef } from 'vue';
import { AlipayCircleOutlined } from '@ant-design/icons-vue';
import PackageCard from './PackageCard.vue';
import { PackageInfo } from '@/types';
const props: any = defineProps({
    open: {
        type: Boolean,
        default: false
    },
    close: Function
});
const emit = defineEmits(['update:open']);

const packageInfos = ref<PackageInfo[]>([]);
// 从后端获取套餐数据
const getPackageIfos = () => {
    // 假设此处使用axios或fetch从后端获取数据
    const dataFromBackend: PackageInfo[] = [
        { id: 1, name: '1个月', price: 480 },
        { id: 2, name: '3个月', price: 2880 },
        { id: 3, name: '6个月', price: 8880 },
        { id: 4, name: '12个月', price: 18880 },
    ];
    packageInfos.value = dataFromBackend;
};
//获取数据
getPackageIfos();

// const selectedPrice = ref<number | null>(null);

// const handleCardClicked = (price: number) => {
//     selectedPrice.value = price;
// };

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
