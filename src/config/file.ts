export const acceptFileList: string = ".jpg,.jpeg,.png"
export const acceptSize = 50
export const maxLen = 20
export const selectNumberList = [1,2,3,4]
export const customRequest = (file: File) => {
  const {size, name, type} = file
  const fileSize = size / 1000 / 1000
  console.log(file, 'pppppp', fileSize)
}
