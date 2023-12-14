import {  post,get, upPost, paramspost, paramspost2 } from './http'

export const initLogin=(payload:any)=>{
  return post('',payload)
}
