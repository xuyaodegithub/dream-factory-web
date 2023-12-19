<template>
    <div class="card-container">
        <div class="package-name">1个月</div>
        <div class="package-price">480元</div>
        <div class="package-content">算力值480元，可生成480张图片</div>
    </div>
</template>

<script setup lang="ts">

</script>

<style lang="less">
.card-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 15px 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    width: fit-content;

    .package-name {
        font-size: 12px;
    }

    .package-price {
        font-size: 18px;
        line-height: 44px;
        font-weight: 700;
    }

    .package-content {
        font-size: 12px;
        color: #999;
    }
}
</style>