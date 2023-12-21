/**
 * 关于账号token存储的文件   还各个页面的缓存字段
 * **/


const [TokenKey] = ['accessToken'];

export function getToken() {
  return 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ijd2VHNCMXFfd0hpbDBVajFjWTVMb3NpUmZfMW1kVURTUi0xZU5vajNVZWMifQ.eyJzdWIiOiI2MzQ1NWU4OWU1OGUzYzRiMjk3NzRmMTciLCJhdWQiOiI2NTc5MTNmYmZiZmQ5MjdiODA5YTNjYzMiLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIiwiaWF0IjoxNzAyODc1MDE5LCJleHAiOjE3MDQwODQ2MTksImp0aSI6Im95WExuWVQ3N1B2MWFGWVhjaHlIN2dUdU5ER25pNEp1N2JCRGs5UDU5ZkMiLCJpc3MiOiJodHRwczovL2Rldi1kaWdpdGFsLWRyZWFtLmF1dGhpbmcuY24vb2lkYyJ9.aZsfrXr9BU9L5i6U2WpwVQyR_KAmAAhVpslz6XNQyyGDYBJMlzekE_PaSTRFHwil7UO92vKS8JVTZldvVwibi72l7l0GgofldkdSXO0Fbhunwk312H5ZLpuxNBsnf9EWUEafhgst-M5raN_IFNfHFdkwQxeMWNn4xtjmihoECb01AEJKF0xN1lW7BP7IQHOGEtjPb6gEbumq0fgV2U8K19-kWlNLA9gBwbLKeqC3GtIx1wF9X7qsWGDjzAz4YT3IoZP3zJgrXajYWK3v-tvCX4tcWJRMdWkWGQBmRX9BhZ4ANJH1bl7y33ZhuiMWaHkbQl4uJy8wQCd8la6UEWbvwg'//window.localStorage.getItem(TokenKey)
}

export function setToken(token:string) {
  return window.localStorage.setItem(TokenKey,token)
}

export function removeToken() {
  return window.localStorage.removeItem(TokenKey)
}
export const setCookie = (name:string, cvalue:any, clearDay = 3650) => {
  const d = new Date();
  d.setTime(d.getTime() + Number(clearDay) * 24 * 60 * 60 * 1000);
  const expires = 'expires=' + d.toUTCString();
  const value = encodeURI(cvalue);
  document.cookie = name + '=' + value + ';' + expires;
};

export const getCookie = (name:string) => {
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

export const clearCookie = (name:string) => {
  setCookie(name, '', -1);
};
