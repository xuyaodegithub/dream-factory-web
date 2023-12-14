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
  <main>
    <a-button type="primary" @click="add">Display normal message</a-button>
    <step-backward-outlined />
  </main>
</template>
