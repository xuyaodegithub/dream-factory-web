<template>
    <div class="header">
        <a-menu v-model:selectedKeys="current" mode="horizontal">
            <a-menu-item key="" disabled>
                <img src="@/assets/images/logo.png" alt="LOGO" class="logo" />
            </a-menu-item>
            <a-menu-item key="mail">
                <template #icon>
                    <mail-outlined />
                </template>
                首页
            </a-menu-item>
            <a-menu-item key="app">
                模特替换
            </a-menu-item>
        </a-menu>
        <a-space>
            <span>账户余额: 3000算力</span>
            <a-button>购买</a-button>
            <a-avatar size="large" style="background-color: #87d068">
                <template #icon>
                    <UserOutlined />
                </template>
            </a-avatar>
        </a-space>
    </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { UserOutlined } from '@ant-design/icons-vue';
export default defineComponent({
    components: {
        UserOutlined
    },
    setup() {
        const current = ref<string[]>(['mail']);
        return {
            current,
        };
    },
});
</script>
<style lang="less">
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .logo {
        width: 100px;
        height: auto;
    }
}
</style>
