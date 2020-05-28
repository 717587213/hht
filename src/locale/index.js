import Vue from 'vue'
import VueI18n from 'vue-i18n'
import zh from './zh'
import en from './en'
import ko from './ko'
import el from './el'
import mn from './mn'
import ja from './ja'
import ru from './ru'

Vue.use(VueI18n)
let getCookie = (name) => {
  let arrd = null
  let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
  if (document.cookie.match(reg)) {
    arrd = document.cookie.match(reg)
    return unescape(arrd[2])
  } else {
    return null
  }
}
// const lang = localStorage.getItem('lan') || 'en_US'
const lang = getCookie('lan') || 'en_US'

export const i18n = new VueI18n({
  locale: lang,
  messages: {
    zh_CN: {
      ...zh
    },
    en_US: {
      ...en
    },
    ko_KR: {
      ...ko
    },
    el_GR: {
      ...el
    },
    mn_MN: {
      ...mn
    },
    ja_JP: {
      ...ja
    },
    ru_RU: {
      ...ru
    }
  }
})

export function changeLanguage (lang) {
  i18n.locale = lang
  localStorage.setItem('lan', lang)
}
