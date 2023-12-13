<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import { Button } from 'ant-design-vue';
import {authingWebUse} from '@/authingConfig'
import {onMounted,ref,onBeforeMount,nextTick,reactive} from 'vue'
// import {router} from 'router'
import { Authing } from '@authing/web';

const state = reactive({
  loginState: null,
});
const a =ref(11)
const loading = ref(false)
onMounted(()=>{
  const { login,getLoginState,sdk} = authingWebUse(Authing)
  if (sdk.isRedirectCallback()) {
    console.log("redirect");

    /**
     * 以跳转方式打开 Authing 托管的登录页，认证成功后，
     * 需要配合 handleRedirectCallback 方法，在回调端点处理 Authing 发送
     * 的授权码或 token，获取用户登录态
     */
    sdk.handleRedirectCallback().then((res) => {
      state.loginState = res;
      this.$router.replace("/");
    });
  } else {
    getLoginState();
  }
  // setTimeout(login,5000)
})
function add (){
  a.value++
}
</script>

<template>
 <div class='app_content'>
   <a-spin size="large" v-if='loading'/>
   <RouterView v-else/>
 </div>
</template>

<style scoped lang='less'>
.app_content{
  height: 100%;
  position: relative;
  .ant-spin-spinning{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
}
</style>
