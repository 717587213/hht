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
      pageTitle: '设置资金密码',
      buttonText: '确认修改',
      formList: {}
    }
  },
  mounted () {
    this.formList = this.formList_obj
  },
  computed: {
    ...mapState({
      userinfo ({baseData: {_user}}) {
        return _user || false
      }
    }),
    formList_obj () {
      let obj = {
        capitalPword: {
          title: '资金密码',
          formType: 'password',
          type: null,
          name: 'capitalPword',
          value: null
        },
        capitalPword_s: {
          title: '确认资金密码',
          formType: 'password',
          type: null,
          name: 'capitalPword_s',
          value: null
        }
      }
      if (this.userinfo.isOpenMobileCheck === 1) {
        Object.assign(obj, {
          aliyunCapcha: {
            title: '滑动验证',
            formType: 'aliyunCapcha',
            alicapcha: {},
            scene: 'login'
          },
          smsAuthCode: {
            title: '短信验证码',
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
            title: '谷歌验证码',
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
            if (!this.formList[item].alicapcha.aliyuntoken) {
              fla = false
              this.$set(this.formList[item], 'errorInfo', '请先验证滑动验证码')
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
      this.commonHttp.smsValidCode(data).then((data) => {
        data.code === 0 && this.$store.dispatch('setTipState', '验证码已发送')
      })
    },
    submit () {
      let data = {}
      let fla = true
      for (let item in this.formList) {
        if (this.formList[item].value !== undefined && !this.formList[item].value) {
          this.$set(this.formList[item], 'errorInfo', '请输入' + this.formList[item].title)
          fla = false
        } else {
          data[item] = this.formList[item].value
        }
      }
      if (data.capitalPword !== data.capitalPword_s) {
        this.$set(this.formList['capitalPword_s'], 'errorInfo', '两次新密码输入不一致')
        fla = false
      }
      if (!fla) return false
      this.axios({
        url: this.$store.state.url.personal.password_update,
        headers: {},
        params: data,
        method: 'post'
      }).then((data) => {
        if (data.code === 0) {
          this.$router.push('/personal')
          this.$store.dispatch('setTipState', '保存成功')
        }
      })
    }
  }
}
</script>

