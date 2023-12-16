<template>
    <div class="container">
        <div class="slogan">
            <a-typography-title :level="2">让每个品牌都拥有数字模特</a-typography-title>
            <a-typography-title :level="5">1算力值生成1张图片，1元等于1个算力值</a-typography-title>
        </div>
        <OptionCardVue />
    </div>
</template>

<script setup lang="ts">
import OptionCardVue from "./components/OptionCard.vue";

</script>

<style lang="less" scoped>
.container,
.container .slogan {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    &.slogan {
        margin-top: 100px;
    }
}
</style>
