'use strict'
// 动态设置VUE 路由
const fs = require('fs')
const path = require('path')
// const hostConfig = require('../hostConfig')
let routerMainUrl = path.resolve(__dirname, '../src/router/main.js')
// let projectPath = path.resolve(__dirname, '../src/product')
let configArgv = process.env.npm_config_argv
let runType = JSON.parse(configArgv).cooked[1]
let cooked = JSON.parse(configArgv).cooked[3]
let itemType = ''
if (cooked) {
  itemType = cooked.split('_')[0]
}
console.log(itemType)
const setRouter = function (argument) {
  let arr = ['main']  // 默认公共的组件 比如个人中心，登录，注册什么的
  if (runType === 'dev') { // 开发环境
    arr = ['main',' ex', ' otc', ' co']
  }
  if (runType === 'build') { // 生产环境
    if (!itemType) {
      console.error('ERRL: 打包参数错误，\n 交易所项目请执行：npm run build -- ex， \n 场外项目请执行： npm run build -- otc')
      return false
    }
    arr = ['main', ' ' + itemType]
  }
  // if (hostConfig.ex_open === '1') {
  //   arr.push(' ex') // eslint 规定数组后面要先有个空格，不然编译就会报eslint的错误 打包的时候也会报错
  // }
  // if (hostConfig.otc_open === '1') {
  //   arr.push(' otc')
  // }
  // if (hostConfig.co_open === '1') {
  //   arr.push(' contract')
  // }
  let arrString = arr.join(',')
  let routerContent = ''
  arr.map((item) => {
    item = item.replace(/(^\s*)|(\s*$)/g, '') // 正则是为了去掉前面的空格 因为 import 的路径不能有空格
    if (item === 'main') {
      routerContent += `import ${item} from './${item}/index.js'\n`
    } else {
      routerContent += `import ${item} from '@/product/exchange-vue-${item}/router/index.js'\n`
    }
  })
  routerContent += `let routerArr = main.concat(${arrString})\nexport default routerArr\n`
  fs.writeFile(routerMainUrl, routerContent, (err, data) => {
    console.log('\n', routerContent)
    console.log('router设置成功')
  })
}
setRouter()
