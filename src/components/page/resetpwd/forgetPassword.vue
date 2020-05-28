<template>
  <div class="login font-color">
    <div class="login-main">
      <div class="login-main-cont">
        <div class="index-login">
          <div class="login-head clearfix">
            <h3>{{$t('login.retrievePas')}}</h3>
            <div class="land">
              <p @click="togTab('mobile')" :class='{findactive:type == "mobile"}'>{{$t('login.phoneRetrieve')}}</p>
            </div>
            <div class="land">
              <p @click="togTab('email')" :class='{findactive:type == "email"}'>{{$t('login.emailRetrieve')}}</p>
            </div>
          </div>
        </div>
        <div id="tel-list" class="show">
          <template v-if="step === '1'" v-for="(item,key,index) in step1_formData">
            <inline-input 
            :property = "item"
            v-model = "item.value"
            @onevents = "somethings"> 
            </inline-input>
          </template>
          <template v-if="step === '2'" v-for="(item,key,index) in step2_formData">
            <inline-input 
            :property = "item"
            v-model = "item.value"
            @onevents = "somethings"> 
            </inline-input>
          </template>
          <template  v-if="step === '3'" v-for="(item,key,index) in step3_formData">
            <inline-input 
            :property = "item"
            v-model = "item.value"
            @onevents = "somethings"> 
            </inline-input>
          </template>
          <div class="button_line">
            <!-- <button v-if="step > 1" class="loginBtn" @click="previous_step">{{$t('login.lastStep')}}</button> -->
            <button  class="loginBtn"  @click="submit">{{buttonText}}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import InlineInput from '@/components/common/inlineInput'
