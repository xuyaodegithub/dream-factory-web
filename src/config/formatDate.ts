/**
 * Created by shisan 20231217
 */

Date.prototype.format = function(format:any) {
  const o = {
    'M+': this.getMonth() + 1,

    // month
    'd+': this.getDate(),

    // day
    'h+': this.getHours(),

    // hour
    'm+': this.getMinutes(),

    // minute
    's+': this.getSeconds(),

    // second
    'q+': Math.floor((this.getMonth() + 3) / 3),

    // quarter
    S: this.getMilliseconds(), // millisecond
  }

  const week = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, `${this.getFullYear()}`.substr(4 - RegExp.$1.length))
  }
  if (/(w+)/.test(format)) {
    format = format.replace(RegExp.$1, week[this.getDay()])
  }
  for (const k in o) {
    if (new RegExp(`(${k})`).test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : `00${o[k]}`.substr(`${o[k]}`.length))
    }
  }

  return format
}

/**
 * js时间对象的格式化
 * eg:format="yyyy-MM-dd hh:mm:ss";
 * eg:format="yyyy-MM-dd w";
 */
export function formatDate(format:any, pattern?:any) {
  if (format) {
    const Format = format instanceof Date ? format : new Date(typeof format == 'number' ? format : format.replace(/-/g, '/')),
      Pattern = pattern || 'yyyy-MM-dd hh:mm:ss'

    return Format.format(Pattern)
  }
}

// yyyy-MM-dd hh:mm:ss 当前时间
export function formatNow(pattern:any) {
  const Pattern = pattern || 'yyyy-MM-dd hh:mm:ss'

  return new Date().format(Pattern)
}

// Sat Sep 09 2017 15:16:01 GMT+0800 (CST)
export function DateFormat(format:any) {
  return format ? (format instanceof Date ? format : new Date(typeof format == 'number' ? format : format.replace(/-/g, '/'))) : new Date()
}

// 1504941315784
export function formatTime(format:any) {
  return format ? DateFormat(format).valueOf() : +new Date()
}
