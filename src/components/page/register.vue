<template>
  <div class="login font-color">
    <div class="login-main">
      <div class="login-main-cont">
        <div class="index-login">
          <div class="login-head clearfix">
            <h3>{{$t('login.welcomeRegister')}}</h3>
            <div class="land">
              <p @click="togTab('tel')" :class='{findactive:register == "tel"}'>{{$t('login.text_01')}}</p>
            </div>
            <div class="land">
              <p @click="togTab('email')" :class='{findactive:register == "email"}'>{{$t('login.text_02')}}</p>
            </div>
          </div>
        </div>
        <div id="tel-list" class="show">
          <template v-for="(item,key,index) in formList">
            <inline-input 
            :property = "item"
            v-model = "item.value"
            @onevents = "somethings">
            </inline-input>
          </template>
          <p class="prom">
            <span class="robot-check-box">
              <label>
                <input id="check1" name="check1" type="checkbox" value="true" v-model='checkedNames' checked="checked" class="robot-check" style="">  {{$t('login.text_03')}}  
                <router-link :to="{path:'/cms',query: {id:'terms'}}">{{$t('login.text_04')}} </router-link> 
                <router-link :to="{path:'/cms',query: {id:'privacy_policy'}}">{{$t('login.text_05')}} </router-link>
              </label>
            </span>
            {{$t('login.isAccount')}} 
            <router-link to="/login"><i>{{$t('login.login')}}</i></router-link> 
          </p>
          <p v-if="checkederr" class="error-info" style="">{{$t('login.text_06')}} </p>
          <button :class="{readOnly: !flas}" class="loginBtn"  @click="submit">{{buttonText}}</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import InlineInput from '@/components/common/inlineInput'
