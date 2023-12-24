<template>
    <div class="container">
        <div class="slogan">
            <div class="slogan1">让每个品牌都拥有数字模特</div>
            <div class="tips">1算力值生成1张图片，1元等于1个算力值</div>
        </div>
        <div class="subscription-card">
            <OptionCardVue v-for="subscription in subscriptionList" :key="subscription.subscriptionId"
                :cardContent="subscription" @showRechargeDialog="showModalHandler" />
        </div>

    </div>
    <div class="contact-footer">
        <div class="footer-left">
            <div class="about-us">关于我们</div>
            <div>邮箱：shumengwanwei@163.com</div>
            <div>电话：18866662222</div>
        </div>
        <div class="footer-center">
            <div class="service-list">
                <div v-for="(service, index) in moreServices" :key="index">
                    <CheckCircleOutlined />
                    <span>{{ service }}</span>
                </div>
            </div>
            <div class="more-contact">
                <div class="tip1">更多定制化服务</div>
                <div>请联系我们</div>
                <SendOutlined />
                <SendOutlined />
                <SendOutlined />
            </div>
        </div>
        <div class="footer-right">
            <div class="QR-contact">二维码</div>
        </div>
        <!-- <a-button>联系我们</a-button> -->
    </div>
    <RechargeDialog :open="openRechargeDialog" :close='() => openRechargeDialog = false' />
</template>

<script setup lang="ts">
import OptionCardVue from "./components/OptionCard.vue";
import { ref,onMounted } from "vue";
import { CheckCircleOutlined, SendOutlined } from '@ant-design/icons-vue';
import RechargeDialog from '@/components/RechargeDialog/index.vue';
import {initSkusList} from '@/services'
const subscriptionList: any = ref([
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

const moreServices: any = ref(['更多可生成图片', '下载高清图片', '提供更多数字人模特', '可定制数字人', '专业的人工智能服务'])

const openRechargeDialog = ref<boolean>(false);
const showModalHandler = () => {
    console.log(openRechargeDialog.value, 'RechargeModal.value.dialogOpen.value ')
    openRechargeDialog.value = true
};
onMounted(async ()=>{
  const {data:{items}} = await initSkusList({})

})

</script>

<style lang="less" scoped>
.container,
.container .slogan {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: aliceblue;

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

.subscription-card {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 140px;
}

.contact-footer {
    display: flex;
    flex-direction: row;
    background-color: #000000;
    height: 100%;
    color: #ffffff;
    padding-top: 17px;

    .footer-left {
        // flex: 1;
        margin-left: 200px;
        margin-top: 20px;
        line-height: 2;

        .about-us {
            font-size: 16px;
            font-weight: 600;
        }

    }



    .footer-center {
        display: flex;
        flex-direction: row;


        .service-list {
            margin-left: 100px;
            line-height: 2.2;
        }

        .more-contact {
            margin-left: 100px;
            margin-top: 30px;
            line-height: 2;

            .tip1 {
                font-size: 20px;
                font-weight: 600;
            }
        }
    }

    .QR-contact {
        width: 140px;
        height: 140px;
        background-color: #999;
        margin-left: 100px;
        margin-top: 7px;
    }
}
</style>
