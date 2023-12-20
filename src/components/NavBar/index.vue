<template>
  <a-layout-header>
    <div class="logo" @click="goToHomePage">
      <img src="@/assets/images/logo.png" alt="LOGO" />
    </div>
    <a-menu v-model:selectedKeys="current" theme="dark" mode="horizontal" class="menu-styles" :items="navItems"
      @click="handleClick">
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
              <a-menu-item v-for="menuItem in menuItems" :key="menuItem.key">
                <component :is="menuItem.icon" />
                <router-link :to="menuItem.path">{{ menuItem.label }}</router-link>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </a-space>
    </div>
  </a-layout-header>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { UserOutlined, AccountBookOutlined, ExportOutlined } from '@ant-design/icons-vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import type { MenuProps } from 'ant-design-vue';
const router = useRouter()

const current = ref<string[]>()
const navItems = ref<MenuProps['items']>([
  {
    key: 'homePage',
    label: '首页',
  },
  {
    key: 'modelReplace',
    label: '模特替换',
  },
])

const handleClick: MenuProps['onClick'] = (e) => {
  const clickedKey = String(e.key);
  current.value = [clickedKey];
  if (clickedKey === 'homePage') {
    router.push('/')
  } else if (clickedKey === 'modelReplace') {
    router.push('/changingFace')
  }
}

router.beforeEach((to, from, next) => {
  if (to.path === '/') {
    current.value = ['homePage']
  } else if (to.path === '/changingFace') {
    current.value = ['modelReplace']
  }
  next()
})

const goToHomePage = () => {
  router.push('/')
}

const goToBuyingCenter = () => {
  router.push('/buy')
}

interface MenuItem {
  key: string;
  icon?: any;
  label: string;
  path: string;
}

const menuItems = ref<MenuItem[]>([
  { key: '1', icon: UserOutlined, label: '4788778935', path: 'javascript:;' },
  { key: '2', icon: AccountBookOutlined, label: '我的订单', path: '/myOrder' },
  { key: '3', icon: ExportOutlined, label: '退出登录', path: 'javascript:;' },
]);

</script>

<style lang="less" scoped>
.ant-layout-header {
  display: flex;
  align-items: center;
}

.logo {
  width: 40px;
  margin-right: 48px;
  cursor: pointer;

  img {
    display: block;
    width: 100%;
  }
}

.menu-styles {
  flex: 1;
  line-height: 64px;

  :deep(.ant-menu-item) {
    width: 100px !important;
    text-align: center !important;
  }
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
