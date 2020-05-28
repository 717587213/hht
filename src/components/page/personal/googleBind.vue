<template>
  <div id="googleBind" class="personal-content">
     <!-- 账户信息-->
     <div class="main-block">
        <div class="block-header">
           <h4>{{pageTitle}}</h4>
        </div>
        <div class="content-block">
          <template v-if="this.userinfo.googleStatus === 0">
              <div class="title">{{$t('personal.bingGoogleText_1')}}</div>
              <div class="img">
                  <img src="../../../assets/img/yzq.png" alt="">
                  <div class="link_block">
                    <a href="https://itunes.apple.com/us/app/google-authenticator/id388497605?mt=8" target="_blank" title="" class="app-link"></a>
                    <a href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2" target="_blank" title="" class="app-link"></a>
                    <a href="http://sj.qq.com/myapp/detail.htm?apkName=com.google.android.apps.authenticator2" target="_blank" title="" class="app-link"></a>
                  </div>
              </div>
              <div class="title">{{$t('personal.bingGoogleText_2')}}</div>
              <div class="miyao">
                <img :src="googleAuthenticator.googleImg" alt="">
                <div class="ewm">
                  <p>{{googleAuthenticator.googleKey}}</p>
                  <input class="inviteUrl_inp" type="text" name="url" ref="inviteUrl" :value="googleAuthenticator.googleKey" />
                  <button @click="copyUrl">{{$t('personal.copeGoogleCode')}}</button>
                </div>
              </div>
              <div class="title">{{$t('personal.bingGoogleText_3')}}</div>
              <div class="remarks">
                <i class="icon">!</i>
                {{$t('personal.bingGoogleText_4')}}
              </div>
            </template>
            <div else class="closegoogle_zh"></div>
            <template v-if="formList" v-for="(item,key,index) in formList">
              <inline-input 
                :property = "item"
                v-model="item.value"
                v-on:onevents="somethings" > 
              </inline-input>
            </template>
            <div class="button-inline">
              <button @click='submit'>{{buttonText}}</button>
            </div>
        </div>
     </div>
  </div>
</template>

