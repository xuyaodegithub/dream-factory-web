import axios from 'axios';
import {message} from 'ant-design-vue';
// import qs from 'qs'
import {getToken, removeToken, clearCookie, getTenant} from "../utils/index";
import router from '@/router'
const t = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ijd2VHNCMXFfd0hpbDBVajFjWTVMb3NpUmZfMW1kVURTUi0xZU5vajNVZWMifQ.eyJzdWIiOiI2MzQ1NWU4OWU1OGUzYzRiMjk3NzRmMTciLCJhdWQiOiI2NTc5MTNmYmZiZmQ5MjdiODA5YTNjYzMiLCJzY29wZSI6Im9wZW5pZCBhZGRyZXNzIG9mZmxpbmVfYWNjZXNzIHBob25lIGVtYWlsIHByb2ZpbGUiLCJpYXQiOjE3MDQyMDk0NDgsImV4cCI6MTcxNjMwNTQ0OCwianRpIjoiOVR1eWw1c01TNENaSUpuNE1yNUNkdHpPbXUxNzN0aWZ6d0ZWbEhieGFTTCIsImlzcyI6Imh0dHBzOi8vZGV2LWRpZ2l0YWwtZHJlYW0uYXV0aGluZy5jbi9vaWRjIn0.uekwURJRg8DHisuZwvZyHbdBCZeJ24DtWkuKmM5IS1Y1FYVtEIqucduiI8rA7Th71nxBof323ilyA1fGnPj_tFXYfSnRQjvAFadn_0WH0mmXLm-jov8mFAIRFiywOFm1ZyRC_PoP3ElJcSh4BnAq9H3giizOafEeXegFqrbzT8aYc9vbXaRXm_qW5oNkUHvSQ1qLz0d-iO_1O0qWRFrcSvx5k7fU9XQKR7E0i6Et-as-dTA39L7YQEBypcLT_PGd1wfYf7bZSf7_teGfUdtNOqh8D6IA6p71FuhbgfXAEUMLZJMBgDNB67NoLLqHJmBfjrdEzxm8_S5SqjHVgZzIfw'

axios.defaults.withCredentials = true//表示跨域请求时是否需要使用凭证,默认false，一般请求携带cookie是设置为true
// })
const instance: any = axios.create({
  baseURL: '',
  // timeout:10000,
});//自定义axios对象
instance.interceptors.request.use((config: any) => {//为自定义axios设置请求拦截器
  // 在发送请求之前做些什么config是axios请求实例 里面包含axios各种配置项和相关属性信息
  const [token, Tenant] = [getToken(), getTenant()]
  if (token) {
    config.headers['Authorization'] = token;
    config.headers['Tenant'] = Tenant || '';
  }
  return config
}, (error: any) => {
  // 对请求错误做些什么
  return Promise.reject(error)
});
instance.interceptors.response.use((response: any) => {//为自定义axios设置响应拦截器
  // 对响应数据做点什么
  const res = response.data
  if (res.code === 0) {
    return res
  } else if (res.code === 10001) {
    message.error('请先登录')
    router.replace('/')
    return res
  } else {
    if(!response.config.url?.endsWith('download-zip-file'))message.error(res.message || '系统错误')
    return res
    // return Promise.reject(response.data)
  }
}, (err: any) => {
  // 对请求错误做些什么
  if (!navigator.onLine) {
    message.warning('网络异常，请查看你的网络状态')
    return 'networkdisconnect';
  }
  // 根据你设置的timeout/真的请求超时 判断请求现在超时了，你可以在这里加入超时的处理方案
  if (err.code === 'ECONNABORTED' && err.message.indexOf('timeout') !== -1) {
    // return axios.request(originalRequest) // 再重复请求一次
    message.warning('网络超时，请重新尝试')
    return 'timeout';
  }
  return Promise.reject(err);
});
// instance.interceptors.request.eject(beforask);//移除请求拦截器方法
// instance.interceptors.response.eject(afterask);//移除响应拦截器方法

const post = (url: string, data: any) => {//post请求
  return instance({
    method: 'post',
    url: url,
    dataType: 'JSON',
    data: data
  })
}
const postBlob = (url: string, data: any) => {//post请求
  return instance({
    method: 'post',
    url: url,
    responseType:'blob',
    data: data
  })
}
const put = (url: string, data: any) => {//post请求
  return instance({
    method: 'put',
    url: url,
    dataType: 'JSON',
    data: data
  })
}
const paramspost = (url: string, data: any) => {//post请求  params参数
  return instance({
    method: 'post',
    url: url,
    dataType: 'JSON',
    params: data
  })
}
const get = (url: string, data: any) => {//get请求
  return instance({
    method: 'get',
    url: url,
    dataType: 'JSON',
    params: data
  })
}
const upPost = (url: string, data: any) => {//图片上传请求
  return instance({
    method: 'post',
    url: url,
    dataType: 'JSON',
    data: data,
    headers: {'Content-Type': 'multipart/form-data'}
  })
}
const paramspost2 = (url: string, data: any, file: File) => {//图片上传请求
  return instance({
    method: 'post',
    url: url,
    dataType: 'JSON',
    params: data,
    data: file,
    headers: {'Content-Type': 'application/octet-stream'}
  })
}


export {
  post,
  get,
  upPost,
  paramspost,
  paramspost2,
  put,
  postBlob,
}
