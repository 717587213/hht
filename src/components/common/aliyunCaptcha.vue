<template>
    <div> 
        <div id="_umfp" style="display:inline;width:1px;height:1px;overflow:hidden"></div> 
        <div class="ln" id="ln">
            <div v-bind:id="dynamicId"></div>
        </div>  
        {{baseData}}
    </div>
</template>

<script>
import VueScript2 from 'vue-script2'
import bowser from 'bowser'
import { mapState } from 'vuex'

function randomCode (length) {
  let str = ''
  for (; str.length < length; str += Math.random().toString(36).substr(2)) {}
  return str.substr(0, length)
}

export default {
  name: 'AliyunCaptcha',
  // props: {
  //   scene: {
  //     type: String,
  //     required: true
  //   }
  // },
  data () {
    return {
      scene: 'login',
      nc_id: null,
      first: true,
      lan: null
    }
  },
  computed: {
    dynamicId () {
      this.nc_id = 'a' + randomCode(10)
      return this.nc_id
    },
    appkey () {
      return this.$store.state.baseData.nc_appkey
    },
    prefix () {
      return this.$store.state.baseData.nc_prefix || ''
    },
    ...mapState({
      baseData ({ baseData }) {
        this.lan = baseData._lan
        if (baseData.nc_appkey && this.first) {
          this.init()
        }
      }
    })
  },
  methods: {
    aliLang (newlang) {
      if (newlang.indexOf('zh') > -1 || newlang.indexOf('en') > -1) {
        newlang = newlang.split('_')[0]
      } else if (!newlang) {
        newlang = 'en'
      }
      return newlang
    },
    init () {
      // console.log(this.prefix)
      let nc = null
      let scene = this.scene  // 场景,不可更改
      let token = [this.appkey, (new Date()).getTime(), Math.random()].join(':')
      let option = {
        renderTo: '#' + this.dynamicId, // 渲染到该DOM ID指定的Div位置
        appkey: this.appkey,
        scene: this.prefix + scene,
        token: token,
        language: this.aliLang(this.lan),
        callback: (data) => { // 校验成功回调
          this.$emit('callback', {csessionid: data.csessionid, sig: data.sig, token: token, scene: scene, nc: nc})
        },
        error: function (s) {
          console.log('error', s)
        },
        verifycallback: function (data) {
          if (data.code === '200') {
          }
        }
      }
      this.$nextTick(() => {
        if (bowser.mobile) {
          VueScript2.load('//g.alicdn.com/sd/nch5/index.js?t=1497436353263')
            .then(function () {
              window.NoCaptcha.init(option)
              window.NoCaptcha.setEnabled(true)
              nc = window.NoCaptcha
            })
        } else {
          VueScript2.load('//g.alicdn.com/sd/ncpc/nc.js?t=1497440454594')
            .then(() => {
              class F extends window.noCaptcha {}
              nc = new F()
              nc.init(option)
            })
        }
      })
    }
  }
}
</script>

<style>
</style>