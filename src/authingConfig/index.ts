import {createGuard, useGuard} from '@authing/guard-vue3'
import router from '../router'
import {authingSdk, userInfo} from '@/stores'
const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ijd2VHNCMXFfd0hpbDBVajFjWTVMb3NpUmZfMW1kVURTUi0xZU5vajNVZWMifQ.eyJzdWIiOiI2MzQ1NWU4OWU1OGUzYzRiMjk3NzRmMTciLCJhdWQiOiI2NTc5MTNmYmZiZmQ5MjdiODA5YTNjYzMiLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIiwiaWF0IjoxNzAyODc1MDE5LCJleHAiOjE3MDQwODQ2MTksImp0aSI6Im95WExuWVQ3N1B2MWFGWVhjaHlIN2dUdU5ER25pNEp1N2JCRGs5UDU5ZkMiLCJpc3MiOiJodHRwczovL2Rldi1kaWdpdGFsLWRyZWFtLmF1dGhpbmcuY24vb2lkYyJ9.aZsfrXr9BU9L5i6U2WpwVQyR_KAmAAhVpslz6XNQyyGDYBJMlzekE_PaSTRFHwil7UO92vKS8JVTZldvVwibi72l7l0GgofldkdSXO0Fbhunwk312H5ZLpuxNBsnf9EWUEafhgst-M5raN_IFNfHFdkwQxeMWNn4xtjmihoECb01AEJKF0xN1lW7BP7IQHOGEtjPb6gEbumq0fgV2U8K19-kWlNLA9gBwbLKeqC3GtIx1wF9X7qsWGDjzAz4YT3IoZP3zJgrXajYWK3v-tvCX4tcWJRMdWkWGQBmRX9BhZ4ANJH1bl7y33ZhuiMWaHkbQl4uJy8wQCd8la6UEWbvwg'
export default function (app: any) {
  app.use(
      createGuard({
        appId: "657913fbfbfd927b809a3cc3",
        isSSO: false,
        // config: {
        //   socialConnectionList: ['github'],
        // },
        // 如果你使用的是私有化部署的 Authing 服务，需要传入自定义 host，如:
        // host: 'https://my-authing-app.example.com',

        // 默认情况下，会使用你在 Authing 控制台中配置的第一个回调地址为此次认证使用的回调地址。
        // 如果你配置了多个回调地址，也可以手动指定（此地址也需要加入到应用的「登录回调 URL」中）：
        // redirectUri: "YOUR_REDIRECT_URI"
      })
  )
}
export const handleAuthingLoginCallback = async () => {
  const guard = useGuard();
  const userInfoClass: any = userInfo()
  console.log("guard instance: ", guard, useGuard);
  try {
    // 1. 触发 guard.handleRedirectCallback() 方法完成登录认证
    // 用户认证成功之后，我们会将用户的身份凭证存到浏览器的本地缓存中
    await guard.handleRedirectCallback()

    // 2. 处理完 handleRedirectCallback 之后，你需要先检查用户登录态是否正常
    const loginStatus: any = await guard.checkLoginStatus()

    if (!loginStatus) {
      return console.error('Guard is not get login status')
    }

    // 3. 获取到登录用户的用户信息
    const userMsg: any = await guard.trackSession()
    // 3. 获取到登录用户的用户信息
    const {phone, photo, token:t} = userMsg
    userInfoClass.saveUserInfo({phone, photo, token})
    // 你也可以重定向到你的任意业务页面，比如重定向到用户的个人中心
    // 如果你希望实现登录后跳转到同一页面的效果，可以通过在调用 startWithRedirect 时传入的自定义 state 实现
    // 之后你在这些页面可以通过 trackSession 方法获取用户登录态和用户信息
    // 示例一：跳转到固定页面
    router.replace('/')
    // 示例二：获取自定义 state，进行特定操作
    // const search = window.location.search
    // 从 URL search 中解析 state
  } catch (e: any) {
    // 登录失败，推荐再次跳转到登录页面
    // guard.startWithRedirect();
    console.error('Guard handleAuthingLoginCallback error: ', e)
  }

}
/**
 * 初始化authing实例，并存在store
 * **/
export const initAuthingWebUse = (Authing: any) => {
  const authingSdkClass = authingSdk()
  const sdk: any = new Authing({
    // 应用的认证地址，例如：https://domain.authing.cn
    domain: 'https://dev-digital-dream.authing.cn',
    appId: '657913fbfbfd927b809a3cc3',
    // 登录回调地址，需要在控制台『应用配置 - 登录回调 URL』中指定
    redirectUri: 'http://dev.dreamher.cn:8080/callback',
    useImplicitMode: import.meta.env.VITE_MODE !== 'prod',
  });
  authingSdkClass.initSdk(sdk)

  // const getLoginState = async () => {
  //   const res = await sdk.getLoginState();
  //   if(!res)sdk.loginWithRedirect();
  //   userInfoClass.saveUserInfo(res)
  //  return res
  // };
  // return {
  //   getLoginState,sdk
  // }
}
/**
 * 获取用户的登录状态
 */
export const getLoginState = async () => {
  const userInfoClass: any = userInfo()
  const guard = useGuard();
  const loginStatus: any = await guard.checkLoginStatus()

  if (!loginStatus) {
    return false
  }
  // 3. 获取到登录用户的用户信息 储存
  if (!userInfoClass.phone) {
    const userMsg: any = await guard.trackSession()
    const {phone, photo, token:t} = userMsg
    userInfoClass.saveUserInfo({phone, photo, token})
  }
 return true
}
