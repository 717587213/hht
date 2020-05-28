<template>
  <div class="personal-content bg-img">
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
  name: 'closeMobileVerify',
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
      return this.$t('personal.closePhoneVer')
    },
    buttonText () {
      return this.$t('personal.confirm')
    },
    formList_obj () {
      return {
        smsValidCode: {
          title: this.$t('personal.smsAuthCode'),
          formType: 'verifiCode',
          name: 'smsValidCode',
          operationType: 14,
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
    // 发送验证码
    sendCode (item) {
      let data = {}
      if (this.formList[item.name].startTime) return false
      data.operationType = this.formList[item.name].operationType
      this.formList[item.name].startTime = true // 开启倒计时
      data.nc && data.nc.reset() // 重置滑动验证
      data.nc = null
      this.commonHttp.smsValidCode(data).then((data) => {
        if (data.code === '0') {
          this.$store.dispatch('setTipState', this.$t('personal.text_8'))
        } else {
          this.smsAuthCode.startTime = false // 关闭倒计时
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
      if (!fla) return false
      this.axios({
        url: this.$store.state.url.personal.close_mobile_verify,
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
<style lang="stylus">
  .personal-content {
      width: 1200px;
      margin: 0 auto;
      padding: 40px 0;
      min-height: 500px;
  }
</style>

