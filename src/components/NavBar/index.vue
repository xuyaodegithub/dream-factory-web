<template>
  <a-layout-header>
    <div class="logo" @click="goToHomePage">
      <img src="@/assets/images/logo.png" alt="LOGO" />
    </div>
    <a-menu v-model:selectedKeys="current" theme="dark" mode="horizontal" class="menu-styles">
      <a-menu-item v-for="navItem in routesList" :key="`/${navItem.path}`">
        <router-link :to="navItem.path">{{ navItem.name }}</router-link>
      </a-menu-item>
    </a-menu>
    <div class="right-menu">
      <a-space :size="25" class="right-menu-space">
        <span class="account-balance" v-if="userMsg.phone"
          >账户余额: {{ userMsg.leftTokenCount }} 算力</span
        >
        <a-button @click="goToBuyingCenter">购买</a-button>
        <a-button type="primary" v-if="!userMsg.phone" @click="getLogin">登录</a-button>
        <a-dropdown v-else>
          <a-avatar size="large" class="avatar" :src="userMsg.photo">
            <!--            <template #icon>-->
            <!--              <UserOutlined/>-->
            <!--            </template>-->
          </a-avatar>
          <template #overlay>
            <a-menu>
              <a-menu-item
                v-for="menuItem in menuItems"
                :key="menuItem.key"
                @click="jumpPage(menuItem)"
              >
                <div class="item_ground">
                  <component :is="menuItem.icon" />
                  <span :to="menuItem.path">{{ menuItem.label }}</span>
                </div>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </a-space>
    </div>
  </a-layout-header>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { UserOutlined, AccountBookOutlined, ExportOutlined } from '@ant-design/icons-vue'
import { useRouter, RouterLink, useRoute } from 'vue-router'
import { watch } from 'vue'
import { routes } from '@/router/index'
import { userInfo } from '@/stores'
import { useGuard } from '@authing/guard-vue3'

const userStore: any = userInfo()
const current = ref<string[]>(['/'])
const router = useRouter()
const route = useRoute()
const guard = useGuard()
const userMsg = computed(() => {
  const { userInfo: userMsg } = userInfo()
  return userMsg
})
const menuItems = computed(() => {
  return [
    { key: '1', icon: UserOutlined, label: userMsg.value.phone, path: '' },
    { key: '2', icon: AccountBookOutlined, label: '我的订单', path: '/myOrder' },
    { key: '3', icon: ExportOutlined, label: '退出登录', path: '', logout }
  ]
})

function getLogin() {
  guard.startWithRedirect({ scope: 'openid profile email phone address offline_access' })
}

async function logout() {
  await guard.logout()
  userStore.clearUserInfo({})
}

function jumpPage(item: any) {
  const { path, logout } = item
  if (path) router.push(path)
  else {
    logout && logout()
  }
}

watch(
  route,
  (n: any) => {
    const { path } = n
    current.value = [path]
  },
  { deep: true, immediate: true }
)
const routesList = computed(() => {
  return routes[1].children.filter((i: any) => !i.hidden)
})
const goToHomePage = () => {
  router.push('/')
}

const goToBuyingCenter = () => {
  router.push('/buy')
}
</script>

<style lang="less" scoped>
.ant-layout-header {
  display: flex;
  align-items: center;
  height: 60px;
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
  line-height: 60px !important;
  height: 60px !important;

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

.item_ground {
  display: flex;
  align-items: center;

  span {
    margin-left: 8px;
  }
}
</style>
