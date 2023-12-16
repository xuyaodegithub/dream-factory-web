export const resizeImg = (l: Array<any>) => {
  const hBase = 540//瀑布流高度基数
  const clientW = document.body.offsetWidth
  let wArr: number = 0
  let imgArr: Array<any> = []
  let resList:Array<any> = []
  l.forEach((item: any, idx: number) => {
    const { width, height, src } = item
    const scale = width / height
    const w = hBase * scale
    wArr = wArr + w + 24
    imgArr.push({src, w, h: hBase, width, height})
    if (wArr > clientW) {
      const len = imgArr.length
      const realH = hBase * (clientW - 24 * len) / (wArr - 24 * len)
      resList = [...resList, ...imgArr.map((it: any) => {
        const {width, height} = it
        const scale = width / height
        return {
          ...it,
          w: realH * scale,
          h: realH
        }
      })]
      wArr = 0
      imgArr = []
    }
    if (idx === l.length - 1 && imgArr.length) {
      resList = [...resList, ...imgArr]
    }
  })
  return resList
}