<script lang="js">
import InlineInput from '@/components/common/inlineInput'
import { mapState } from 'vuex'
export default {
  name: 'googleBind',
  props: [],
  components: {
    InlineInput
  },
  data () {
    return {
      googleAuthenticator: {},
      isReady: false,
      formList: {}
    }
  },
  mounted () {
    this.ajaxGoogleAuthenticator()
  },
  watch: {
    'formList_obj' (val) {
      this.formList = val
    },
    'formList_close' (val) {
      this.formList = val
    }
  },
  computed: {
    ...mapState({
      userinfo ({baseData: {_user}}) {
        if (_user && _user.googleStatus === 0) {
          this.formList = this.formList_obj
        } else {
          this.formList = this.formList_close
        }
        return _user || false
      }
    }),
    pageTitle () {
      if (this.userinfo.googleStatus === 0) {
        return this.$t('personal.bingGoogleRz')
      } else {
        return this.$t('personal.closeGoogleRz')
      }
    },
    buttonText () {
      return this.$t('personal.confirmSubmit')
    },
    // 开启谷歌认证
    formList_obj () {
      return {
        loginPwd: {
          title: this.$t('personal.pasdCode'),
          formType: 'password',
          name: 'loginPword',
          value: ''
        },
        googleCode: {
          title: this.$t('personal.googleCode'),
          formType: 'number',
          type: null,
          name: 'googleCode',
          value: null,
          keyupEnter: () => {
            this.submit()
          }
        }
      }
    },
    // 关闭谷歌认证
    formList_close () {
      return {
        smsValidCode: {
          title: this.$t('personal.smsAuthCode'),
          formType: 'verifiCode',
          name: 'smsValidCode',
          operationType: 26,
          startTime: false,
          data: [],
          value: null
        },
        googleCode: {
          title: this.$t('personal.googleCode'),
          formType: 'number',
          type: null,
          name: 'googleCode',
          value: null,
          keyupEnter: () => {
            this.submit()
          }
        }
      }
    }
  },
  methods: {
    somethings (value) {
      if (value.handleType === 'sendCode') {
        this.sendCode(value)
      }
    },
    // 复制链接
    copyUrl () {
      this.$refs.inviteUrl.select()
      document.execCommand('copy')
      this.$store.dispatch('setTipState', this.$t('personal.copeSuccess'))
    },
    // 获取Google 认证信息
    ajaxGoogleAuthenticator () {
      this.axios({
        url: this.$store.state.url.personal.toopen_google_authenticator,
        headers: {},
        params: {},
        method: 'post'
      }).then((data) => {
        if (data.code === '0') {
          this.isReady = true
          this.googleAuthenticator = {
            googleUser: data.data.googleUser,
            googleKey: data.data.googleKey,
            googleImg: data.data.googleImg
          }
        }
      })
    },
    // 发送验证码
    sendCode (item) {
      let data = {}
      let fla = true
      let arr = this.formList[item.name].data || []
      let patt = new RegExp('aliyunCapcha')
      let pattEmail = new RegExp('email')
      if (this.formList[item.name].startTime) return false
      if (arr.length > 0) {
        arr.map((item) => {
          if (patt.test(item)) {
            if (!this.formList[item].alicapcha.token) {
              fla = false
              this.$set(this.formList[item], 'errorInfo', this.$t('personal.text_6'))
            }
            data = Object.assign({}, this.formList[item].alicapcha, data)
            this.formList[item].alicapcha = {}
          } else {
            if (!this.formList[item].value) {
              fla = false
              this.$set(this.formList[item], 'errorInfo', this.$t('personal.text_7') + this.formList[item].title)
            } else {
              data.countryCode = this.formList[item].countryCode
              data[item] = this.formList[item].value
            }
          }
        })
      }
      if (!fla) return false
      data.operationType = this.formList[item.name].operationType
      this.formList[item.name].startTime = true // 开启倒计时
      data.nc && data.nc.reset() // 重置滑动验证
      delete data.nc
      if (pattEmail.test(item.name)) {
        this.commonHttp.emailVaildCode(data).then((data) => {
          if (data.code === '0') {
            this.$store.dispatch('setTipState', this.$t('personal.text_8'))
          } else {
            this.getCodes.startTime = false // 关闭倒计时
            this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
          }
        })
      } else {
        this.commonHttp.smsValidCode(data).then((data) => {
          if (data.code === '0') {
            this.$store.dispatch('setTipState', this.$t('personal.text_8'))
          } else {
            this.getCodes.startTime = false // 关闭倒计时
            this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
          }
        })
      }
    },
    submit () {
      let data = {
        googleKey: this.googleAuthenticator.googleKey
      }
      let ajaxUrl
      if (!this.googleAuthenticator.googleKey && this.userinfo.googleStatus === 0) {
        this.$store.dispatch('setTipState', {text: this.$t('personal.error_404'), type: 'error'})
        return false
      }
      let fla = true
      console.log(this.formList)
      for (let item in this.formList) {
        if (this.formList[item].value !== undefined && !this.formList[item].value) {
          this.$set(this.formList[item], 'errorInfo', this.$t('personal.text_7') + this.formList[item].title)
          console.log(this.formList[item].errorInfo)
          fla = false
        } else {
          data[item] = this.formList[item].value
        }
      }
      console.log(data)
      if (!fla) return false
      if (this.userinfo.googleStatus === 0) {
        ajaxUrl = this.$store.state.url.personal.google_verify
      } else {
        ajaxUrl = this.$store.state.url.personal.close_google_verify
      }

      this.axios({
        url: ajaxUrl,
        headers: {},
        params: data,
        method: 'post'
      }).then((data) => {
        if (data.code === '0') {
          this.$router.push('/personal')
          this.$store.dispatch('setTipState', this.$t('personal.submitCuccess'))
        } else {
          this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
        }
      })
    }
  }
}
</script>
<style>
  #googleBind .main-block {
    padding-bottom: 100px;
  }
  .inviteUrl_inp {
    position: absolute;
    top: -8888px;
    left: -8888px;
    opacity: 0;
  }
  .closegoogle_zh {
    height: 100px;
  }
</style>


























