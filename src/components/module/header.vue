<template>
    <div class="m-header" :class="{head:this.$route.path === '/index'}">
        <p style="display: none" v-if="public_info"></p>
        <div class="head-bg"></div>
        <div class="header clearfix">
          <div class="logo">
            <router-link to="/" ><img :src="logo" alt=""></router-link>
          </div>
          <!-- 线上代码 -->
          <template v-if="siteType.length === 1">
            <ul class="header-ul clearfix">
              <!-- 当前是币币交易 -->
              <template v-if="siteType.indexOf('ex') !== -1">
                <li>
                  <!-- 币币交易首页 -->
                  <router-link to="/index">{{ Internationalization.home }}<span></span></router-link>
                </li>
                <li>
                  <router-link to="/trade">{{ Internationalization.currency }}<span></span></router-link>
                </li>
                <li v-if="public_info.contractOpen === '1'">
                  <!-- 合约交易首页 -->
                  <a :href="http + webSiteInfo.co_pc_url + '/contract'" target="_blank">{{ Internationalization.co }}</a>
                </li>
                <li v-if="public_info.otcOpen === '1'">
                   <!-- 场外交易 -->
                  <a :href="http + webSiteInfo.otc_pc_url + '/adsHall'" target="_blank">{{ Internationalization.transaction }}</a>
                  <!-- 挖矿 -->
                <li v-if="public_info.return_open === '1'">
                  <router-link to="/mining">{{$t('public.hd.mining')}}<span></span></router-link>
                </li>
                  <!-- 邀请-->
                <li v-if="public_info.invite_open === '1'">
                  <router-link to="/invitation">{{$t('public.hd.invitation')}}<span></span></router-link>
                </li>
              </template>
              <!-- 当前是合约交易 -->
              <template v-if="siteType.indexOf('co') !== -1">
                <li>
                  <router-link to="/contract">{{ Internationalization.co }}<span></span></router-link>
                </li>
                <li v-if="public_info.exOpen === '1'">
                  <!-- 币币交易 -->
                  <a :href="http + webSiteInfo.ex_pc_url + '/trade'" target="_blank">{{ Internationalization.currency }}<span></span></a>
                </li>
                <li v-if="public_info.otcOpen === '1'">
                   <!-- 场外交易 -->
                  <a :href="http + webSiteInfo.otc_pc_url + '/adsHall'" target="_blank">{{ Internationalization.transaction }}<span></span></a>
                </li>
              </template>
              <!-- 当前是场外交易 -->
              <template v-if="siteType.indexOf('otc') !== -1">
                <li>
                  <router-link to="/adsHall">{{ Internationalization.adcenter_def }}<span></span></router-link>
                </li>
                <li>
                  <router-link to="/BlockTrade">{{ Internationalization.adcenter_big }}<span></span></router-link>
                </li>
                <li> 
                  <router-link to="/publishAds" class="creatButton">{{ Internationalization.publish }}</router-link>
                </li>
                <li v-if="public_info.exOpen === '1'">
                  <!-- 币币交易 -->
                  <a :href="http + webSiteInfo.ex_pc_url + '/trade'" target="_blank">{{ Internationalization.currency }}<span></span></a>
                </li>
                <li v-if="public_info.contractOpen === '1'">
                  <!-- 合约交易 -->
                  <a :href="http + webSiteInfo.co_pc_url + '/contract'" target="_blank">{{ Internationalization.co }}<span></span></a>
                </li>
              </template>
            </ul>
            <ul class="header-ul clearfix" v-if="configHeaderOpen === '1'" v-html='headerTemplate'></ul>
          </template>
        <template v-else>
          <!-- 本地调试 -->
            <ul class="header-ul clearfix">
              <li>
                <router-link to="/index" >{{ Internationalization.home }}<span></span></router-link>
              </li>
              <li>|</li>
              <li v-if="public_info.exOpen === '1'">
                  <router-link to="/trade">{{ Internationalization.currency }}<span></span></router-link>
              </li>
              <!-- 挖矿 -->
              <li v-if="public_info.return_open === '1'">
                <router-link to="/mining">{{$t('public.hd.mining')}}<span></span></router-link>
              </li>
                <!-- 邀请-->
              <li v-if="public_info.invite_open === '1'">
                <router-link to="/invitation">{{$t('public.hd.invitation')}}<span></span></router-link>
              </li>
              <li>|</li>
              <li v-if="public_info.contractOpen === '1'">
                <!-- 合约交易 -->
                <router-link to="/contract">{{ Internationalization.co }}<span></span></router-link>
              </li>
              <li>|</li>
              <!-- 场外-普通交易 -->
              <li v-if="public_info.otcOpen === '1'">
                <router-link to="/adsHall">{{ Internationalization.adcenter_def }}<span></span></router-link>
              </li>
              <!-- 场外-大宗交易 -->
              <li v-if="public_info.otcOpen === '1'">
                <router-link to="/BlockTrade">{{ Internationalization.adcenter_big }}<span></span></router-link>
              </li>
              <li> 
                <router-link to="/publishAds" class="creatButton">{{ Internationalization.publish }}</router-link>
              </li>
            </ul>
            <ul class="header-ul clearfix" v-if="configHeaderOpen === '1'" v-html='headerTemplate'></ul>
          </template>
          <!-- 本地调试结束 -->
          <div class="header-right">
            <ul class="rightNav">
              <template v-if="islogin">
                <template v-if="siteType.indexOf('otc') !== -1">
                  <!-- <li class="rightNav_item"> 
                    <router-link to="/publishAds" class="creatButton">{{ Internationalization.publish }}</router-link>
                  </li> -->
                  <li class="rightNav_item"> 
                    <router-link to="/my_otc_personal"><i class=" icon-user"></i> {{ Internationalization.my }}</router-link>
                  </li>
                </template>
                <li class="rightNav_item">
                  <router-link to="/funds"> 
                    <i class="icon-money"></i>
                    <span>{{ Internationalization.capital }}</span>
                  </router-link>
                </li>
                <li class="rightNav_item">
                  <router-link to="/order">   
                    <i class="icon-order"></i>
                    <span>{{$t('public.hd.orderManage')}}</span>
                  </router-link>
                </li>
              </template>
              <li class="rightNav_item">
                <div class="personal_menu select_menu" v-if='islogin'>
                  <span class="tegther_icon">
                    <i class=" icon-user"></i>
                    <b v-if="no_read > 0"></b>
                  </span>
                  <span>{{userInfor.nickName}}</span>
                  <i class="icon-down"></i>
                  <ul>
                    <li> 
                      <router-link to="/personal"><i class=" icon-user"></i>{{$t('public.hd.userCenter')}}</router-link>
                    </li>
                    <li>
                      <router-link to="/api"><i class="icon-api"></i>{{$t('public.hd.apiManage')}}</router-link>
                    </li>
                    <li v-if="siteType.indexOf('otc') !== -1 && public_info.otcOpen === '1' ">
                      <router-link to="/application"><i class="icon-application"></i>申请商家</router-link>
                    </li>
                    <!-- <li v-if="$store.state.baseData.agentOpen === '1'">
                        <router-link  to="/agent_list"><i class="icon-user"></i>{{$t('public.hd.economic')}}</router-link>
                    </li> -->
                    <li>
                      <router-link to="/questions"><i class="icon-questuin"></i>{{$t('public.hd.ask')}}</router-link>
                    </li>
                    <li>
                      <router-link to="/mesage">
                        <span class="tegther_icon">
                          <i class="icon-info"></i>{{$t('public.hd.msgcenter')}}
                          <b v-if="no_read > 0"></b>
                        </span>
                      </router-link>
                    </li>
                    <li @click="isShowDialog = true"><i class="icon-setting"></i>{{$t('public.hd.set')}}</li>
                    <li @click="logout"><i class="icon-logout"></i>{{$t('public.hd.logout')}}</li>
                  </ul>
                </div>
                <span v-else>
                  <a  class="login" @click="login()"></a>
                  <router-link class="login" to="/login">{{ Internationalization.login }}</router-link>
                  <em>|</em>
                  <router-link class="register" to="/register">{{ Internationalization.register }}</router-link>
                </span>
              </li>
              <!-- 皮肤切换 -->
              <!-- <li class="rightNav_item">
                <a href="javascript:;" v-if="themeType === 'theme_white'" @click="changetheme('theme_default')">
                     <i class="icon-moon"></i>
                    
                </a>
                <a href="javascript:;" v-else @click="changetheme('theme_white')">
                    <i class="icon-sun"></i>
                </a>
              </li> -->
              
       <!--   <li class="rightNav_item">
                <div class="select_menu">
                  <a href="javascript:;">{{$t('main.theme')}}</a>  
                  <i class="icon-down"></i>
                  <ul class="themeList">
                    <template v-for="(item, index) in themeFormData.optionList">
                      <li :key='index' 
                        @click="changetheme(item.code)"
                        :class="{selected: themeType === item.code}">
                          {{item.value}}
                      </li>  
                    </template>
                  </ul>
                </div>
              </li> -->
              <li class="rightNav_item" :class="{right_active:appdown}" @mouseover="over" @mouseout="out" v-if="downurl.app_page_url">
                    <span>{{$t('main.app_download')}}</span>
                    <div class="qr_code" v-if="appdown">
                        <img :src="downurl.app_page_url " alt="">
                        <i>{{$t('main.sweep_download')}}</i>
                    </div>
                </li>
              <li class="rightNav_item">
                <div class="lang select_menu" @click='lanMarkShow'>
                  <span>
                    <!-- <i class="flag_icon" :class="lanId"></i> -->
                    {{ lan }}
                  </span>
                  <ul class="langMark">
                    <template v-for='(v, i) in lanList'>
                    <li :key='i' @click.stop='lanClick(v.id)'>
                      <!-- <i class="flag_icon" :class="v.id"></i> -->
                      {{ v.name }} 
                    </li>
                    </template>
                  </ul>
                  <i class="icon-down"></i>
                </div>
              </li>
              
            </ul>
          </div>
        </div>
        <el-dialog 
          :title='tiptlText' 
          :flag='isShowDialog'
          name= 'isShowDialog'
          :width='450'
          :dialogClose='closeDialog'>
          <div class="setThemePop" slot="content">
            <div class="setTheme">
              <div class="inlint-title">
                {{$t('main.theme')}}
              </div>
              <div class="radioLine">
                <span class="tadioTd">
                  <input type="radio" id="one" name="theme" value="theme_default" v-model="themeType">
                  <label for="one">{{$t('main.blueTheme')}}</label>
                </span>
                <span class="tadioTd">
                  <input type="radio" id="two" name="theme" value="theme_white" v-model="themeType">
                  <label for="two">{{$t('main.whiteTheme')}}</label>
                </span>
                <span class="tadioTd">
                  <input type="radio" id="two" name="theme" value="theme_black" v-model="themeType">
                  <label for="two">{{$t('main.blackTheme')}}</label>
                </span>
              </div>    
            </div>
          </div>
          <div slot="options">
              <button @click="setTheme">{{$t('trade.confirm')}}</button>
          </div>
        </el-dialog >
    </div>
