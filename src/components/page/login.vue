<template>
  <div class="login font-color">
    <div class="login-main">
      <div class="login-main-cont">
        <div class="index-login">
          <div class="login-head clearfix">
            <h3>{{$t('login.welcomeLogin')}}</h3>
          </div>
        </div>
        <!-- 手机登陆 -->
        <div id="tel-list" class="show">
          <template v-for="(item,key,index) in formList">
              <inline-input 
                  :property = "item"
                  v-model = "item.value"
                  @onevents = "somethings"> 
              </inline-input>
          </template>
          <p class="prom">
            {{$t('login.noAccount')}} 
            <router-link to="/register"><i>{{$t('login.register')}}</i></router-link> 
            | 
            <router-link to="/forgetPassword"><i>{{$t('login.forgetPassword')}}</i></router-link> 
          </p>
          <button :class="{readOnly: !flas1}" class="loginBtn" @click="submit">{{buttonText}}</button>
        </div>
      </div>
    </div>
    <el-dialog 
      :title='tiptlText'
      :flag='loginDialog'
      name= 'loginDialog'
      :width='450'
      :dialogClose='closeDialog'>
      <div class="mobileverify-text" slot="content">
        <inline-input 
            :property = "getCodes"
            v-model = "getCodes.value"
            @onevents = "somethings"> 
        </inline-input>
      </div>
      <div slot="options">
        <button class="cancel" @click="closeDialog('closeMobileVerifyDialog')">{{$t('login.cancel')}}</button>
        <button :class="{readOnly: !flas}"  @click="submitCode">{{$t('login.confirm')}}</button>
      </div>
    </el-dialog >
 </div>
