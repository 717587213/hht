<template>
  <div class="personal-content bg-img">
      <!-- 修改登录密码 表单-->
      <div class="form-box">
        <h3 class="page-title">{{pageTitle}}</h3>
        <template v-for="(item,key,index) in formList">
          <inline-input 
              v-bind:property = "item"
              v-model = "item.value"
              v-on:onevents = "somethings"> 
          </inline-input>
        </template>
        <div class="button-inline">
          <button @click="submit">{{buttonText}}</button>
        </div>
      </div>
  </div>
</template>
<script lang="js">
import InlineInput from '@/components/common/inlineInput'
import { mapState } from 'vuex'
export default {
  name: 'bindMobile',
  props: [],
  components: {
    InlineInput
  },
  data () {
    return {
      formList: {}
    }
  },
  mounted () {
    this.formList = this.formList_obj
  },
  watch: {
    'formList_obj' (val) {
      this.formList = val
    }
  },
  computed: {
    ...mapState({
      userinfo ({baseData: {_user}}) {
        return _user || false
      }
    }),

    pageTitle () {
      return this.userinfo.isOpenMobileCheck === 1 ? this.$t('personal.editPhone') : this.$t('personal.bindPhone')
    },
    buttonText () {
      return this.userinfo.isOpenMobileCheck === 1 ? this.$t('personal.confirmEdit') : this.$t('personal.confirm')
    },
    formList_obj () {
      let obj = {}
      if (this.userinfo.isOpenMobileCheck === 1) {
        obj.mobileNumber_old = {
          title: this.$t('personal.oldPhone'),
          formType: 'text',
          name: 'mobileNumber_old',
          readOnly: 'readOnly',
          value: this.userinfo.mobileNumber,
          countryCode: this.userinfo.countryCode
        }
        // 修改手机号 短信验证码
        obj.authenticationCode = {
          title: this.$t('personal.smsAuthCode'),
          formType: 'verifiCode',
          name: 'authenticationCode',
          operationType: 3,
          startTime: false,
          data: [],
          value: null
        }
      }
      obj.mobileNumber = {
        title: (this.userinfo.isOpenMobileCheck === 1) ? this.$t('personal.newBindPhone') : this.$t('personal.phoneNumber'),
        formType: 'phone',
        name: 'mobileNumber',
        value: null,
        countryCode: '+86'
      }
      obj.aliyunCapcha = {
        title: this.$t('personal.aliyunCapcha'),
        formType: 'aliyunCapcha',
        alicapcha: {},
        scene: 'login'
      }
      // 绑定手机号 短信验证码
      obj.smsAuthCode = {
        title: this.$t('personal.smsAuthCode'),
        formType: 'verifiCode',
        name: 'smsAuthCode',
        operationType: 2,
        startTime: false,
        data: ['aliyunCapcha', 'mobileNumber'],
        value: null
      }
      if (this.userinfo.googleStatus === 1) {
        Object.assign(obj, {
          googleCode: {
            title: this.$t('personal.googleCode'),
            formType: 'number',
            type: null,
            name: 'googleCode',
            value: null
          }
        })
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
    // 发送验证码
    sendCode (item) {
      let data = {}
      let fla = true
      let arr = this.formList[item.name].data || []
      if (this.formList[item.name].startTime) return false
      if (arr.length > 0) {
        arr.map((item) => {
          if (item === 'aliyunCapcha' || item === 'aliyunCapcha_1') {
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
              data.mobile = this.formList[item].value
            }
          }
        })
      }
      data.operationType = this.formList[item.name].operationType
      data.nc && data.nc.reset() // 重置滑动验证
      data.nc = null
      if (!fla) return false
      this.formList[item.name].startTime = true // 开启倒计时
      this.commonHttp.smsValidCode(data).then((data) => {
        if (data.code === '0') {
          this.$store.dispatch('setTipState', this.$t('personal.text_8'))
        } else {
          this.formList[item.name].startTime = false // 关闭倒计时
          this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
        }
      })
    },
    submit () {
      let data = {}
      let fla = true
      let url
      if (this.userinfo.isOpenMobileCheck === 1) {
        url = this.$store.state.url.personal.mobile_update
      } else {
        url = this.$store.state.url.personal.mobile_bind_save
      }
      for (let item in this.formList) {
        if (this.formList[item].value !== undefined && !this.formList[item].value) {
          this.$set(this.formList[item], 'errorInfo', this.$t('personal.text_7') + this.formList[item].title)
          fla = false
        } else if (!this.formList[item].readOnly) {
          data[item] = this.formList[item].value
        }
      }
      data['countryCode'] = this.formList['mobileNumber'].countryCode
      if (!fla) return false
      this.axios({
        url: url,
        headers: {},
        params: data,
        method: 'post'
      }).then((data) => {
        if (data.code === '0') {
          this.$store.dispatch('setTipState', this.$t('personal.submitCuccess'))
          this.$router.push('/personal')
        } else {
          this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
        }
      })
    }
  }
}
</script>