</template>
<script>
import { mapState } from 'vuex'
import { changeLanguage } from '@/locale'
import changeTheme from '../../utils/changeTheme.js'
import elDialog from '@/components/common/dialog'
import InlineInput from '@/components/common/inlineInput'
export default {
  name: 'm-header',
  components: {elDialog, InlineInput},
  data () {
    return {
      islogin: false,
      isShowDialog: false,
      userInfor: null,
      lanList: [],
      lan: '',
      lanId: '',
      lanMarkFlag: false,
      no_read: '',
      logo: null,
      host: this.$store.state.baseData._webSiteInfo,
      otcSubLink: false,
      legalTender: {},
      themeForm: {},
      themeType: localStorage.getItem('theme-type'),
      rate: null,
      otcOpen: null,
      coOpen: null,
      siteType: [],
      webSiteInfo: null,
      logoutFla: true,
      http: location.protocol + '//',
      appdown: false,
      downurl: '',
      configHeaderOpen: true,
      headerTemplate: null

    }
  },
  mounted () {
    this.legalTender = this.legalTenderFormObj
    this.themeForm = this.themeFormData
    this.getApp()
  },
  computed: {
    ...mapState({
      public_info ({baseData}) {
        if (baseData._lanList) {
          this.lanList = baseData._lanList
          this.islogin = baseData.isLogin
          this.logo = baseData.logo
          this.userInfor = baseData._user
          this.rate = baseData._rate
          this.otcOpen = baseData.otcOpen
          this.coOpen = baseData.contractOpen
          this.siteType = baseData._siteType
          this.webSiteInfo = baseData._webSiteInfo
          this.configHeaderOpen = baseData._data.config_header_open
          this.headerTemplate = baseData.headerTemplate
          baseData._lanList.forEach(element => {
            if (element.id === baseData._lan) {
              this.lan = element.name
              this.lanId = element.id
            }
          })
          return baseData
        } else {
          return false
        }
      }

    }),
    legalTenderFormObj () {
      return {
        title: this.$t('main.fbdw'),
        formType: 'select',
        placeholder: this.$t('personal.placeholder_2'),
        name: 'legalTender',
        value: '1',
        optionList: [
          {value: '$ USD', code: '1'},
          {value: '￥CNY', code: '2'},
          {value: '₩ KRW', code: '3'}
        ]
      }
    },
    themeFormData () {
      return {
        title: this.$t('main.theme'),
        formType: 'select',
        placeholder: '',
        name: 'themeFormData',
        value: this.themeType,
        optionList: [
          {value: this.$t('main.blueTheme'), code: 'theme_default'},
          {value: this.$t('main.whiteTheme'), code: 'theme_white'},
          {value: this.$t('main.blackTheme'), code: 'theme_black'}
        ]
      }
    },
    tiptlText () {
      return this.$t('public.hd.set')
    },
    // 国际化
    Internationalization () {
      return {
        login: this.$t('public.hd.login'), // 登陆
        register: this.$t('public.hd.register'), // 注册
        co: this.$t('public.hd.co'), // 合约交易
        coCenter: this.$t('public.hd.coCenter'), // 合约大厅
        capital: this.$t('public.hd.capital'), // 资金管理
        transaction: this.$t('public.hd.transaction'), // 场外交易
        currency: this.$t('public.hd.currency'), // 币币交易
        currencyMall: this.$t('public.hd.currencyMall'), // 币币交易大厅
        home: this.$t('public.hd.home'), // 首页
        my: this.$t('otc.index.my'), // 我的
        publish: this.$t('otc.index.publish'), // '发布广告',
        adcenter_def: this.$t('public.hd.adcenter_def'), // '普通交易',
        adcenter_big: this.$t('public.hd.adcenter_big'), // '大宗交易',
        msgcenter: this.$t('public.hd.msgcenter'), // '消息中心',
        set: this.$t('public.hd.set') // '设置',
      }
    }
  },
  watch: {
    'legalTenderFormObj' (val) {
      this.legalTender = val
    },
    '$store.state.mesage.mesg' (val) {
      this.getRead()
    },
    'public_info.isLogin' (val) {
      let that = this
      if (val === true) {
        this.getRead()
        setInterval(function () {
          that.getRead()
        }, 30000)
      }
    }
  },
  methods: {
    gotoEx () {
      window.location.href = location.protocol + '//' + this.webSiteInfo.ex_pc_url + '/trade'
    },
    gotoHall () {
      window.location.href = location.protocol + '//' + this.webSiteInfo.otc_pc_url + '/adsHall'
    },
    gotopublish () {
      window.location.href = location.protocol + '//' + this.webSiteInfo.otc_pc_url + '/publishAds'
    },
    // input组件 返回事件
    somethings (data) {
      if (data.handleType === 'selected' && data.name === 'themeFormData') {
        this.themeType = data.value.code
      }
      if (data.handleType === 'selected' && data.name === 'legalTender') {
        this.selected(data)
      }
    },
    // 选择
    selected (data) {
      this.$forceUpdate(() => {
        this.legalTender.value = data.value.code
      })
    },
    setTheme () {
      changeTheme(this.themeType)
      localStorage.setItem('theme-type', this.themeType)
      this.$store.commit('THEME', this.themeType)
      this.isShowDialog = false
    },
    changetheme (type) {
      changeTheme(type)
      localStorage.setItem('theme-type', type)
      this.themeType = type
      this.$store.commit('THEME', type)
    },
    // 关闭弹窗
    closeDialog (e) {
      this[e] = false
    },
    // 跳转至移动端

    goMobile () {
      window.open(location.protocol + '//' + window.HOST_API.h5_url)
    },
    getUid (isOpen) {
      if (isOpen === 0) {
        window.location.href = location.protocol + '//' + this.webSiteInfo.otc_pc_url + '/otc_personal'
      } else {
        location.pathname.indexOf('otc_personal') > -1 && window.location.reload()
        this.$router.push('/otc_personal')
      }
    },
    swithchotcSubLink () {
      this.otcSubLink && (this.otcSubLink = false)
      !this.otcSubLink && (this.otcSubLink = true)
    },
    login () {
      this.$router.push({ name: 'login' })
    },
    regs () {
      this.$router.push({ name: 'register' })
    },
    // 退出登录
    logout () {
      if (!this.logoutFla) return false
      this.logoutFla = false
      this.axios({
        url: this.$store.state.url.user.login_out,
        headers: {},
        params: {},
        method: 'post'
      }).then((data) => {
        if (data.code === '0') {
          this.$store.commit('ISLOGIN', false)
          this.logoutFla = true
        } else {
          this.logoutFla = true
          this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
        }
      })
    },
    message () {
      this.$router.push({ name: 'mesage' })
    },
    // 切换语言
    lanClick (lan) {
      if (this.islogin) {
        this.axios({
          url: this.$store.state.url.common.language,
          headers: {},
          params: {language: lan},
          method: 'post'
        }).then((data) => {
          if (data.code === '0') {
            localStorage.lan = lan
            this._COOKIE.setCookie('lan', lan)
            this.$store.commit('LAN', lan)
            this.public_info._lanList.forEach(element => {
              if (element.id === lan) {
                this.lan = element.name
                this.lanId = lan
              }
            })
            changeLanguage(lan)
            this.lanMarkFlag = false
          } else {
            this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
          }
        })
      } else {
        localStorage.lan = lan
        this._COOKIE.setCookie('lan', lan)
        this.$store.commit('LAN', lan)
        this.public_info._lanList.forEach(element => {
          if (element.id === lan) {
            this.lan = element.name
            this.lanId = lan
          }
        })
        changeLanguage(lan)
        this.lanMarkFlag = false
      }
    },
    lanMarkShow () {
      this.lanMarkFlag = true
    },
    getRead () {
      this.axios({
        url: this.$store.state.url.mesage.message_count,
        headers: {},
        params: {},
        method: 'post'
      }).then((data) => {
        if (data.code === '0') {
          this.no_read = data.data.noReadMsgCount
        }
      })
    },
    over () {
      this.appdown = true
    },
    out () {
      this.appdown = false
    },
    getApp () {
      this.axios({
        url: this.$store.state.url.common.download,
        headers: {},
        params: {},
        method: 'post'
      }).then((data) => {
        if (data.code === '0') {
          this.downurl = data.data
        }
      })
    }
  }
}
</script>
<style>
  .head{
    position: absolute!important;
    left: 0;
    top: 0;
    height: 71px;
    width: 100%;
  }
  .m-header {
    display: none;
  }
  .head .head-bg{
     opacity:0.3
  }
</style>
 




