<template>
  <div id="personal" class="personal-content">
    <p style="display: none" v-if="public_info"></p>
     <!-- 账户信息-->
     <div class="main-block">
        <div class="block-header">
          {{$t('personal.personalInformation')}}
        </div>
        <table class="table-content">
          <tbody>
            <!-- 账号 -->
            <tr>
              <td width="145" class="tr-left">{{$t('personal.accountNumber')}} :</td>
              <td class="tr-center">
                {{userinfo.userAccount}}
              </td>
              <td class="tr-center-r">
                <!-- <label class="label-state state-not state-success">已认证</label> -->
              </td>
              <td class="tr-right"></td>
            </tr>
            <!-- 昵称 -->
            <tr>
             <td width="145" class="tr-left">{{$t('personal.nickname')}} :</td>
              <td class="tr-center" colspan="2">
                <input
                  v-show="editNickNameStatus"
                  type="text"
                  class="edit-name-input"
                  ref="editNickNameinput"
                  v-model="nickName"
                  @keyup.enter="editNickName"
                   />
                <span v-show = "!editNickNameStatus" class="name">{{nickName}}</span>

              </td>
              <td class="tr-right">
                <a href="javascript:void(0)" @click="editNickName" class="edit-name-btn">{{text.editNameBtn}}</a>
              </td>
            </tr>
            <!-- 经济人 -->
            <tr v-if="userinfo.agentStatus === 1">
             <td width="145" class="tr-left">{{$t('agent.rating')}}:</td>
              <td class="tr-center" colspan="2">
                <span  class="name">{{userinfo.roleName}}</span>

              </td>
              <td class="tr-right">
                <a href="javascript:void(0)" @click="Admini" class="edit-name-btn">{{$t('agent.management')}}</a>
              </td>
            </tr>
            <!-- 经济人 -->
            <tr v-if="userinfo.agentStatus === 0">
             <td width="145" class="tr-left">{{$t('agent.rating')}}:</td>
              <td class="tr-center" colspan="2">
                <span  class="name">{{userinfo.roleName}}</span>
              </td>
              <td class="tr-right">
                <a href="javascript:void(0)"  class="edit-name-btn">{{$t('agent.management')}}</a>
              </td>
            </tr>
            <!-- 账户状态 -->
            <tr>
             <td width="145" class="tr-left">{{$t('personal.accountState')}} :</td>
              <td class="tr-center">{{accountStatus}}</td>
              <td class="tr-center-r"></td>
              <td class="tr-right"></td>
            </tr>
            <!-- 邀请码 -->
            <tr v-if="userinfo.inviteCode">
             <td width="145" class="tr-left">{{$t('personal.invitedCode')}}:</td>
              <td class="tr-center">
                {{userinfo.inviteCode}}
              </td>
              <td>
                <p class="yqm-url">
                  {{inviteUrl}}
                  <input class="inviteUrl_inp" type="text" name="url" ref="inviteUrl" :value="inviteUrl" />
                </p>
              </td>
              <td class="tr-right">
                <a @click="copyUrl" href="javascript:void(0)">{{$t('personal.copyCode')}}</a>
                &nbsp;&nbsp;
                <a @click="copyCode" href="javascript:void(0)" class="QEcode">{{$t('personal.Qecode')}}</a>
              </td>
            </tr>
            <tr>
             <td width="145" class="tr-left">{{$t('personal.pasdCode')}} :</td>
              <td class="tr-center">*********</td>
              <td class="tr-center-r"></td>
              <td class="tr-right">
                <a @click="revisePassword" href="javascript:void(0)">{{$t('personal.edit')}}</a>
                <!-- <router-link :to="{path: '/personal/revisePassword'}">修改</router-link> -->
              </td>
            </tr>
            <tr>
             <td width="145" class="tr-left">{{$t('personal.safeName')}} :</td>
              <td class="tr-center">
                {{authLevel}}
                </td>
              <td class="tr-center-r">
                <p v-if="userinfo.authLevel === 3 " class="red-font">{{$t('personal.text_1')}}</p>
                <p v-if="userinfo.authLevel === 2 " class="red-font">{{userinfo.notPassReason}}</p>

              </td>
              <td class="tr-right">
                <template v-if="userinfo.authLevel > 1">
                  <router-link :to="{path: '/personal/infoAttestation'}">{{$t('personal.submitAuthen')}}</router-link>
                </template>
              </td>
            </tr>
            <tr v-if="userinfo.fee_coin_open !== '0'">
              <td width="145" class="tr-left">{{$t('personal.serviceChargeSet')}} :</td>
              <td class="tr-center" colspan="2">
                {{$t('personal.text_2')}}
                {{userinfo.feeCoin}}
                {{$t('personal.text_3')}}
                ({{userinfo.feeCoinRate}}%{{$t('personal.discount')}}）
              </td>
              <td class="tr-right">
                <div class="switch-btn" @click="useFeeCoin(useFeeCoinOpen)" :class = "useFeeCoinOpen === 1 ? 'selected' : 'no'">
                  <span v-if="useFeeCoinOpen === 1">{{$t('personal.make')}}</span>
                  <span v-else >{{$t('personal.notMake')}}</span>
                  <i class="icon radius-icon"></i>
                </div>
              </td>
            </tr>
            <tr v-if="userinfo.exchange_coin_url">
              <td  width="145" class="tr-left">{{$t('personal.coin_exchange')}} :</td>
              <td class="tr-center" colspan="2"><a :href="userinfo.exchange_coin_url + '&mobile=' + userinfo.mobileNumber" class="yqm-url" target="_blank">{{userinfo.exchange_coin_url + '&mobile=' + userinfo.mobileNumber}}</a></td>
            </tr>
          </tbody>



        </table>
     </div>
     <div class="main-block">
        <div class="block-header">
           <h4>{{$t('personal.safeSet')}}</h4>
        </div>
        <table class="table-content">
            <tbody>
              <tr>
                <!-- 手机验证 -->
                <td width="145" class="tr-left">{{$t('personal.phone')}} :</td>
                <td class="tr-center">
                  <template v-if="userinfo.mobileNumber">{{userinfo.mobileNumber}}</template>
                  <template v-if="userinfo.isOpenMobileCheck === 0" >
                    <span v-if="userinfo.mobileNumber">{{$t('personal.notVerify')}}</span>
                    <span v-else>{{$t('personal.notBind')}}</span>
                  </template>
                </td>
                <td class="tr-right">
                  <router-link :to="{path: '/personal/bindMobile'}">
                    <template v-if="!userinfo.mobileNumber">
                      {{$t('personal.bind')}}
                    </template>
                    <template v-else>
                      {{$t('personal.edit')}}
                    </template>
                  </router-link>
                  <template v-if="userinfo.mobileNumber">
                    <a v-if="userinfo.isOpenMobileCheck === 0" @click="openMobileVerify" href="javascript:void(0)">{{$t('personal.openVerify')}}</a>
                    <a v-else href="javascript:void(0)" @click="closeMobileVerify">{{$t('personal.closeVerify')}}</a>
                  </template>
                </td>
              </tr>
              <tr>
                <!-- 邮箱绑定 -->
                <td width="145" class="tr-left">{{$t('personal.emil')}} :</td>
                <td class="tr-center">
                  <template v-if="userinfo.email">{{userinfo.email}}</template>
                  <template v-else >{{$t('personal.notBind')}}</template>
                </td>
                <td class="tr-right">
                  <template v-if="userinfo.email">
                    <!-- 修改邮箱按钮 -->
                    <a @click="bindEmail" href="javascript:void(0)"> {{$t('personal.edit')}} </a>
                  </template>
                  <template v-else >
                    <!-- 绑定邮箱按钮 -->
                    <router-link :to="{path: '/personal/bindEmail'}"> {{$t('personal.bind')}} </router-link>

                  </template>

                </td>
              </tr>
              <tr>
                <!-- 谷歌验证 -->
               <td width="145" class="tr-left">{{$t('personal.googleVerify')}} :</td>
                <td class="tr-center">
                  <template v-if="userinfo.googleStatus === 1">{{$t('personal.inVerify')}}</template>
                  <template v-else >{{$t('personal.notVerify')}}</template>
                </td>
                <td class="tr-right">

                  <template v-if="userinfo.googleStatus === 1">
                    <!-- 关闭谷歌验证按钮 -->
                    <a href="javascript:void(0)" @click="closeGoogleBind">{{$t('personal.closeVerify')}}</a>
                  </template>
                  <template v-else >
                    <!-- 开启谷歌验证按钮 -->
                    <router-link :to="{path: '/personal/googlebind'}">{{$t('personal.openVerify')}}</router-link>
                  </template>

                </td>
              </tr>
            </tbody>
        </table>
     </div>
     <!-- {{siteType}} -->
     <!-- 场外收款方式 -->
     <div v-if="isotcOpen === '1' && siteType.indexOf('otc') !== -1" id="payment-block" class="main-block">
        <div class="block-header">
           <h4>
            {{$t('payments.set_payment')}}
           </h4>
        </div>
        <table class="table-content">
          <tbody>
        <tr>
            <td width="130" class="tr-left">
            {{$t('payments.set_payment')}}
            </td>
            <td class="tr-center">
              {{$t('payments.verify_text4')}}
            </td>
            <td class="tr-center-r">
                              
             </td>
            <td width="180" class="tr-right">
              <a href="javascript:;" class="add-payment-btn" @click="addPayment">{{$t('payments.add_payments')}}</a>
            </td>
          </tr>
            <template v-for="(item, index) in paymentLIst">
              <tr>
                <td width="130" class="tr-left">
                 
                </td>
                <td class="tr-center">
                   <img :src="item.icon" width="23" height="23">
                  <span class="title">{{item.title}}</span>
                  <span>{{item.account}}</span>
                  <span>{{item.userName}}</span>
                  <span>{{item.bankName}} {{item.bankOfDeposit}}</span>
                </td>
                <td class="tr-center-r">
                         <div class="switch-btn" @click="paymentIsOpen(item)" :class = "item.isOpen === 1 ? 'selected' : 'no'">
                    <!-- <span v-if="item.isOpen === 0"></span>
                    <span v-else ></span> -->
                    <i class="icon radius-icon"></i>
                  </div>
                  <router-link :to="{path: '/personal/payment', query:{key: item.payment}}">{{$t('personal.edit')}}</router-link>
                  <a @click="confirmDelete(item, index)" href="javascript:;">{{$t('fund.delete')}}</a>
                </td>
                <td width="180" class="tr-right">
           
                </td>
              </tr>
            </template>
            <!--  -->
              <tr>
                <td width="130" class="tr-left">
                </td>
                <td class="tr-center">
                </td>
                <td class="tr-center-r">
                
                </td>
                <td width="180" class="tr-right">

                </td>
              </tr>
              <!-- 资金密码 -->
              
              <tr>
                <td width="145" class="tr-left">
                  {{$t('otc.cliphe.fundpassword')}} :
                </td>
                <td class="tr-center">
                 {{$t('otc.cliphe.safety')}}
                </td>
                <td class="tr-center-r">
                
                </td>
                <td width="180" class="tr-right">
                  <a @click="setUp" href="javascript:;" v-if="userinfo.isCapitalPwordSet === 0">{{$t('otc.cliphe.Setup')}}</a>
                  <a @click="setUp" href="javascript:;" v-if="userinfo.isCapitalPwordSet === 1">{{$t('otc.cliphe.modify')}}</a>

                </td>
              </tr>
               <tr v-show="pwd">
                <td width="130" class="tr-left">
                </td>
                <td class="tr-center">
                  <span class="paswd">{{$t('otc.cliphe.Password')}} </span> 
                  <input 
                  type="password" 
                  class="capital-input" 
                  ref="pwdnput" 
                   v-on:input= 'pwdniput'
                   />
                  <b class="tips" v-if="tips1">{{tips_1}}</b>
                  <b class="error" v-else>{{error_1}}</b>
                </td>
                <td class="tr-center-r">
                
                </td>
                <td width="180" class="tr-right">
                </td>
              </tr >
              <tr v-show="newpwd">
                <td width="130" class="tr-left">
                </td>
                <td class="tr-center">
                  <span class="paswd">{{$t('otc.cliphe.Confirm')}}</span>
                     <input 
                  type="password" 
                  class="capital-input" 
                  ref="newpwdinput" 
                  v-on:input= 'paswd'
                   />
                   <b class="tips" v-if="tips2">{{tips_2}}</b>
                   <b class="error" v-else>{{error_2}}</b>

                </td>
                <td class="tr-center-r">
                
                </td>
                <td width="180" class="tr-right">
                </td>
              </tr>
              <tr v-show="preser">
                <td width="130" class="tr-left">
                </td>
                <td class="tr-center">
                  <button @click="submit" class="prese">{{$t('otc.cliphe.Preservation')}}</button>
                </td>
                <td class="tr-center-r">
                
                </td>
                <td width="180" class="tr-right">
                </td>
              </tr>
          </tbody>
        </table>
     </div>
     <div class="main-block">
        <div class="block-header">
           <div class="tab_nav">
             <span @click="historyTab('login')" :class="historyTabClass === 'login' ? 'selected' : ''">{{$t('personal.historyLogin')}}</span>
             <span @click="historyTab('setting')" :class="historyTabClass === 'setting' ? 'selected' : ''">{{$t('personal.safeSetHistory')}}</span>
           </div>
        </div>
        <div class="history-table-box">
          <table class="table-content history-table" v-if="historyData.length > 0">
            <tbody>
              <template v-if='historyTabClass === "login"'>
                <tr>
                  <th width="145" class="tr-left">{{$t('personal.loginTime')}}</th>
                  <th class="tr-center">{{$t('personal.loginTerrace')}}</th>
                  <th class="tr-center-r">{{$t('personal.loginIp')}}({{$t('personal.loginAddress')}})</th>
                  <th class="tr-right">{{$t('personal.status')}}</th>
                </tr>
                <template v-for="(item, index) in historyData">
                  <tr :class="{oddback: index%2 === 0}">
                    <td width="145" class="tr-left">{{item.formatLgInTime}}</td>
                    <td class="tr-center">{{item.lgPlatform}}</td>
                    <td class="tr-center-r">{{item.lgIp}}</td>
                    <td class="tr-right">{{handlelgStatus(item.lgStatus, '0')}}</td>
                  </tr>
                </template>
              </template>
              <template v-else>
                 <tr>
                  <th width="145" class="tr-left">{{$t('personal.setTime')}}</th>
                  <th class="tr-center-r">{{$t('personal.loginIp')}}({{$t('personal.loginAddress')}})</th>
                  <th class="tr-center-r">{{$t('personal.setContet')}}</th>
                </tr>
                <template v-for="(item, index) in historyData">
                  <tr :class="{oddback: index%2 === 0}">
                    <td width="145" class="tr-left">{{item.formatCtime}}</td>
                    <td class="tr-center-r">{{item.optIp}}</td>
                    <td class="tr-center-r">{{handlelgStatus(item.optType ,'1')}}</td>
                  </tr>
                </template>
              </template>
            </tbody>
          </table>
          <p v-else class="table_no_data">
            <span>{{$t('personal.notData')}}</span>
          </p>
        </div>
        <v-pagination v-if="(pagination.count/pagination.display) > 1"
                    :total="pagination.count"
                    :current-page='pagination.page'
                    :display='pagination.display'
                    @pagechange="pagechange($event)">
      </v-pagination>
     </div>
     <el-dialog
      :title='tiptlText'
      :flag='isVerifyDialog'
      name= 'isVerifyDialog'
      :width='450'
      :dialogClose='closeDialog'>
      <div class="mobileverify-text" slot="content">{{$t('personal.text_4')}}</div>
      <div slot="options">
        <!-- this.userinfo.googleStatus === 0 && this.userinfo.isOpenMobileCheck === 0 -->
        <template v-if="userinfo.isOpenMobileCheck === 0">
          <button @click="openMobileVerify" v-if="userinfo.mobileNumber">{{$t('personal.openPhoneVer')}}</button>
          <router-link  v-else :to="{path: '/personal/bindMobile'}" >
            <button >{{$t('personal.openPhoneVer')}}</button>
          </router-link>
        </template>
        <router-link :to="{path: '/personal/googlebind'}" v-if="userinfo.googleStatus === 0">
          <button>{{$t('personal.opengoogleVer')}}</button>
        </router-link>
        <!-- <button>开启谷歌验证</button> -->
      </div>
    </el-dialog >
    <el-dialog
      :title='Qecode'
      :flag='copyShow'
      name= 'copyShow'
      :width='450'
      :dialogClose='closeDialog'>
      <div slot="content">
        <img :src="inviteQECode" class="qeCode">
      </div>
      <div slot="options">
        <button @click="closeQC">{{$t('personal.confirm')}}</button>
      </div>
    </el-dialog >
    <!-- 删除支付方式 短信或谷歌验证 -->
    <el-dialog 
      :title='tiptlText'
      :flag='isDeleteDialog'
      name= 'isDeleteDialog'
      :width='450'
      :dialogClose='closeDialog'>
      <div slot="content">
        <div>
          <template v-if="verifiFormList" v-for="(item,key,index) in verifiFormList">
            <inline-input 
              :property = "item"
              v-model="item.value"
              v-on:onevents="somethings" 
              
              > 
            </inline-input>
          </template>
        </div>
      </div>
      <div slot="options">
        <button class="cancel" @click="closeDialog('isDeleteDialog')">{{$t('trade.cancel')}}</button>
        <button @click="deletePayment()">{{$t('personal.confirm')}}</button>
      </div>
    </el-dialog >
    <!-- 资金密码验证 -->
      <el-dialog :flag='isShow'
          :title='Titel'
          :width='450'
          :dialogClose='cole'
        >
          <div slot="content">
            <template v-for="(item,key,index) in formList">
                <inline-input 
                    :property = "item"
                    v-model = "item.value"
                    @onevents = "something"> 
                 </inline-input>
             </template>
          </div>
          <div slot="options"><button @click="confirm()">{{$t('user.api.determine')}}</button></div>
        </el-dialog>
  </div>
</template>

<script lang="js">
import { mapState } from 'vuex'
import elDialog from '@/components/common/dialog'
import VPagination from '@/components/common/pagination'
import InlineInput from '@/components/common/inlineInput'

export default {
  name: 'personal',
  props: [],
  components: {elDialog, VPagination, InlineInput},
  data () {
    return {
      editNickNameStatus: false,
      closeMobileVerifyDialog: false,
      isVerifyDialog: false,
      useFeeCoinOpen: 0,
      historyTabClass: 'login',
      historyData: [],
      nickName: null,
      inviteQECode: null,
      copyShow: false,
      pagination: {
        count: 0,
        page: 1,
        display: 10
      },
      isotcOpen: this.$store.state.baseData.otcOpen,
      isDeleteDialog: false,
      deletePaymentData: null,
      deletePaymentIndex: null,
      paymentLIst: [],
      verifiFormList: {},
      deleteFla: true,
      siteType: [],
      capital: true,
      isShow: false,
      Titel: this.$t('otc.cliphe.Security'),
      formList: {},
      pwd: false,
      newpwd: false,
      preser: false,
      tips_1: this.$t('otc.cliphe.consisting'),
      tips_2: this.$t('otc.cliphe.again'),
      tips1: true,
      tips2: true,
      error_1: '',
      error_2: '',
      pwds: null

    }
  },
  mounted () {
    this.getHistoryData(1)
    console.log(window)
    this.$store.dispatch('getCommonUser_info')
    if (this.isotcOpen === '1') {
      this.$store.dispatch('otcPublic_info')
      this.getPaymentLIst()
    }
  },
  watch: {
    'verifiFormList_obj' (value) {
      this.verifiFormList = value
    },
    '$store.state.baseData.otcOpen' (value) {
      this.isotcOpen = value
      if (value === '1') {
        this.$store.dispatch('otcPublic_info')
        this.getPaymentLIst()
      }
    },
    'FormList_obj' (val) {
      this.formList = val
    }

  },
  computed: {
    ...mapState({
      userinfo ({baseData: {_user}}) {
        if (_user) {
          this.nickName = _user.nickName
          this.inviteQECode = _user.inviteQECode
          this.useFeeCoinOpen = _user.useFeeCoinOpen
        }
        return _user || false
      },
      public_info ({baseData}) {
        if (baseData.isReady) {
          this.siteType = baseData._siteType
          return baseData
        } else {
          return false
        }
      }
    }),
    // 删除 收款方式 的验证码input
    verifiFormList_obj () {
      let obj = {}
      // 短信验证码
      if (this.userinfo.isOpenMobileCheck === 1) {
        obj.smsAuthCode = {
          title: this.$t('personal.smsAuthCode'),
          formType: 'verifiCode',
          name: 'smsAuthCode',
          operationType: 28,
          placeholder: this.$t('personal.text_7') + this.$t('personal.smsAuthCode'), // 请输入短信验证码
          startTime: false,
          data: [],
          value: null
        }
      }
      // google 验证码
      if (this.userinfo.googleStatus === 1) {
        obj.googleCode = {
          title: this.$t('personal.googleCode'),
          placeholder: this.$t('personal.text_7') + this.$t('personal.googleCode'), // 请输入谷歌验证码
          formType: 'number',
          type: null,
          name: 'googleCode',
          value: null
        }
      }
      return obj
    },
    // 邀请链接
    inviteUrl () {
      // return location.origin + '/register?inviteCode=' + this.userinfo.inviteCode
      return window.HOST_API.ex_pc_url + '/register?inviteCode=' + this.userinfo.inviteCode
    },
    // 邀请二维码
    Qecode () {
      return this.$t('personal.Qecode')
    },
    tiptlText () {
      return this.$t('personal.tiptl')
    },
    // 用户状态
    accountStatus () {
      if (this.userinfo.accountStatus === 0) {
        return this.$t('personal.stateOK')
      } else if (this.userinfo.accountStatus === 1) {
        return this.$t('personal.stateFreezeExc') + ',' + this.$t('personal.stateFreezeWithdraw')
      } else if (this.userinfo.accountStatus === 2) {
        return this.$t('personal.stateFreezeExc')
      } else if (this.userinfo.accountStatus === 3) {
        return this.$t('personal.stateFreezeWithdraw')
      }
    },
    // 用户认证
    authLevel () {
      if (this.userinfo.authLevel === 0) {
        return this.$t('personal.notAudit')
      } else if (this.userinfo.authLevel === 1) {
        return this.$t('personal.getThrough')
      } else if (this.userinfo.authLevel === 2) {
        return this.$t('personal.reject')
      } else if (this.userinfo.authLevel === 3) {
        return this.$t('personal.notAuthen')
      }
    },
    text () {
      return {
        editNameBtn: this.$t('personal.edit')
      }
    },
    FormList_obj () {
      let obj = {}
      // 短信验证码
      if (this.userinfo.isOpenMobileCheck === 1) {
        if (this.userinfo.isCapitalPwordSet === 0) {
          obj.smsAuthCode = {
            title: this.$t('personal.smsAuthCode'),
            formType: 'verifiCode',
            name: 'smsAuthCode',
            operationType: 6,
            placeholder: this.$t('personal.text_7') + this.$t('personal.smsAuthCode'), // 请输入短信验证码
            startTime: false,
            data: [],
            value: null
          }
        }
        if (this.userinfo.isCapitalPwordSet === 1) {
          obj.smsAuthCode = {
            title: this.$t('personal.smsAuthCode'),
            formType: 'verifiCode',
            name: 'smsAuthCode',
            operationType: 7,
            placeholder: this.$t('personal.text_7') + this.$t('personal.smsAuthCode'), // 请输入短信验证码
            startTime: false,
            data: [],
            value: null
          }
        }
      }
      // google 验证码
      if (this.userinfo.googleStatus === 1) {
        obj.googleCode = {
          title: this.$t('personal.googleCode'),
          placeholder: this.$t('personal.text_7') + this.$t('personal.googleCode'), // 请输入谷歌验证码
          formType: 'number',
          type: null,
          name: 'googleCode',
          value: null
        }
      }
      return obj
    }
  },
  methods: {
    somethings (data) {
      if (data.handleType === 'sendCode') {
        this.sendCode(data)
      }
    },
    closeDialog (e) {
      this[e] = false
      if (this.userinfo.isOpenMobileCheck === 1) {
        this.verifiFormList_obj['smsAuthCode'].startTime = false // 关闭短信验证码的倒计时
        this.verifiFormList_obj['smsAuthCode'].value = ''
      }
      if (this.userinfo.googleStatus === 1) {
        this.verifiFormList_obj['googleCode'].value = ''
      }
    },
        // 发送验证码
    something (v) {
      if (v.handleType === 'sendCode') {
        this.sendVerify(v)
      }
    },
    sendVerify (item) {
      let data = {}
      data.operationType = this.formList[item.name].operationType
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
    closeQC () {
      this.copyShow = false
    },
    // 复制链接
    copyUrl () {
      this.$refs.inviteUrl.select()
      document.execCommand('copy')
      this.$store.dispatch('setTipState', this.$t('personal.copeSuccess'))
    },
    copyCode () {
      this.copyShow = true
    },
    // 修改用户昵称
    editNickName () {
      if (!this.editNickNameStatus) {
        this.editNickNameStatus = true
        this.text.editNameBtn = this.$t('personal.confirm')
      } else {
        this.text.editNameBtn = this.$t('personal.edit')
        let newValue = this.$refs.editNickNameinput.value
        if (!newValue) {
          return false
        } else if (newValue !== this.userinfo.nickName) {
          this.axios({
            url: this.$store.state.url.personal.nickname_update,
            headers: {},
            params: {nickname: newValue},
            method: 'post'
          }).then((data) => {
            this.editNickNameStatus = false
            this.$store.dispatch('getCommonUser_info')
          })
        }
      }
    },
    // 关闭手机验证
    closeMobileVerify () {
      if (this.userinfo.googleStatus === 0) {
        this.isVerifyDialog = true
      } else {
        this.$router.push('/personal/closeMobileVerify')
      }
    },
    // 关闭谷歌验证
    closeGoogleBind () {
      if (this.userinfo.isOpenMobileCheck === 0) {
        this.isVerifyDialog = true
      } else {
        this.$router.push('/personal/googleBind')
      }
    },
    // 开启手机验证
    openMobileVerify () {
      this.isVerifyDialog = false
      this.axios({
        url: this.$store.state.url.personal.open_mobile_verify,
        headers: {},
        params: {},
        method: 'post'
      }).then((data) => {
        if (data.code.toString() === '0') {
          this.$store.dispatch('getCommonUser_info')
          this.$store.dispatch('setTipState', this.$t('personal.text_5'))
        } else {
          this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
        }
      })
    },
    historyTab (type) {
      this.historyData = []
      this.historyTabClass = type
      this.pagination.page = 1
      this.getHistoryData(1)
    },
    getHistoryData (page) {
      let ajaxUrl = this.$store.state.url.question.login_history
      if (this.historyTabClass === 'setting') {
        ajaxUrl = this.$store.state.url.question.setting_history
      }
      let data = {
        page: page,
        pageSize: 10,
        userId: this.userinfo.id
      }
      this.axios({
        url: ajaxUrl,
        headers: {},
        params: data,
        method: 'post'
      }).then((data) => {
        if (data.code.toString() === '0') {
          let dataList
          this.pagination.count = data.data.count
          if (this.historyTabClass === 'setting') {
            dataList = data.data.historySettingList
          } else {
            dataList = data.data.historyLoginList
          }
          this.historyData = dataList
        }
      })
    },

    handlelgStatus (data, type) {
      if (type === '0') {
        if (data === 1) {
          return this.$t('personal.cussess')
        } else {
          return this.$t('personal.failure')
        }
      } else {
        switch (data) {
          case 1 :
            return this.$t('personal.historySetting_01')
          case 2 :
            return this.$t('personal.historySetting_02')
          case 3 :
            return this.$t('personal.historySetting_03')
          case 4 :
            return this.$t('personal.historySetting_04')
          case 5 :
            return this.$t('personal.historySetting_05')
          case 6 :
            return this.$t('personal.historySetting_06')
        }
      }
    },
    // 翻页点击事件
    pagechange (page) {
      this.pagination.page = page
      this.getHistoryData(page)
    },
    // 开始或关闭 手续费设置
    useFeeCoin (value) {
      value = (value === 0) ? 1 : 0
      this.axios({
        url: this.$store.state.url.question.update_fee_coin_open,
        headers: {},
        params: {useFeeCoinOpen: value},
        method: 'post'
      }).then((data) => {
        if (data.code.toString() === '0') {
          if (this.useFeeCoinOpen === 1) {
            this.useFeeCoinOpen = 0
          } else {
            this.useFeeCoinOpen = 1
          }
        }
      })
    },
    // 修改登录密码
    revisePassword () {
      if (this.userinfo.googleStatus === 0 && this.userinfo.isOpenMobileCheck === 0) {
        this.isVerifyDialog = true
      } else {
        this.$router.push('/personal/revisePassword')
      }
    },
    // 绑定邮箱
    bindEmail () {
      if (this.userinfo.googleStatus === 0 && this.userinfo.isOpenMobileCheck === 0) {
        this.isVerifyDialog = true
      } else {
        this.$router.push('/personal/bindEmail')
      }
    },
    // 获取支付方式数据
    getPaymentLIst () {
      this.axios({
        url: this.$store.state.otcUrl.payment.payment_find,
        headers: {},
        params: {isOpen: ''},
        hostType: 'otc',
        method: 'post'
      }).then((data) => {
        this.paymentLIst = []
        if (data.code.toString() === '0') {
          this.paymentLIst = data.data
        }
      })
    },
    // 添加支付方式
    addPayment () {
      if (this.userinfo.isOpenMobileCheck !== 1 && this.userinfo.googleStatus !== 1) {
        this.$store.dispatch('setTipState', {text: this.$t('payments.verify_text1'), type: 'error'})
        return false
      }
      if (this.userinfo.authLevel === 1) {
        this.$router.push({path: '/personal/payment'})
      } else {
        this.$store.dispatch('setTipState', {text: this.$t('payments.verify_text2'), type: 'error'})
      }
    },
    // 开启关闭 支付方式
    paymentIsOpen (data) {
      if (data.isOpen === 0) {
        let num = 1
        this.paymentLIst.map(item => {
          if (item.isOpen === 1) {
            num += 1
          }
        })
        if (num > 3) {
          this.$store.dispatch('setTipState', {text: this.$t('payments.verify_text3'), type: 'error'})
          return false
        }
      }
      let obj = {
        id: data.id,
        isOpen: data.isOpen === 0 ? 1 : 0
      }
      data.isOpen = data.isOpen === 0 ? 1 : 0
      this.axios({
        url: this.$store.state.otcUrl.payment.payment_open,
        headers: {},
        params: obj,
        hostType: 'otc',
        method: 'post'
      }).then((data) => {
        if (data.code.toString() === '0') {
          data.isOpen = data.isOpen === 0 ? 1 : 0
        } else {
          this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
        }
      })
    },
    // 开启确认删除收款方式确认框
    confirmDelete (data, index) {
      this.deletePaymentData = data
      this.deletePaymentIndex = index
      this.verifiFormList = this.verifiFormList_obj
      this.isDeleteDialog = true
    },
    // 获取短信验证码
    sendCode (item) {
      let data = {}
      let fla = true
      let arr = this.verifiFormList_obj[item.name].data || []
      if (this.verifiFormList_obj[item.name].startTime) return false
      if (arr.length > 0) {
        arr.map((item) => {
          if (item === 'aliyunCapcha') {
            if (!this.verifiFormList_obj[item].alicapcha.token) {
              fla = false
              this.$set(this.verifiFormList_obj[item], 'errorInfo', this.$t('personal.text_6'))
            }
            data = Object.assign({}, this.verifiFormList_obj[item].alicapcha, data)
            this.verifiFormList_obj[item].alicapcha = {}
          }
        })
      }
      if (!fla) return false
      data.operationType = this.verifiFormList_obj[item.name].operationType
      this.verifiFormList_obj[item.name].startTime = true // 开启倒计时
      data.nc && data.nc.reset() // 重置滑动验证
      data.nc = null
      this.commonHttp.smsValidCode(data).then((data) => {
        if (data.code === '0') {
          this.$store.dispatch('setTipState', this.$t('personal.text_8'))
        } else {
          this.verifiFormList_obj[item.name].startTime = false // 关闭倒计时
          this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
        }
      })
    },
    // 删除 支付方式
    deletePayment (data, index) {
      let fla = true
      if (!this.deleteFla) return false
      let obj = {
        id: this.deletePaymentData.id
      }
      // 验证必填项
      for (let item in this.verifiFormList_obj) {
        if (this.verifiFormList_obj[item].value !== undefined && !this.verifiFormList_obj[item].value) {
          this.$set(this.verifiFormList_obj[item], 'errorInfo', this.$t('personal.text_7') + this.verifiFormList_obj[item].title)
          fla = false
        } else {
          obj[item] = this.verifiFormList_obj[item].value
        }
      }
      if (!fla) return false
      this.deleteFla = false
      this.axios({
        url: this.$store.state.otcUrl.payment.payment_delete,
        headers: {},
        params: obj,
        hostType: 'otc',
        method: 'post'
      }).then((data) => {
        if (data.code.toString() === '0') {
          this.isDeleteDialog = false
          if (this.userinfo.isOpenMobileCheck === 1) {
            this.verifiFormList_obj['smsAuthCode'].startTime = false // 关闭短信验证码的倒计时
            this.verifiFormList_obj['smsAuthCode'].value = ''
          }
          if (this.userinfo.googleStatus === 1) {
            this.verifiFormList_obj['googleCode'].value = ''
          }
          this.paymentLIst.splice(this.deletePaymentIndex, 1)
          this.$store.dispatch('setTipState', this.$t('payments.delete_success'))
          this.deleteFla = true
        } else {
          this.deleteFla = true
          this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
        }
      })
    },
    Admini () {
      this.$router.push({path: '/agent'})
    },
    // 资金密码
    submit () {
      // 资金密码
      let pwd = this.$refs.pwdnput.value
      // 确认密码
      let newpwd = this.$refs.newpwdinput.value
      let passwordReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z_]{8,16}$/
      let flat = true
      if (newpwd === '') {
        this.error_2 = this.$t('otc.cliphe.password_age')
        this.tips2 = false
        setTimeout(() => {
          this.error_2 = this.$t('otc.cliphe.consisting')
          this.tips2 = true
        }, 3000)
        flat = false
      }
      if (pwd === '') {
        this.error_1 = this.$t('otc.cliphe.consisting')
        this.tips1 = false
        setTimeout(() => {
          this.error_1 = this.$t('otc.cliphe.consisting')
          this.tips1 = true
        }, 3000)

        flat = false
      }
      if (pwd && newpwd) {
        if (pwd && !passwordReg.test(pwd)) {
          this.error_1 = this.$t('otc.cliphe.consisting')
          this.tips1 = false
          setTimeout(() => {
            this.error_1 = this.$t('otc.cliphe.consisting')
            this.tips1 = true
          }, 3000)
          flat = false
        }
        if (newpwd && !passwordReg.test(newpwd)) {
          this.error_2 = this.$t('otc.cliphe.consisting')
          this.tips2 = false
          setTimeout(() => {
            this.error_2 = this.$t('otc.cliphe.consisting')
            this.tips2 = true
          }, 3000)
          flat = false
        }
        // 判断两次密码
        if (this.tips2 && this.tips1) {
          if (newpwd !== pwd) {
            this.$store.dispatch('setTipState', {text: this.$t('otc.cliphe.passwords_different'), type: 'error'})
            flat = false
          }
        }
      }
      if (this.userinfo.isOpenMobileCheck !== 1 && this.userinfo.googleStatus !== 1) {
        this.$store.dispatch('setTipState', {text: this.$t('otc.cliphe.verification'), type: 'error'})
        flat = false
      }
      if (!flat) return false
      this.isShow = true
      this.pwds = pwd
    },
    // 关闭弹框
    cole () {
      this.isShow = false
      this.formList['smsAuthCode'].startTime = false
    },
    setUp () {
      this.pwd = true
      this.newpwd = true
      this.preser = true
    },
    paswd () {
      this.tips2 = true
    },
    pwdniput () {
      this.tips1 = true
    },
    confirm () {
      let data = {}
      let fla = true
      data.capitalPwd = this.pwds
      for (let item in this.formList) {
        if (!this.formList[item].value || this.formList[item].value === '') {
          this.$set(this.formList[item], 'errorInfo', this.$t('user.api.please_enter') + this.formList[item].title)
          fla = false
        }
        data[item] = this.formList[item].value
      }
      if (!fla) return false
      this.axios({
        url: this.$store.state.url.user.capital,
        headers: {},
        params: data,
        method: 'post'
      }).then((data) => {
        if (data.code.toString() === '0') {
          this.pwd = false
          this.newpwd = false
          this.preser = false
          this.isShow = false
          this.$refs.pwdnput.value = ''
          this.$refs.newpwdinput.value = ''
          this.$store.dispatch('setTipState', this.$t('otc.cliphe.successfully'))
        } else {
          this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
          this.isShow = false
        }
      })
    }
  }
}
</script>
<style>
  .inviteUrl_inp {
    position: absolute;
    top: -9999px;
    left: -9999px;
    opacity: 0;
  }
  .mobileverify-text {
    text-align: center;
    padding-top: 10px;
    font-size: 16px;
  }
</style>
