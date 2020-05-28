const fs = require('fs')
const path = require('path')
const config = require('../config')
const hostConfig = require('../hostConfig')
const utils  = require('./utils')
const cssPash = path.join(config.build.assetsRoot, config.build.assetsSubDirectory, 'css/')
const cheerio = require('cheerio')
const excludeFile = ['app.css']
const axios = require('axios')
const original = JSON.parse(process.env.npm_config_argv).original[3]
const itemType = original && original.split("_")[0] || ''
const testText = original && original.split("_")[1] || ''
const custom =  original && original.split("_")[2] || ''

function findSync(startPath) {
  let result = [];
  function finder(fullpath){
    let files = fs.readdirSync(fullpath)
    files.forEach((val, index) => {
      let fPath = path.join(fullpath, val);
      let fStat = fs.statSync(fPath);
      if (fStat.isDirectory()){
        finder(fPath)
      };
      if (fStat.isFile() && path.extname(fPath) == ".css") {
        var fileName = val.substring(0, val.indexOf(".")) + ".css"
        if(excludeFile.indexOf(fileName) < 0){
          let relativePath = config.build.assetsPublicPath + path.posix.join(config.build.assetsSubDirectory, "/css", val);
          result.push(relativePath)
        }
      }
    })
  }
  finder(startPath)
  return result
}
function formatTime (dateTime) {
  let date = new Date(dateTime)
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  let hours = date.getHours()
  let minutes = date.getMinutes()
  let seconds = date.getSeconds()
  function s (t) {
    return t < 10 ? '0' + t : t
  }
  return year + '-' + s(month) + '-' + s(day) + ' ' + s(hours) + ':' + s(minutes) + ':' + s(seconds)
}

function extractCss (){
  
  fs.readFile(config.build.index, 'utf8', (err,data) => {
    if(err) {
      throw err
    }
    console.log('打印itemType', itemType)  
    const $ = cheerio.load(data, {decodeEntities: false});
    const cssUrls = findSync(cssPash)
    let nowDate = formatTime(new Date().getTime())
    $('head').append(`<script>var PCV_TIME = ${JSON.stringify(nowDate)}</script>`)
    $('head').append(`<script>var themeURL = ${JSON.stringify(cssUrls)}</script>`)
    $('head').append(`<script>\n var siteType = ['${itemType}']; \n var testText = '${testText}'; \n var custom = '${custom}'; \n window.setHost('${testText}', '${custom}');`)
    $('head').append( `<script>
        if (/Android|webOS|iPhone|iPod|Windows Phone|BlackBerry/i.test(navigator.userAgent)) {
          let url = window.HOST_API.ex_h5_url
          if (window.siteType[0] === 'otc') {
            url = window.HOST_API.otc_h5_url
          } 
          if (window.siteType[0] === 'co'){
            url = window.HOST_API.co_h5_url
          }
          if(window.location.search.indexOf('inviteCode') !== -1 ){
            window.location.href = window.location.protocol + '//' +  url + '/register' + location.search
          } else {
            window.location.href = window.location.protocol + '//' +  url 
          }
        }
      </script>`)
    fs.writeFile(config.build.index, $.html(), err => {
      if (err) {
          throw err
      }
      console.log('css theme rewrite complete.')
    })  
  })
}

extractCss ()
