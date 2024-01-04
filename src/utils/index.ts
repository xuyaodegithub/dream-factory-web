/**
 * 关于账号token存储的文件   还各个页面的缓存字段
 * **/
import {userInfo} from "@/stores";

const [TokenKey,authingToken,userToken] = ['accessToken','_authing_token',''];

export function getToken() {
  const accessToken = window.localStorage.getItem(TokenKey)
  return `Bearer ${accessToken}`
}
export function getTenant() {
  const {userInfo:user}:any = userInfo()
  return user.Tenant
}

export function setToken(token: string) {
  return window.localStorage.setItem(TokenKey, token)
}

export function removeToken() {
  window.localStorage.removeItem(authingToken)
  return window.localStorage.removeItem(TokenKey)
}

export const setCookie = (name: string, cvalue: any, clearDay = 3650) => {
  const d = new Date();
  d.setTime(d.getTime() + Number(clearDay) * 24 * 60 * 60 * 1000);
  const expires = 'expires=' + d.toUTCString();
  const value = encodeURI(cvalue);
  document.cookie = name + '=' + value + ';' + expires;
};

export const getCookie = (name: string) => {
  const cname = name + '=';
  const carr = document.cookie.split(';');
  for (let i = 0; i < carr.length; i++) {
    let cvalue = carr[i];
    while (cvalue.charAt(0) === ' ') cvalue = cvalue.substring(1);
    if (cvalue.indexOf(cname) !== -1) {
      return decodeURI(cvalue.substring(cname.length, cvalue.length));
    }
  }
};

export const clearCookie = (name: string) => {
  setCookie(name, '', -1);
};
