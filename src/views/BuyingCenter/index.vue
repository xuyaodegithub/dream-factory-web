<template>
    <div class="container">
        <div class="slogan">
            <div class="slogan1">让每个品牌都拥有数字模特</div>
            <div class="tips">1算力值生成1张图片，1元等于1个算力值</div>
        </div>
        <div class="subscription-card">
            <OptionCardVue v-for="subscription in subscriptionList" :key="subscription.subscriptionId"
                :cardContent="subscription" @showRechargeDialog="showModalHandler"
                @showContactDialog="showContactDialogHandler" />
        </div>

    </div>
    <RechargeDialog :open="openRechargeDialog" :close='() => openRechargeDialog = false' />
    <ContactDialog :open="openContactDialog" :close='() => openContactDialog = false' />
</template>

<script setup lang="ts">
import OptionCardVue from "./components/OptionCard.vue";
import { ref, onMounted } from "vue";
import RechargeDialog from '@/components/RechargeDialog/index.vue';
import ContactDialog from '@/components/ContactDialog/index.vue';
import { initSkusList } from '@/services'
const subscriptionList: any = ref([
    {
        subscriptionId: 1,
        subscriptionPrice: '480/月起',
        subscriptionName: '算力充值包',
        subscriptionDesc: ['根据充值额度生成图片', '下载高清图片', '提供更多数字人模特'],
        butootText: '立即充值',
    },
    {
        subscriptionId: 2,
        subscriptionPrice: '请联系商务',
        subscriptionName: '定制服务',
        subscriptionDesc: ['更多可生成图片', '下载高清图片', '提供更多数字人模特', '可定制数字人', '专业的人工智能服务'],
        butootText: '立即联系',
    }
]);


const openRechargeDialog = ref<boolean>(false);
const showModalHandler = () => {
    openRechargeDialog.value = true
};
const openContactDialog = ref<boolean>(false);
const showContactDialogHandler = () => {
    openContactDialog.value = true
}
onMounted(async () => {
    try {
        const { data: { items } } = await initSkusList({});
        // 对返回的数据进行处理
    } catch (error) {
        console.error('API 请求出错：', error);
        // 处理错误情况
    }
})

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

        .slogan1 {
            font-size: 24px;
            color: #333;
        }

        .tips {
            font-size: 14px;
            color: #999;
        }
    }
}

.container {
    background-color: aliceblue;
    height: 100%;
}


.subscription-card {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 140px;
}
</style>
