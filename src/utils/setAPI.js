// import hostConfig from './../../hostConfig.js'
let script = document.createElement('script')
script.type = 'text/javascript'
script.innerHTML = `window.siteType = ['ex', 'otc', 'co'] \n window.setHost('')`
document.getElementsByTagName('head')[0].appendChild(script)