import { mapState } from 'vuex'
export default {
  name: 'register',
  components: {
    InlineInput
  },
  data () {
    return {
      // 默认显示手机注册
      register: 'tel',
      flas: true,
      formList: {},
      checkedNames: true,
      checkederr: false,
      numberCode: null
    }
  },
  mounted () {
    this.formList = this.formList_obj
    let value = null
    let CodeDataLIst = this.$t('public.countryCodes')
    CodeDataLIst.map(item => {
      let li = item.split('+')[1]
      if (this.$store.state.baseData.default_code === '+' + li) {
        value = item.split('+')[2]
      }
    })
    this.numberCode = value
  },
  watch: {
    'formList_obj' (val) {
      this.formList = val
    },
    checkedNames (val) {
      if (val) {
        this.checkederr = false
      } else {
        this.checkederr = true
      }
    },
    '$store.state.baseData.default_code' (val) {
      let value = null
      let CodeDataLIst = this.$t('public.countryCodes')
      CodeDataLIst.map(item => {
        let li = item.split('+')[1]
        if (this.$store.state.baseData.default_code === '+' + li) {
          value = item.split('+')[2]
        }
      })
      this.numberCode = value
    }
  },
  computed: {
    ...mapState({
      public_info ({baseData}) {
        if (baseData.isReady) {
          return baseData
        } else {
          return false
        }
      }
    }),
    buttonText () {
      if (this.flas) {
        return this.$t('login.register')
      } else {
        return this.$t('login.registerIng')
      }
    },
    // numberCode () {
    //   let value = null
    //   let CodeDataLIst = this.$t('public.countryCodes')
    //   CodeDataLIst.map(item => {
    //     let li = item.split('+')[1]
    //     if (this.$store.state.baseData.default_code === '+' + li) {
    //       value = item.split('+')[2]
    //     }
    //   })
    //   return value
    // },
    formList_obj () {
      let obj = {}
      obj.numberCode = {
        title: this.$t('personal.nationality'),
        formType: 'countryCode',
        name: 'numberCode',
        placeholder: this.$t('otc.busines.defchoise') + this.$t('personal.nationality'),
        value: this.$store.state.baseData.default_code
      }
      if (this.register === 'tel') {
        obj.mobileNumber = {
          title: this.$t('personal.accountNumber'),
          formType: 'phone',
          name: 'mobileNumber',
          value: null,
          placeholder: this.$t('personal.placeholder_16'),
          countryCode: this.$store.state.baseData.default_code
        }
        obj.aliyunCapcha = {
          title: this.$t('personal.aliyunCapcha'),
          formType: 'aliyunCapcha',
          alicapcha: {},
          scene: 'register'
        }
        // 短信验证码
        obj.smsAuthCode = {
          title: this.$t('personal.smsAuthCode'),
          formType: 'verifiCode',
          name: 'smsAuthCode',
          operationType: 1,
          startTime: false,
          data: ['aliyunCapcha', 'mobileNumber'],
          value: null
        }
      }
      if (this.register === 'email') {
        obj.email = {
          title: this.$t('personal.accountNumber'),
          formType: 'text',
          placeholder: this.$t('personal.placeholder_15'),
          name: 'email',
          value: null
        }
        obj.aliyunCapcha = {
          title: this.$t('personal.aliyunCapcha'),
          formType: 'aliyunCapcha',
          alicapcha: {},
          scene: 'register'
        }
        // 邮箱验证码
        obj.emailAuthCode = {
          title: this.$t('personal.emailValidCode'),
          formType: 'verifiCode',
          name: 'emailAuthCode',
          operationType: 1,
          startTime: false,
          data: ['aliyunCapcha', 'email'],
          value: null
        }
      }
     // 密码
      obj.loginPword = {
        title: this.$t('login.password'),
        formType: 'password',
        name: 'loginPword',
        value: null
      }
      // 确认密码
      obj.newPassword = {
        title: this.$t('login.confirmPassword'),
        formType: 'password',
        name: 'newPassword',
        value: null
      }
      // 邀请码
      obj.invitedCode = {
        title: this.$t('personal.placeholder_17'),
        formType: 'text',
        name: 'invitedCode',
        noRequisite: true,
        value: this.getQueryString('inviteCode')
      }
      return obj
    }
  },
  methods: {
    // 获取 URL中的邀请码
    getQueryString (name) {
      let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
      let r = window.location.search.substr(1).match(reg)
      if (r != null) {
        return unescape(r[2])
      }
      return null
    },
    // input 事件
    somethings (value) {
      if (value.handleType === 'sendCode') {
        this.sendCode(value)
      }
      if (value.handleType === 'selectedCountryCode' && value.name === 'numberCode') {
        // 因为国籍编码的Input组件默认传的值是 code 所以 numberCode 需要单独处理
        console.log(value.value.numberCode)
        this.numberCode = value.value.numberCode
        // 手机号注册 手机国家区号和国籍联动
        if (this.register === 'tel') {
          this.formList.mobileNumber.countryCode = value.value.code
        }
      }
    },
    // tab切换
    togTab (res) {
      this.register = res
      this.formList = this.formList_obj
    },
    // 发送验证码
    sendCode (item) {
      let data = {}
      let fla = true
      let arr = this.formList[item.name].data || []
      if (this.formList[item.name].startTime) return false
      if (arr.length > 0) {
        arr.map((item) => {
          if (item === 'aliyunCapcha') {
            if (!this.formList[item].alicapcha.token) {
              fla = false
              this.$set(this.formList[item], 'errorInfo', this.$t('personal.text_6'))
            }
            data = Object.assign({}, this.formList[item].alicapcha, data)
          } else {
            if (!this.formList[item].value) {
              fla = false
              this.$set(this.formList[item], 'errorInfo', this.$t('personal.text_7') + this.formList[item].title)
            } else {
              if (this.register === 'tel') {
                data.countryCode = this.formList[item].countryCode
                data.mobile = this.formList[item].value
              } else {
                data.email = this.formList[item].value
              }
            }
          }
        })
      }
      if (!fla) return false
      data.operationType = this.formList[item.name].operationType
      this.formList[item.name].startTime = true // 开启倒计时
      data.nc && data.nc.reset() // 重置滑动验证
      data.nc = null
      this.formList['aliyunCapcha'].alicapcha = {}
      if (this.register === 'tel') {
        this.commonHttp.smsValidCode(data).then((data) => {
          if (data.code === '0') {
            this.$store.dispatch('setTipState', this.$t('personal.text_8'))
          } else {
            this.formList[item.name].startTime = false // 关闭倒计时
            this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
          }
        })
      } else if (this.register === 'email') {
        this.commonHttp.emailVaildCode(data).then((data) => {
          if (data.code === '0') {
            this.$store.dispatch('setTipState', this.$t('personal.text_8'))
          } else {
            this.formList[item.name].startTime = false // 关闭倒计时
            this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
          }
        })
      }
    },
    submit () {
      let data = {}
      let url = ''
      let flas = true
      let passwordReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z_]{8,16}$/
      if (this.register === 'tel') {
        url = this.$store.state.url.user.reg_mobile
      } else {
        url = this.$store.state.url.user.reg_email
      }
      for (let item in this.formList) {
        if (this.public_info.invitationCode === '1') {
          if (this.formList[item].value !== undefined && !this.formList[item].value) {
            this.$set(this.formList[item], 'errorInfo', this.$t('personal.text_7') + this.formList[item].title)
            flas = false
          } else {
            data[item] = this.formList[item].value
          }
        } else {
          if (this.formList[item].value !== undefined && !this.formList[item].value && !this.formList[item].noRequisite) {
            this.$set(this.formList[item], 'errorInfo', this.$t('personal.text_7') + this.formList[item].title)
            flas = false
          } else {
            data[item] = this.formList[item].value
          }
        }
      }
      // 单独给国籍编码赋值
      data.numberCode = this.numberCode
      // 判断密码是否正确
      if (data.loginPword && !passwordReg.test(data.loginPword)) {
        this.$set(this.formList['loginPword'], 'errorInfo', this.$t('login.text_07'))
        flas = false
      }
      //  验证两次密码是否相等
      if (data.newPassword !== data.loginPword) {
        this.$set(this.formList['newPassword'], 'errorInfo', this.$t('personal.text_9'))
        flas = false
      }
      // 如果是手机注册
      if (this.register === 'tel') {
        data.countryCode = this.formList.mobileNumber.countryCode
      }
      if (!this.checkedNames) {
        this.checkederr = true
        return false
      }
      if (!flas) return false
      if (!this.flas) return false
      this.flas = false
      if (this.register === 'tel') {
        this.formList['smsAuthCode'].value = null
        this.formList['smsAuthCode'].startTime = false
      } else {
        this.formList['emailAuthCode'].value = null
        this.formList['emailAuthCode'].startTime = false
      }
      this.axios({
        url: url,
        headers: {},
        params: data,
        method: 'post'
      }).then((data) => {
        if (data.code.toString() === '0') {
          this.$store.dispatch('setTipState', this.$t('login.registerCuccess'))
          this.$router.push('/login')
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

