<template>
    <a-layout>
        <a-layout-header :style="{ display: 'flex', position: 'fixed', zIndex: 1, width: '100%' }">
            <div class="logo">
                <!-- <img src="@/assets/images/logo.png" alt="LOGO" :style="{ height: '100%' }" /> -->
            </div>
            <a-menu v-model:selectedKeys="current" theme="dark" mode="horizontal"
                :style="{ flex: '1', lineHeight: '64px' }">
                <a-menu-item key="homepage">首页</a-menu-item>
                <a-menu-item key="modelReplace">模特替换</a-menu-item>
            </a-menu>
            <div class="right-menu">
                <a-space :size="25">
                    <span class="account-balance">账户余额: 3000算力</span>
                    <a-button>购买</a-button>
                    <a-dropdown>
                        <a-avatar size="large" style="background-color: #87d068">
                            <template #icon>
                                <UserOutlined />
                            </template>
                        </a-avatar>
                        <template #overlay>
                            <a-menu>
                                <a-menu-item>
                                    <user-outlined />
                                    <a href="javascript:;">1st menu item</a>
                                </a-menu-item>
                                <a-menu-item>
                                    <a href="javascript:;">2nd menu item</a>
                                </a-menu-item>
                                <a-menu-item>
                                    <a href="javascript:;">3rd menu item</a>
                                </a-menu-item>
                            </a-menu>
                        </template>
                    </a-dropdown>

                </a-space>
            </div>
        </a-layout-header>
    </a-layout>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { UserOutlined } from '@ant-design/icons-vue';
export default defineComponent({
    components: {
        UserOutlined
    },
    setup() {
        const current = ref<string[]>(['homepage']);
        return {
            current,
        };
    },
});
</script>
<style lang="less">
.logo {
    width: 120px;
    height: 31px;
    background: rgba(255, 255, 255, 0.2);
    margin: 16px 24px 16px 0;
    float: left;
}

.right-menu {
    margin-left: auto;
}

.account-balance {
    color: rgb(250, 250, 250);
}
</style>
