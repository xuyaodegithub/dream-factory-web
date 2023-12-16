<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import {
  StepBackwardOutlined
} from '@ant-design/icons-vue';
const router = useRouter()
const route = useRoute()
function add() {
  router.push('/callback')
}
</script>

<template>
  <main class="content">
    <a-button type="primary" @click="add">Display normal message</a-button>
    <step-backward-outlined />
    <div style="height: 20000px;background-color: red;width: 100%"></div>
  </main>
</template>
<style lang="less" scoped>
.content{
  height: 100%;
  overflow: auto;
}
</style>