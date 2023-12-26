<template>
    <a-modal :open="open" :width="900" @cancel='close' :footer="null">
        <template #title>
            <div class="title-1">模特定制咨询</div>
            <div class="title-tips">可以根据您的要求定制数字人模特</div>
        </template>
        <div class="dia-container">
            <div>
                <span class="span-strong">想要专属模特？</span>
                <span>定制模特仅供您进行使用，其他企业或个人均无权使用，定制专属模特需要有以下要求：</span>
            </div>
            <div class="require-item" v-for="(requireItem, index) in customizedRequirements" :key="index">
                {{ requireItem }}
            </div>
            <div class="QR-code-container">
                <div>
                    扫描下方二维码联系商务进行定制
                </div>
                <div class="QR-code">
                    二维码
                </div>
                <div>数梦万维商务助手</div>
            </div>
        </div>
    </a-modal>
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue';

const props: any = defineProps({
    open: {
        type: Boolean,
        default: false
    },
    close: Function
})

const emit = defineEmits(['update:open'])

const customizedRequirements = ref([
    '1. 模特样例图，您需要提供我们10-200张左右的模特图',
    '2. 模特图尽可能角度较多，不要遮挡脸部',
    '3. 描述具体的模特要求，比如：大眼睛、可爱风格、大长腿等等',
    '4. 定制模特需要收取一定的制作费，具体报价和实际效果请联系商务小助手'
])

</script>

<style lang="less" scoped>
.title-1 {
    font-size: 22px;
    font-weight: 600;
    color: #333;
    line-height: 28px;
}

.title-tips {
    font-size: 16px;
    font-weight: 500;
    color: #999;
    line-height: 20px;
    margin-top: 10px;
}

.dia-container {
    margin: 40px 0px;
    font-size: 16px;
    line-height: 2;

    .span-strong {
        font-size: 22px;
        fonr-weight: 600;
        color: #d8a04e;
    }

    .QR-code-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 40px;

        .QR-code {
            width: 300px;
            height: 300px;
            background-color: #999;
        }
    }
}
</style>