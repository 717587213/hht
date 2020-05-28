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
  name: 'revisePassword',
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
    'userinfo' () {
      this.formList = this.formList_obj
    },
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
      return this.$t('personal.editLoginpass')
    },
    buttonText () {
      return this.$t('personal.confirmEdit')
    },
    formList_obj () {
      let obj = {
        loginPword: {
          title: this.$t('personal.oldLoginPass'),
          formType: 'password',
          type: null,
          name: 'loginPword',
          value: null
        },
        newLoginPword: {
          title: this.$t('personal.newLoginPass'),
          formType: 'password',
          type: null,
          name: 'newLoginPword',
          value: null
        },
        newLoginPword_2: {
          title: this.$t('personal.comfimNewPass'),
          formType: 'password',
          type: null,
          name: 'newLoginPword_2',
          value: null
        }
      }
      if (this.userinfo.isOpenMobileCheck === 1) {
        Object.assign(obj, {
          aliyunCapcha: {
            title: this.$t('personal.aliyunCapcha'),
            formType: 'aliyunCapcha',
            alicapcha: {},
            scene: 'login'
          },
          smsAuthCode: {
            title: this.$t('personal.smsAuthCode'),
            formType: 'verifiCode',
            name: 'smsAuthCode',
            operationType: 5,
            startTime: false,
            data: ['aliyunCapcha'],
            value: null
          }
        })
      }
      if (this.userinfo.googleStatus === 1) {
        Object.assign(obj, {
          googleCode: {
            title: this.$t('personal.googleCode'),
            formType: 'text',
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
          if (item === 'aliyunCapcha') {
            if (!this.formList[item].alicapcha.token) {
              fla = false
              this.$set(this.formList[item], 'errorInfo', this.$t('personal.text_6'))
            }
            data = Object.assign({}, this.formList[item].alicapcha, data)
            this.formList[item].alicapcha = {}
          }
        })
      }
      if (!fla) return false
      data.operationType = this.formList[item.name].operationType
      this.formList[item.name].startTime = true // 开启倒计时
      data.nc && data.nc.reset() // 重置滑动验证
      data.nc = null
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
      for (let item in this.formList) {
        if (this.formList[item].value !== undefined && !this.formList[item].value) {
          this.$set(this.formList[item], 'errorInfo', this.$t('personal.text_7') + this.formList[item].title)
          fla = false
        } else {
          data[item] = this.formList[item].value
        }
      }
      if (data.newLoginPword !== data.newLoginPword_2) {
        this.$set(this.formList['newLoginPword_2'], 'errorInfo', this.$t('personal.text_9'))
        fla = false
      }
      if (!fla) return false
      this.axios({
        url: this.$store.state.url.personal.password_update,
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