import {post, get, upPost, put,postBlob} from './http'
const base = import.meta.env.VITE_BASE_URL
const fileBase = import.meta.env.VITE_FILE_BASE_URL
const corsBase = import.meta.env.VITE_FILE_CORS
//余额
export const initBillings = (payload: any) => {
  return get(`${base}/v1/token-digest`, payload)
}
//租户信息
export const initTenants = (payload: any) => {
  return get(`${base}/v1/list-tenants`, payload)
}
//模特列表
export const initModelsList = (payload: any) => {
  return get(`${base}/v1/list-models`, payload)
}
//订单列表
export const initOrderlList = (payload: any) => {
  return post(`${base}/v1/scroll-orders`, payload)
}
//商品列表
export const initSkusList = (payload: any) => {
  return get(`${base}/v1/list-skus`, payload)
}
//商品下单
export const initPayOrder = (payload: any) => {
  return post(`${base}/v1/place-order`, payload)
}
//支付订单
export const initOrderDetail = (orderId: any) => {
  return post(`${base}/v1/get-payment-form/${orderId}`, {})
}
//上传文件
export const uploadImg = (payload: any) => {
  return upPost(`${corsBase}/v1/upload-files`, payload)
}
//开始换脸任务
export const commitProcess = (payload: any) => {
  return post(`${base}/v1/commit-process`, payload)
}
//查看任务结果
export const rotationProcessResult = (id: string | number) => {
  return get(`${base}/v1/process/${id}`, {})
}
//获取图片下载地址
export const getImgDownUrl = (payload: any) => {
  return post(`${fileBase}/v1/file-download-urls`, payload)
}
//获取图片地址
export const getProcessIdImgDownUrl = (payload: any) => {
  const {processId, taskId, fileId,rate} = payload
  return put(`${base}/v1/process/${processId}/task/${taskId}/file/${fileId}`, {rate})
}
//支付待支付订单
export const payOrderByMyOrder = (payload: any) => {
  const {orderId} = payload
  return get(`${base}/v1/get-payment-form/${orderId}`,{})
}
//获取历史记录
export const getHistoryFace = (payload: any) => {
  return post(`${base}/v1/scroll-processes`,payload)
}
//获取历史记录
export const getScrollToken = (payload: any) => {
  return post(`${base}/v1/scroll-tokens`,payload)
}
//zip包地址
export const getZipDownLoadUrl = (payload: any) => {
  return postBlob(`${corsBase}/v1/download-zip-file`,payload)
}
//zip包地址
export const getFiles = (payload: any) => {
  return post(`${fileBase}/v1/list-files`,payload)
}