</template>
<script>
import InlineInput from '@/components/common/inlineInput'
import elDialog from '@/components/common/dialog'
import { mapState } from 'vuex'
export default {
  name: 'login',
  components: {
    InlineInput,
    elDialog
  },
  data () {
    return {
      // 默认显示手机登陆
      login: 'telLogin',
      loginDialog: false,
      token: null,
      flas1: true,
      flas: true, // 防止二次点击
      verifiType: '1',
      formList: {},
      getCodes: {},
      type: null
    }
  },
  mounted () {
    this.formList = this.telList
  },
  watch: {
    'telList' (val) {
      this.formList = val
    }
  },
  computed: {
    ...mapState({
      public ({baseData: {_data}}) {
        return _data || false
      }
    }),
    buttonText () {
      if (this.flas1) {
        return this.$t('login.login')
      } else {
        return this.$t('login.loginIng')
      }
    },
    tiptlText () {
      return this.$t('personal.tiptl')
    },
    telList () { // 手机登录
      let obj = {
        mobileNumber: {
          title: this.$t('personal.account'),
          formType: 'text',
          name: 'mobileNumber',
          focus: true,
          value: null,
          placeholder: this.$t('personal.placeholder_14'),
          countryCode: '+86'
        },
        // 密码
        loginPword: {
          title: this.$t('login.password'),
          formType: 'password',
          placeholder: this.$t('personal.placeholder_13'),
          name: 'loginPword',
          value: null
        }
      }
      if (this.public.openLoginVerificationMode && this.public.openLoginVerificationMode === '1') {
        // 验证方式
        obj.type = {
          title: this.$t('login.verification'),
          formType: 'select',
          placeholder: this.$t('login.default'),
          name: 'type',
          value: null,
          optionList: [
             {value: this.$t('login.email'), code: 'email'},
             {value: this.$t('login.phone'), code: 'phone'},
             {value: this.$t('login.google'), code: 'google'}
          ]
        }
      }
      obj.aliyunCapcha = {
        title: this.$t('personal.aliyunCapcha'),
        formType: 'aliyunCapcha',
        alicapcha: {},
        scene: 'login'
      }
      return obj
    },
    emailList () { // 邮箱登录
      return {
        email: {
          title: this.$t('personal.account'),
          formType: 'text',
          name: 'email',
          placeholder: this.$t('personal.placeholder_15'),
          value: null
        },
        // 邮箱密码
        loginPword: {
          title: this.$t('login.password'),
          formType: 'password',
          name: 'loginPword',
          value: null
        },
          // 滑动验证
        aliyunCapcha: {
          title: this.$t('personal.aliyunCapcha'),
          formType: 'aliyunCapcha',
          alicapcha: {},
          scene: 'login'
        }
      }
    },
    getCode () {
      let self = this
      if (this.verifiType === '1') {
        return {
          title: this.$t('personal.googleCode'),
          formType: 'number',
          type: null,
          name: 'googleCode',
          focus: true,
          keyupEnter: function (argument) {
            self.submitCode()
          },
          value: null
        }
      } else if (this.verifiType === '2') {
        return {
          title: this.$t('personal.smsAuthCode'),
          formType: 'verifiCode',
          name: 'smsAuthCode',
          operationType: 25,
          startTime: false,
          data: [],
          focus: true,
          keyupEnter: function (argument) {
            self.submitCode()
          },
          value: null
        }
      } else if (this.verifiType === '3') {
        return {
          title: this.$t('personal.emailValidCode'),
          formType: 'verifiCode',
          name: 'emailValidCode',
          operationType: 4,
          startTime: false,
          data: ['aliyunCapcha', 'email'],
          focus: true,
          keyupEnter: function (argument) {
            self.submitCode()
          },
          value: null
        }
      }
    }
  },
  methods: {
    // 关闭弹框
    closeDialog (e) {
      this.loginDialog = false
      this.getCodes.startTime = false // 关闭倒计时
    },
    somethings (value) {
      // console.log(value)
      if (value.handleType === 'sendCode') {
        this.sendCode(value)
      }
      if (value.name === 'type') {
        this.type = value.value.code
      }
    },
    // tab切换
    togTab (res) {
      this.login = res
      this.formList = {}
      for (let item in this.formList) {
        if (this.formList[item].errorInfo) {
          this.formList[item].errorInfo = null
        }
      }
    },
    sendCode (item) {
      let data = {
        token: this.token
      }
      let fla = true
      if (this.getCodes.startTime) return false
      if (!fla) return false
      data.operationType = this.getCodes.operationType
      this.getCodes.startTime = true // 开启倒计时
      if (this.verifiType === '2') {
        this.commonHttp.smsValidCode(data).then((data) => {
          if (data.code === '0') {
            this.$store.dispatch('setTipState', this.$t('personal.text_8'))
          } else {
            this.getCodes.startTime = false // 关闭倒计时
            this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
          }
        })
      } else if (this.verifiType === '3') {
        this.commonHttp.emailVaildCode(data).then((data) => {
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
        type: this.type
      }
      let fla = true
      let nc = ''
      for (let item in this.formList) {
        if (item === 'aliyunCapcha') {
          if (!this.formList[item].alicapcha.token) {
            fla = false
            this.$set(this.formList[item], 'errorInfo', this.$t('personal.text_6'))
          }
          data = Object.assign({}, this.formList[item].alicapcha, data)
          this.formList[item].alicapcha = {}
        }
        if (this.formList[item].value !== undefined && !this.formList[item].value) {
          if (item === 'type') {
            data[item] = this.formList[item].value
          } else {
            this.$set(this.formList[item], 'errorInfo', this.$t('personal.text_7') + this.formList[item].title)
            fla = false
          }
        } else {
          data[item] = this.formList[item].value
        }
      }
      nc = data.nc || ''
      // data.nc && data.nc.reset() // 重置滑动验证
      data.nc = null
      if (!fla) {
        nc.reset()
        return false
      }
      if (!this.flas1) return false
      this.flas1 = false
      this.axios({
        url: this.$store.state.url.user.login,
        headers: {},
        params: data,
        method: 'post'
      }).then((data) => {
        nc.reset()
        this.flas1 = true
        if (data.code === '0') {
          this.token = data.data.token
          this.verifiType = data.data.type
          this.getCodes = this.getCode
          this.loginDialog = true
          if (this.verifiType === '3' || this.verifiType === '2') {
            this.sendCode()
          }
        } else {
          this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
        }
      }).catch(() => {
        nc.reset()
        this.flas1 = true
      })
    },
    // 登录第二步 提交验证码
    submitCode () {
      let data = {
        token: this.token,
        type: this.type
      }
      let fla = true
      if (!this.flas) return false
      if (this.getCodes.value !== undefined && !this.getCodes.value) {
        this.$set(this.getCodes, 'errorInfo', this.$t('personal.text_7') + this.getCodes.title)
        fla = false
      } else {
        data['authCode'] = this.getCodes.value
      }
      if (!fla) return false
      this.flas = false
      this.axios({
        url: this.$store.state.url.user.confirm_login,
        headers: {},
        params: data,
        method: 'post'
      }).then((data) => {
        if (data.code === '0' || data.code === 0) {
          localStorage.setItem('token', this.token)
          this._COOKIE.setCookie('token', this.token)
          this.$store.dispatch('getCommonUser_info') // 请求userInfo
          this.$store.dispatch('setTipState', this.$t('login.loginCuccess'))
          this.closeDialog()
          this.$router.push({ name: 'index' })
        } else {
          this.flas = true
          this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
        }
      }).catch(() => {
        this.flas = true
      })
    }
  }
}
</script>
<style lang='stylus' scoped>
 .bottom{
   border-radius:4px 4px 0 0 !important;
   }
</style>
