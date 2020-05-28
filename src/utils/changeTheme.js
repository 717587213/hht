// 根据name匹配列表中的URL
function matchFileName (list, name, callback) {
  for (let i = 0; i < list.length; i++) {
    let el = list[i]
    let fileName = el.substring(el.lastIndexOf('/') + 1)
    let reg = new RegExp('^' + name + '(\\.\\w+)*\\.css$')
    if (reg.test(fileName)) {
      if (callback) {
        callback(el)
      }
      return false
    }
  }
}
function changeStyle (file) {
  let domHead = document.getElementsByTagName('HEAD').item(0)
  let styleList = domHead.querySelectorAll('link[rel="stylesheet"]')
  let urlList = []
  let hasFile = false
  let deleteTheme = ''
  // 生成当前加载的css地址数组
  for (let i = 0; i < styleList.length; i++) {
    urlList.push(styleList[i].getAttribute('href'))
  }

  // 判断是否有匹配的文件
  matchFileName(urlList, file, function () {
    hasFile = true
  })

  // 如果head中的样式表中没有对应的文件则向head中写入file
  if (!hasFile && window.themeURL) {
      // 删除其他主题文件
    urlList.forEach(el => {
      if (window.themeURL.indexOf(el) >= 0) {
        deleteTheme = document.querySelectorAll(`link[href="${el}"]`)[0]
        setTimeout(() => {
          deleteTheme.parentNode.removeChild(deleteTheme)
        }, 1000)
      }
    })
    // 插入新style
    let style = document.createElement('link')
    matchFileName(window.themeURL, file, function (el) {
      style.href = el
    })
    style.rel = 'stylesheet'
    style.type = 'text/css'
    domHead.appendChild(style)
  }
}
export default changeStyle
