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
  name: 'bindEmail',
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
      return this.userinfo.email ? this.$t('personal.editBindEmail') : this.$t('personal.bindEmail')
    },
    buttonText () {
      return this.userinfo.email ? this.$t('personal.confirmEdit') : this.$t('personal.confirm')
    },
    formList_obj () {
      let obj = {}
      if (this.userinfo.email) {
        obj.oldEmail = {
          title: this.$t('personal.oldEmail'),
          formType: 'text',
          name: 'oldEmail',
          readOnly: 'readOnly',
          value: this.userinfo.email
        }
        // 修改邮箱  旧的邮箱验证码
        obj.emailOldValidCode = {
          title: this.$t('personal.emailValidCode'),
          formType: 'verifiCode',
          name: 'emailOldValidCode',
          operationType: 15,
          startTime: false,
          data: [],
          value: null
        }
      }
      obj.email = {
        title: (this.userinfo.isOpenMobileCheck === 1) ? this.$t('personal.newEmail') : this.$t('personal.emaiAddress'),
        formType: 'text',
        name: 'email',
        value: null
      }
      obj.aliyunCapcha = {
        title: this.$t('personal.aliyunCapcha'),
        formType: 'aliyunCapcha',
        alicapcha: {},
        scene: 'login'
      }
      if (this.userinfo.email) {
        // 修改邮箱  新的邮箱验证码
        obj.emailNewValidCode = {
          title: this.$t('personal.emailValidCode'),
          formType: 'verifiCode',
          name: 'emailNewValidCode',
          operationType: 15,
          startTime: false,
          data: ['aliyunCapcha', 'email'],
          value: null
        }
      } else {
        // 绑定邮箱  邮箱验证码
        obj.emailValidCode = {
          title: this.$t('personal.emailValidCode'),
          formType: 'verifiCode',
          name: 'emailValidCode',
          operationType: 2,
          startTime: false,
          data: ['aliyunCapcha', 'email'],
          value: null
        }
      }
      if (this.userinfo.isOpenMobileCheck === 1) {
        Object.assign(obj, {
          smsValidCode: {
            title: this.$t('personal.smsAuthCode'),
            formType: 'verifiCode',
            name: 'smsValidCode',
            operationType: (this.userinfo.email) ? 15 : 4,
            startTime: false,
            data: [],
            value: null
          }
        })
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
            this.formList[item.name].startTime = false // 关闭倒计时
            this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
          }
        })
      } else {
        this.commonHttp.smsValidCode(data).then((data) => {
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
      let fla = true
      let url
      if (this.userinfo.email) {
        url = this.$store.state.url.personal.email_update
      } else {
        url = this.$store.state.url.personal.email_bind_save
      }
      for (let item in this.formList) {
        if (this.formList[item].value !== undefined && !this.formList[item].value) {
          this.$set(this.formList[item], 'errorInfo', this.$t('personal.text_7') + this.formList[item].title)
          fla = false
        } else if (!this.formList[item].readOnly) {
          data[item] = this.formList[item].value
        }
      }
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

