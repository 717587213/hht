<template>

  <section class="myapi">
       <div class="api-contenr">
              <p class="prompt">{{$t('user.api.prompt')}}</p>
              <!-- 新建api -->
              <div class="new-api" @click="newly()">{{$t('user.api.newapi')}}</div>
              <!-- api列表 -->
              <div>
                <div class="loading" v-if="loadingShow">
                  <loading></loading>
                </div>
                 <div class="api-list" v-else>

                <table>
                    <thead>
                       <tr class="api-head">
                      <th v-for= "(item,index) in listData" :key="index">{{item}}</th>
                    </tr>
                    </thead>
                  <tbody v-if="apiList">
                    <tr  v-for="(item,index) in apiList" :key="index">
                      <td>{{item.label}}</td>
                      <td>{{item.believeIps}}</td>
                      <td>{{item.token}}</td>
                      <td class="state-color"><span @click="seeApi(item, index)" >{{$t('user.questions.see')}}</span></td>
                      <td class="state-color"> <span @click="modifyApi(item)">{{$t('user.api.upload')}}</span> <span @click="dele(item)">{{$t('user.questions.delete')}}</span> </td>
                    </tr>
                   </tbody>
                </table>
                 <div v-if="apiList === null" class="no_data">
                       {{$t('user.api.no_api')}}
                    </div>
                    <Vpagination v-if="(apition.count/apition.pageSize) > 1"
                              :total="apition.count"
                              :current-page='apition.page'
                              :display='apition.pageSize'
                              @pagechange="apitionechage($event)" class="page">
                        </Vpagination>
            </div> 

              </div>
                <el-dialog :flag='isShow'
          :title='apiTitel'
          :width='450'
          :dialogClose='cole'
        >
          <div slot="content">
            <h4>{{cont}}</h4>
             <div class="qrcode" v-show="Qrcode" >
               <img :src="onapi.qrCode">
               <p>{{onapi.secretKey}}</p>
             </div>
            <template v-for="(item,key,index) in apidata">
                <inline-input 
                    :property = "item"
                    v-model = "item.value"
                    @onevents = "somethings"> 
                 </inline-input>
             </template>
          </div>
          <div slot="options"><button v-show="rest" @click="reset()">{{$t('user.api.cancel')}}</button><button v-show="confim" @click="submit()">{{$t('user.api.determine')}}</button></div>
        </el-dialog>
         <el-dialog :flag='valid'
          :title='apiTitel'
          :width='450'
          :dialogClose='coles'>
        <div slot="content">
            <h4>{{$t('user.api.binding')}}</h4>
        </div>
        <div slot="options"> <router-link to="/personal/bindMobile/" tag="button">{{$t('user.api.binding_phone')}}</router-link> <router-link to="/personal/googlebind/" tag="button">{{$t('user.api.binding_google')}}</router-link></div>
        </el-dialog>
          </div>
        </div>
  </section>

</template>

<script lang="js">
import InlineInput from '@/components/common/inlineInput'
import elDialog from './../../common/dialog'
import Vpagination from '@/components/common/pagination'
import loading from '../../common/loadingModel'

import { mapState } from 'vuex'

