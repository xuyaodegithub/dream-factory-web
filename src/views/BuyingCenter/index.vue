<template>
    <div class="container">
        <div class="slogan">
            <a-typography-title :level="2">让每个品牌都拥有数字模特</a-typography-title>
            <a-typography-title :level="5">1算力值生成1张图片，1元等于1个算力值</a-typography-title>
        </div>
        <div class="subscription-card">
            <OptionCardVue v-for="subscription in subscriptionList" :key="subscription.subscriptionId"
                :cardContent="subscription" />
        </div>
    </div>
</template>

<script setup lang="ts">
import OptionCardVue from "./components/OptionCard.vue";
import { ref } from "vue";

const subscriptionList = ref<CardContent[]>([
    {
        subscriptionId: 1,
        subscriptionPrice: '480',
        subscriptionName: '算力充值包',
        subscriptionDesc: ['根据充值额度生成图片', '下载高清图片'],
    },
    {
        subscriptionId: 2,
        subscriptionPrice: '600',
        subscriptionName: '高级会员充值包',
        subscriptionDesc: ['高级功能一', '高级功能二', '高级功能三'],
    },
    {
        subscriptionId: 3,
        subscriptionPrice: '800',
        subscriptionName: '超级会员充值包',
        subscriptionDesc: ['超级功能一', '超级功能二', '超级功能三', '超级功能四'],
    },
]);
</script>

<style lang="less" scoped>
.container,
.container .slogan {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    &.slogan {
        margin-top: 50px;
        margin-bottom: 60px;
    }
}

.subscription-card {
    display: flex;
    flex-direction: row;
    align-items: center;
}
</style>
