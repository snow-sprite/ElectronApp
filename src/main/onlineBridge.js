import {
  ipcMain,
  dialog
} from 'electron'
import tinify from 'tinify'
import {
  pathLink, // 在线图片地址
  downloadPath // 默认下载路径为 「下载」 目录
}
  from './lib/formatter'
// import fs from 'fs'
import path from 'path'

ipcMain.on('onlineImgCompress', function (event, url, globalKey) {
  tinify.key = globalKey
  compressOnlineImg(event, url)
})

ipcMain.on('validateApiOnlineError', (event, errObj) => {
  dialog.showMessageBox({
    type: 'warning',
    title: 'Warning Box',
    message: `${errObj.status}`,
    detail: `${errObj.message}`,
    buttons: ['cancel', 'ok'],
    defaultId: 1,
    cancelId: 0
  })
})

// 压缩在线图片
function compressOnlineImg (eventReply, url) {
  let compressedOnlineImgPath = downloadPath()
  let minName = pathLink(url)

  tinify.fromUrl(url)
    .toFile(path.join(compressedOnlineImgPath, `${minName}`), () => {
      eventReply.sender.send('compressedOnlineImg', compressedOnlineImgPath)
      // 将当前apikey的编译量传送给页面
      // eventReply.sender.send('rebuildCount', tinify.compressionCount)
    })
}