export default {
  name: 'myapi',
  props: [],
  components: {
    InlineInput,
    elDialog,
    Vpagination,
    loading
  },
  data () {
    return {
      isShow: false,
      apiTitel: '', // 弹框标题
      apidata: '',  // input框集合
      cont: '',     // 弹框内容
      apiList: [],  // API列表数据
      rest: false,  // 是否显示取消按钮
      confim: true, // 是否显示确认按钮
      onapi: '',    // 单个api数据
      Qrcode: false,
      axiosUrl: '',
      apiType: '',
      msage: '',
      index: '',
      valid: false,
      apition: {
        count: 50,
        pageSize: 10,
        page: 1
      },
      loadingShow: false,
      // 新建API
      newapi: {},
      //  查看api
      seeapi: {},
      // 修改api
      modify: {}
    }
  },
  mounted () {
    this.newapi = this.newapi_obj
    this.seeapi = this.seeapi_obj
    this.modify = this.modify_obj
    this.loading()
  },
  watch: {
    'newapi_obj' (val) {
      this.newapi = val
    },
    'seeapi_obj' (val) {
      this.seeapi = val
    },
    'modify_obj' (val) {
      this.modify = val
    }
  },
  computed: {
    ...mapState({
      userinfo ({baseData: {_user}}) {
        return _user || false
      }
    }),
    listData () {
      return [
        this.$t('user.api.lable'),
        this.$t('user.api.api_addres'),
        this.$t('user.api.token'),
        this.$t('user.api.key'),
        this.$t('user.api.operation')
      ]
    },
    // 新建api
    newapi_obj () {
      return {
          // 备注名
        label: {
          title: this.$t('user.api.memo'),
          formType: 'text',
          name: 'label',
          value: '',
          placeholder: this.$t('user.api.memo_holder')
        },
        // api地址
        believeIps: {
          title: this.$t('user.api.api_addres'),
          formType: 'text',
          name: 'believeIps	',
          value: '',
          placeholder: this.$t('user.api.api_addres_holder')
        },
        // 短信验证码
        smsValidCode: {
          title: this.$t('user.api.validCode'),
          formType: 'verifiCode',
          name: 'smsValidCode',
          payload: 'phoneNumber',
          operationType: 16,
          startTime: false,
          value: '',
          placeholder: this.$t('user.api.validCode_holder')
        },
        // 谷歌验证证
        googleCode: {
          title: this.$t('user.api.googleCode'),
          formType: 'number',
          name: 'googleCode',
          value: '',
          placeholder: this.$t('user.api.googleCode_holder')
        }
      }
    },
    // 查看api
    seeapi_obj () {
      return {
        smsValidCode: {
          title: this.$t('user.api.validCode'),
          formType: 'verifiCode',
          name: 'smsValidCode',
          payload: 'phoneNumber',
          operationType: 16,
          startTime: false,
          value: '',
          placeholder: this.$t('user.api.validCode_holder')
        },
        // 谷歌验证证
        googleCode: {
          title: this.$t('user.api.googleCode'),
          formType: 'number',
          name: 'googleCode',
          value: '',
          placeholder: this.$t('user.api.googleCode_holder')
        }
      }
    },
    // 修改api
    modify_obj () {
      return {
                // 备注名
        label: {
          title: this.$t('user.api.memo'),
          formType: 'text',
          name: 'label',
          value: '',
          placeholder: this.$t('user.api.memo_holder')
        },
        // api地址
        believeIps: {
          title: this.$t('user.api.api_addres'),
          formType: 'text',
          name: 'believeIps	',
          value: '',
          placeholder: this.$t('user.api.api_addres_holder')
        },
        // 短信验证码
        smsValidCode: {
          title: this.$t('user.api.validCode'),
          formType: 'verifiCode',
          name: 'smsValidCode',
          payload: 'phoneNumber',
          operationType: 16,
          startTime: false,
          value: '',
          placeholder: this.$t('user.api.validCode_holder')
        },
        // 谷歌验证证
        googleCode: {
          title: this.$t('user.api.googleCode'),
          formType: 'text',
          name: 'number',
          value: '',
          placeholder: this.$t('user.api.googleCode_holder')
        }
      }
    }
  },
  methods: {
    loading () {
      let _this = this
      this.loadingShow = true
      setTimeout(function () {
        _this.getapi()
      }, 500)
    },
    // 关闭弹框
    cole () {
      this.isShow = false
      this.eliminate()
    },
    coles () {
      this.valid = false
    },
    Projectile (inp, dis, title, ret, content, qr, fim) {
      this.apidata = inp      // 表单
      this.isShow = dis       // 控制弹框显示
      this.apiTitel = title   // 弹框标题
      this.rest = ret         // 取消按钮
      this.cont = content     // 内容
      this.Qrcode = qr        // 图片
      this.confim = fim       // 确认按钮
    },
    // 发送验证码
    somethings (v) {
      if (v.handleType === 'sendCode') {
        this.sendVerify(v)
      }
    },
    sendVerify (item) {
      let data = {}
      data.operationType = this.apidata[item.name].operationType
      this.apidata[item.name].startTime = true // 开启倒计时
      this.commonHttp.smsValidCode(data).then((data) => {
        if (data.code === '0') {
        }
      })
    },
    //  新建Api
    newly () {
      if (this.userinfo.googleStatus === 1 && this.userinfo.isOpenMobileCheck === 1) {
        this.Projectile(this.newapi, true, this.$t('user.api.newapi'), false, '', false, true)
      } else if (this.userinfo.isOpenMobileCheck === 1 && this.userinfo.googleStatus === 0) {
        delete this.newapi.googleCode
        this.Projectile(this.newapi, true, this.$t('user.api.newapi'), false, '', false, true)
      } else if (this.userinfo.isOpenMobileCheck === 0 && this.userinfo.googleStatus === 1) {
        delete this.newapi.smsValidCode
        this.Projectile(this.newapi, true, this.$t('user.api.newapi'), false, '', false, true)
      } else if (this.userinfo.isOpenMobileCheck === 0 && this.userinfo.googleStatus === 0) {
        this.Projectile('', false, '', false, '', false, false)
        this.valid = true
        this.apiTitel = this.$('user.questions.ques_prompt')
      }
      this.eliminate()
      this.axiosUrl = this.$store.state.url.personal.create_open_api
      this.apiType = 1
      this.getapi()
    },
    // 查看api
    seeApi (v) {
      if (this.userinfo.googleStatus === 1 && this.userinfo.isOpenMobileCheck === 1) {
        this.Projectile(this.seeapi, true, this.$t('user.api.see_api'), false, '', false, true)
      } else if (this.userinfo.isOpenMobileCheck === 1 && this.userinfo.googleStatus === 0) {
        delete this.seeapi.googleCode
      } else if (this.userinfo.isOpenMobileCheck === 0 && this.userinfo.googleStatus === 1) {
        delete this.seeapi.smsValidCode
      }
      this.Projectile(this.seeapi, true, this.$t('user.api.see_api'), false, '', false, true)
      this.eliminate()
      this.msage = v.token
      this.axiosUrl = this.$store.state.url.personal.open_api_on
      this.apiType = 2
    },
    // 修改api
    modifyApi (data) {
      this.modify.label.value = data.label
      this.modify.believeIps.value = data.believeIps
      this.axiosUrl = this.$store.state.url.personal.update_api
      if (this.userinfo.googleStatus === 1 && this.userinfo.isOpenMobileCheck === 1) {
        this.Projectile(this.modify, true, this.$t('user.api.update'), false, '', false, true)
      } else if (this.userinfo.isOpenMobileCheck === 1 && this.userinfo.googleStatus === 0) {
        delete this.modify.googleCode
      } else if (this.userinfo.isOpenMobileCheck === 0 && this.userinfo.googleStatus === 1) {
        delete this.modify.smsValidCode
      }
      this.Projectile(this.modify, true, this.$t('user.api.update'), false, '', false, true)
      this.apiType = 3
      this.msage = data.token
    },
    // 删除
    dele (v, i) {
      this.Projectile('', true, this.$t('user.questions.ques_prompt'), true, this.$t('user.api.delete'), false, true)
      this.axiosUrl = this.$store.state.url.personal.delete_open_api
      this.apiType = 4
      this.msage = v.token
      this.index = i
    },
    qrcode () {
      this.Projectile('', true, this.$t('user.order.trans_account.details'), false, '', true, false)
    },
    // 取消
    reset () {
      this.isShow = false
    },
    // 清除input内容
    eliminate () {
      for (let item in this.apidata) {
        if (this.apidata[item].value) {
          this.apidata[item].value = ''
        }
      }
    },
    submit () {
      let data = {}
      // 获取时间戳
      data.time = new Date().getTime()
      let fla = true
      for (let item in this.apidata) {
        if (item !== 'believeIps') {
          if (!this.apidata[item].value || this.apidata[item].value === '') {
            this.$set(this.apidata[item], 'errorInfo', this.$t('user.api.please_enter') + this.apidata[item].title)
            fla = false
          }
        }
        data[item] = this.apidata[item].value
      }
      if (!fla) return false
      if (this.apiType === 2) {
        data.token = this.msage
      }
      if (this.apiType === 4) {
        data.token = this.msage
      }
      if (this.apiType === 3) {
        data.token = this.msage
      }
      this.axios({
        url: this.axiosUrl,
        params: data,
        method: 'post'
      }).then((data) => {
        switch (this.apiType) {
          case 1: if (data.code === '0') {
            this.$store.dispatch('setTipState', this.$t('user.api.new_success'))
            this.getapi()
          } else {
            this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
          }
            break
          case 2:
            if (data.code === '0') {
              this.onapi = data.data
              this.qrcode()
            } else {
              this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
            }
            break
          case 4:
            if (data.code === '0') {
              this.$store.dispatch('setTipState', this.$t('user.questions.delete_succ'))
              this.apiList.splice(this.index, 1)
            } else {
              this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
            }
            break
          default: if (data.code === '0') {
            this.$store.dispatch('setTipState', this.$t('user.api.updata_success'))
            this.getapi()
          } else {
            this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
          }
            break
        }
      })
      this.isShow = false
      this.modify.smsValidCode.value = ''
      this.modify.googleCode.value = ''
    },
    getapi () {
      this.axios({
        url: this.$store.state.url.personal.my_api_list,
        headers: {},
        params: {
          page: this.apition.page,
          pageSize: this.apition.pageSize
        },
        method: 'post'
      }).then((data) => {
        if (data.code === '0') {
          this.loadingShow = false
          this.apiList = data.data.apiList
          this.apition.count = data.data.count
        } else {
          this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
        }
      })
    },
    apitionechage (i) {
      this.loadingShow = true
      this.apition.page = i
      let _this = this
      setTimeout(function () {
        _this.getapi()
      }, 500)
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
