<template>
  <a-layout-header>
    <div class="logo">
      <!-- <img src="@/assets/images/logo.png" alt="LOGO" :style="{ height: '100%' }" /> -->
    </div>
    <a-menu v-model:selectedKeys="current" theme="dark" mode="horizontal" class="menu-styles">
      <a-menu-item key="homepage">首页</a-menu-item>
      <a-menu-item key="modelReplace">模特替换</a-menu-item>
    </a-menu>
    <div class="right-menu">
      <a-space :size="25" class="right-menu-space">
        <span class="account-balance">账户余额: 3000算力</span>
        <a-button @click="goToBuyingCenter">购买</a-button>
        <a-dropdown>
          <a-avatar size="large" class="avatar">
            <template #icon>
              <UserOutlined />
            </template>
          </a-avatar>
          <template #overlay>
            <a-menu>
              <a-menu-item>
                <user-outlined />
                <a href="javascript:;">4788778935</a>
              </a-menu-item>
              <a-menu-item>
                <account-book-outlined />
                <a href="javascript:;">我的订单</a>
              </a-menu-item>
              <a-menu-item>
                <export-outlined />
                <a href="javascript:;">退出登录</a>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </a-space>
    </div>
  </a-layout-header>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { UserOutlined, AccountBookOutlined, ExportOutlined } from '@ant-design/icons-vue'
import { useRouter, useRoute } from 'vue-router'

export default defineComponent({
  components: {
    UserOutlined,
    AccountBookOutlined,
    ExportOutlined
  },
  setup() {
    const current = ref<string[]>(['homepage'])
    const router = useRouter()
    const goToBuyingCenter = () => {
      router.push({ path: '/buy' })
    }
    return {
      current,
      goToBuyingCenter
    }
  }
})
</script>

<style lang="less" scoped>
.ant-layout-header {
  display: flex;
  align-items: center;
}
.logo {
  width: 120px;
  height: 31px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px 24px 16px 0;
  float: left;
}

.menu-styles {
  flex: 1;
  line-height: 64px;
}

.right-menu {
  margin-left: auto;

  .right-menu-space {
    margin-left: 25px;

    .account-balance {
      color: rgb(250, 250, 250);
    }

    .avatar {
      background-color: #87d068;
    }
  }
}
</style>