export default {
  name: 'forgetpasswork',
  components: {
    InlineInput
  },
  data () {
    return {
      step: '1',
      type: 'mobile',
      isCertificateNumber: '1',
      token: null,
      isGoogleAuth: '1',
      step1_formData: {},
      step2_formData: {},
      step3_formData: {}
    }
  },
  mounted () {
    this.step1_formData = this.step1
    this.step2_formData = this.step2
    this.step3_formData = this.step3
  },
  watch: {
    'step1' (val) {
      this.step1_formData = val
    },
    'step2' (val) {
      this.step2_formData = val
    },
    'step3' (val) {
      this.step3_formData = val
    }
  },
  computed: {
    buttonText () {
      if (this.step === '3') {
        return this.$t('personal.submit')
      } else {
        return this.$t('login.nextStep')
      }
    },
    step1 () {
      let obj = {}
      if (this.type === 'mobile') {
        obj.mobileNumber = {
          title: this.$t('personal.accountNumber'),
          formType: 'text',
          name: 'mobileNumber',
          value: null,
          placeholder: this.$t('personal.placeholder_16'),
          countryCode: '+86'
        }
      } else {
        obj.email = {
          title: this.$t('personal.accountNumber'),
          formType: 'text',
          placeholder: this.$t('personal.placeholder_15'),
          name: 'email',
          value: null
        }
      }
      obj.aliyunCapcha = {
        title: this.$t('personal.aliyunCapcha'),
        formType: 'aliyunCapcha',
        alicapcha: {},
        scene: 'forgetPassword'
      }
      return obj
    },
    step2 () {
      let obj = {}
      if (this.type === 'mobile') {
        obj.mobileNumber = {
          title: this.$t('personal.accountNumber'),
          formType: 'text',
          name: 'mobileNumber',
          countryCode: this.step1_formData.mobileNumber ? this.step1_formData.mobileNumber.countryCode : '',
          value: this.step1_formData.mobileNumber ? this.step1_formData.mobileNumber.value : '',
          readOnly: true
        }
        obj.smsCode = {
          title: this.$t('personal.smsAuthCode'),
          placeholder: this.$t('personal.smsAuthCode'),
          formType: 'verifiCode',
          name: 'smsCode',
          operationType: 24,
          startTime: false,
          data: [],
          value: null
        }
      } else {
        obj.email = {
          title: this.$t('personal.accountNumber'),
          formType: 'text',
          name: 'email',
          readOnly: true,
          value: this.step1_formData.email ? this.step1_formData.email.value : ''
        }
        obj.emailCode = {
          title: this.$t('personal.emailValidCode'),
          placeholder: this.$t('personal.emailValidCode'),
          formType: 'verifiCode',
          name: 'emailCode',
          operationType: '3',
          startTime: false,
          data: [],
          value: null
        }
      }
      if (this.isGoogleAuth === '1') {
        obj.googleCode = {
          title: this.$t('personal.googleCode'),
          formType: 'number',
          type: null,
          name: 'googleCode',
          value: null
        }
      }
      if (this.isCertificateNumber === '1') {
        obj.certifcateNumber = {
          title: this.$t('personal.identityAttestation'),
          formType: 'phone',
          name: 'certifcateNumber',
          value: null,
          optionList: [],
          readOnly_two: true,
          countryCode: this.$t('personal.Certificate')
        }
      }
      return obj
    },
    step3 () {
      let obj = {
        loginPword: {
          title: this.$t('personal.setLoginPas'),
          formType: 'password',
          type: null,
          name: 'loginPword',
          value: null
        },
        newPassword: {
          title: this.$t('personal.confirmLoginPas'),
          formType: 'password',
          type: null,
          name: 'newPassword',
          value: null
        }
      }
      return obj
    }
  },
  methods: {
    somethings (value) {
      if (value.handleType === 'sendCode') {
        this.sendCode(value)
      }
    },
    // tab切换
    togTab (res) {
      this.type = res
      this.step = '1'
      this.step1_formData = this.step1
      this.step2_formData = this.step2
      this.step3_formData = this.step3
    },
    // 发送验证码
    sendCode (item) {
      let data = {}
      let arr = this.step2_formData[item.name].data || []
      if (this.step2_formData[item.name].startTime) return false
      if (arr.length > 0) {
        arr.map((item) => {
          // data['countryCode'] = this.step2_formData[item].countryCode
          data[this.type] = this.step2_formData[item].value
        })
      }
      data.operationType = this.step2_formData[item.name].operationType
      data.token = this.token
      this.step2_formData[item.name].startTime = true // 开启倒计时
      if (this.type === 'mobile') {
        this.commonHttp.smsValidCode(data).then((data) => {
          if (data.code === '0') {
            this.$store.dispatch('setTipState', this.$t('personal.text_8'))
          } else if (data.code === '10031') {
            this.step = '1'
          } else {
            this.step2_formData[item.name].startTime = false // 关闭倒计时
            this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
          }
        })
      } else if (this.type === 'email') {
        this.commonHttp.emailVaildCode(data).then((data) => {
          if (data.code === '0') {
            this.$store.dispatch('setTipState', this.$t('personal.text_8'))
          } else if (data.code === '10031') {
            this.step = '1'
          } else {
            this.step2_formData[item.name].startTime = false // 关闭倒计时
            this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
          }
        })
      }
    },
    // 提交表单
    submit () {
      if (this.step === '1') {
        if (this.type === 'email') {
          this.step2_formData.email.value = this.step1_formData.email.value
        } else {
          this.step2_formData.mobileNumber.value = this.step1_formData.mobileNumber.value
        }
        this.submitStep1()
      } else if (this.step === '2') {
        this.submitStep2()
      } else if (this.step === '3') {
        this.submitStep3()
      }
    },
    submitStep1 () {
      let self = this
      let data = this.authData(this.step1_formData)
      data.nc && data.nc.reset() // 重置滑动验证
      if (!data.fla) return false
      data.nc = null
      delete data.fla
      if (this.type === 'mobile') {
        data['countryCode'] = this.step1_formData.mobileNumber.countryCode
      }
      this.sendAxios({
        url: self.$store.state.url.user.reset_password_one,
        data: data,
        resolve: function (odata) {
          self.isGoogleAuth = odata.data.isGoogleAuth
          self.isCertificateNumber = odata.data.isCertificateNumber
          self.token = odata.data.token
          self.step2_formData = self.step2
          self.step = '2'
        },
        reject: function (errData) {
          self.$store.dispatch('setTipState', {text: self.$t('error.' + errData.code), type: 'error'})
        }
      })
    },
    submitStep2 () {
      let self = this
      let data = this.authData(this.step2_formData)
      data.token = this.token
      if (!data.fla) return false
      delete data.fla
      this.sendAxios({
        url: self.$store.state.url.user.reset_password_two,
        data: data,
        resolve: function (odata) {
          self.step = '3'
        },
        reject: function (errData) {
          if (self.type === 'mobile') {
            self.step2_formData['smsCode'].value = null
            self.step2_formData['smsCode'].startTime = false
          } else {
            self.step2_formData['emailCode'].value = null
            self.step2_formData['emailCode'].startTime = false
          }
          self.$store.dispatch('setTipState', {text: self.$t('error.' + errData.code), type: 'error'})
        }
      })
    },
    submitStep3 () {
      let self = this
      let data = this.authData(this.step3_formData)
      if (!data.fla) return false
      data.token = this.token
      this.sendAxios({
        url: self.$store.state.url.user.reset_password_three,
        data: data,
        resolve: function (odata) {
          self.$store.dispatch('setTipState', self.$t('login.pasSetCuc'))
          self.$router.push('/login')
        },
        reject: function (errData) {
          self.$store.dispatch('setTipState', {text: self.$t('error.' + errData.code), type: 'error'})
        }
      })
    },
    authData (Formdata) {
      let data = {}
      data.fla = true
      for (let item in Formdata) {
        if (item === 'aliyunCapcha') {
          if (!Formdata[item].alicapcha.token) {
            data.fla = false
            this.$set(Formdata[item], 'errorInfo', this.$t('personal.text_6'))
          } else {
            data = Object.assign({}, Formdata[item].alicapcha, data)
            Formdata[item].alicapcha = {}
          }
        }
        if (Formdata[item].value !== undefined && !Formdata[item].value && !Formdata[item].noRequisite) {
          this.$set(Formdata[item], 'errorInfo', this.$t('personal.text_7') + Formdata[item].title)
          data.fla = false
        } else if (Formdata[item].readOnly) {
        } else {
          data[item] = Formdata[item].value
        }
      }
      if (this.step === '3') {
        let passwordReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z_]{8,16}$/
        // 判断密码是否正确
        if (data.loginPword && !passwordReg.test(data.loginPword)) {
          this.$set(Formdata['loginPword'], 'errorInfo', this.$t('login.text_07'))
          data.fla = false
        }
        if (data.newPassword !== data.loginPword) {
          this.$set(Formdata['newPassword'], 'errorInfo', this.$t('personal.text_9'))
          data.fla = false
        }
      }
      return data
    },
    sendAxios (option) {
      this.axios({
        url: option.url,
        headers: {},
        params: option.data,
        method: 'post'
      }).then((_data) => {
        if (_data.code.toString() === '0') {
          option.resolve(_data)
        } else {
          option.reject(_data)
        }
      })
    },
    previous_step () {
      if (this.step === '2') {
        this.step2_formData.certifcateNumber.value = null
        this.step2_formData.googleCode.value = null
        this.step2_formData.smsCode.value = null
        this.step = '1'
      } else if (this.step === '3') {
        this.step = '2'
      }
    }
  }
}
</script>
<style>
  .login-main .login-main-cont .loginBtn {
    margin-top: 50px;
  }
</style>



