<template>
	<div class="funds">
		
		<div class="funds-main">
				<!-- <div class="funds-aside">
		 			<div class="funds-aside-list">
		 				<router-link to="/funds/funds_manage"><i class="icon-account"></i>{{Internationalization.funds_manage}}</router-link>
		 				<router-link to="/funds/finance_manage"><i class="icon-trade "></i>{{Internationalization.finance_manage}}</router-link>
		 				<router-link to="/funds/address_manage"  class="asideActive"><i class="icon-address"></i>{{Internationalization.address_manage}}</router-link>
		 			</div>
	 		 </div> -->
	 	<funds-aside></funds-aside>
	 	<div class="funds-content">
		<!--头部nav-->
		<div class="address-manage-top">
			<ul class="address-manage-nav">
				<li @click="accountTab()" class="fundActive">{{Internationalization.digital_money}}</li>
			</ul>
			<button class="addbutton" @click="addAddress">{{Internationalization.new_addr}}</button>
			<div class="coinlist">
				<inline-input 
	              v-bind:property = "coinList.coinList"
	              v-model = "coinList.coinList.value"
	              v-on:onevents = "somethings"> 
	       </inline-input>
      </div>
		</div>
		<!--地址列表-->
		<div class="address-transaction-acc">
			<div>
			  <div v-if="showLoading">
					<div class="loading">
						<loading-model></loading-model>
					</div>
				</div>
				<div v-else>
					<table >
						<template v-if="financeTabClass === 'addressList'">
							<tr>
								<th>{{Internationalization.symbol}}</th>
								<th>{{Internationalization.label}}</th>
								<th>{{Internationalization.withdraw_addr}}</th>
								<th>{{Internationalization.opera}}</th>
							</tr>
							<template v-for="(item, key) in addressList">
								<tr>
									<td>{{item.symbol}}</td>
									<td>{{item.label}}</td>
									<td>{{item.address}}</td>
									<td><a href="javascript:void(0)" @click="deleteAddress(item)">{{Internationalization.delete}}</a></td>
								</tr>
							</template>
							<tr v-if="addressList.length <= 0" >
									<td colspan="6" class="noMessage">{{Internationalization.noAddress}}<a @click="addAddress">{{Internationalization.new_addr}}</a>{{Internationalization.goAdd}}</td>
								</tr>
						</template>
					</table>
			  </div>
			</div>
		</div>
		<!--安全设置-->
		<el-dialog 
      :title='Internationalization.notice'
      :flag='goRealnameDialog'
      name= 'goRealnameDialog'
      :width='450'
      :dialogClose='closeDialog'>
      <div class="mobileverify-text" slot="content">{{Internationalization.firstGoRealname}}</div>
      <div slot="options">
        <button @click="closeDialog('goRealnameDialog')">{{Internationalization.cancel}}</button>
        <button @click="goRealname()">{{Internationalization.goRealname}}</button>
      </div>
    </el-dialog >
    <el-dialog 
      :title='Internationalization.notice'
      :flag='setSafetyDialog'
      name= 'setSafetyDialog'
      :width='450'
      :dialogClose='closeDialog'>
      <div class="mobileverify-text" slot="content">{{Internationalization.needVerify}}</div>
      <div slot="options">
        <button @click="closeDialog('setSafetyDialog')">{{Internationalization.cancel}}</button>
        <button @click="setSafety()">{{Internationalization.setSafety}}</button>
      </div>
    </el-dialog >
		<!--新增地址弹窗-->
		<el-dialog 
      :title='Internationalization.new_addAddr'
      :flag='addShow'
      name= 'addShow'
      :width='450'
      :dialogClose='closeDialog'>
      <div slot="content">
      	<ul class="transfer-list">
						<li class="warn-txt"><i class="icon-alert"></i>{{Internationalization.address_notice}}</li>
							<!-- <template v-for="(item,key,index) in formData"> -->
								<li>
				          <inline-input 
				              v-bind:property = "formData.coinSymbol"
				              v-model = "formData.coinSymbol.value"
				              v-on:onevents = "somethings">
				          </inline-input>
			          </li>
                <li>
				          <inline-input 
				              v-bind:property = "formData.address"
				              v-model = "formData.address.value"
				              v-on:onevents = "somethings">
				          </inline-input>
			          </li>
                <li v-if="base === 'XRP' || base === 'EOS' || coin === 'XRP' || coin === 'EOS' " class="label-note">
                  <i  class="icon-questuin addnote-icon" @mouseenter="enter()" @mouseleave="leave()"></i>
                  <p v-if="label" class="addnote-con">{{ $t('fund.labelNote') }}</p>
				          <inline-input 
				              v-bind:property = "xrpNumber.numberId"
				              v-model = "xrpNumber.numberId.value"
				              v-on:onevents = "somethings">
				          </inline-input>
			          </li>
                <li>
				          <inline-input 
				              v-bind:property = "formData.label"
				              v-model = "formData.label.value"
				              v-on:onevents = "somethings">
				          </inline-input>
			          </li>
	           <!-- </template>    -->
							<template v-for="(item,key,index) in formList">
								<li>
				          <inline-input 
				              v-bind:property = "item"
				              v-model = "item.value"
				              v-on:onevents = "somethings"> 
				          </inline-input>
		            </li>	         
        	  </template>
				</ul>
      </div>
      <div slot="options">
        <button @click="closeDialog">{{Internationalization.cancel}}</button>
        <button @click="confirmAdd">{{Internationalization.confirm}}</button>
      </div>
    </el-dialog >
		<!--<div class="remindDiv" v-if="addShowa" >
			<div class="funds-transfer">
				<div class="title">
					<a href="javascript:void(0)" class="close" @click="closeDialog">╳</a>
					<h6>{{Internationalization.new_addAddr}}</h6>
				</div>
				<ul class="transfer-list">
						<li class="warn-txt"><i class="icon-alert"></i>{{Internationalization.address_notice}}</li>
							<template v-for="(item,key,index) in formData">
								<li>
				          <inline-input 
				              v-bind:property = "item"
				              v-model = "item.value"
				              v-on:onevents = "somethings">
				          </inline-input>
			          </li>
	           </template>   
							<template v-for="(item,key,index) in formList">
								<li>
				          <inline-input 
				              v-bind:property = "item"
				              v-model = "item.value"
				              v-on:onevents = "somethings"> 
				          </inline-input>
		            </li>	         
        	   </template>
						<li class="last"><button class="cancel" @click="closeDialog">{{Internationalization.cancel}}</button><button class="confirm" @click="confirmAdd">{{Internationalization.confirm}}</button></li>
				</ul>
			</div>
		</div>-->
		<!--删除地址-->
		<el-dialog 
      :title='Internationalization.confirm_delete'
      :flag='delShow'
      name= 'delShow'
      :width='450'
      :dialogClose='closeDialog'>
      <div slot="content">
      	<ul class="infor-list">
					<li class="confirm-del-add">{{Internationalization.confirm_deleteAddr}}</li>
					<template v-for="(item,key,index) in formList">
						<li>
		          <inline-input 
		              v-bind:property = "item"
		              v-model = "item.value"
		              v-on:onevents = "somethings"> 
		          </inline-input>
	          </li>
          </template>
					<li class="warn-txt"><i class="icon-alert"></i>{{Internationalization.delete_notice}}</li>
				</ul>
      </div>
      <div slot="options">
        <button @click="closeDialog">{{Internationalization.cancel}}</button>
        <button @click="confirmDel">{{Internationalization.confirm}}</button>
      </div>
    </el-dialog >
		<!--<div class="remindDiv" v-if="delShowa"  >
			<div class="confirm-withdraw">
				<div class="title">
					<a href="javascript:void(0)" class="close" @click="closeDialog">╳</a>
					<h6>{{Internationalization.confirm_delete}}</h6>
				</div>
				<ul class="infor-list">
					<li class="confirm-del-add">{{Internationalization.confirm_deleteAddr}}</li>
					<template v-for="(item,key,index) in formList">
						<li>
		          <inline-input 
		              v-bind:property = "item"
		              v-model = "item.value"
		              v-on:onevents = "somethings"> 
		          </inline-input>
	          </li>
          </template>
					<li class="warn-txt"><i class="icon-alert"></i>{{Internationalization.delete_notice}}</li>
					<li class="last">
						<button class="cancel" @click="closeDialog">{{Internationalization.cancel}}</button>
						<button class="confirm" @click="confirmDel">{{Internationalization.confirm}}</button>
					</li>
				</ul>
			</div>
		</div>-->
	
	</div>
		</div>
	</div>
		
</template>
<script>
import fundsAside from './funds_aside'
import { mapState } from 'vuex'
import elDialog from '@/components/common/dialog'
import VPagination from '@/components/common/pagination'
import InlineInput from '@/components/common/inlineInput'
import loadingModel from '@/components/common/loadingModel'
export default {
  name: 'address-manage-content',
  data () {
    return {
      financeTabClass: 'addressList',
      addressList: [],
      formList: {},
      formData: {},
      xrpNumber: {},
      coinList: {},
      addShow: false,
      delShow: false,
      addressID: null,
      setSafetyDialog: false,
      goRealnameDialog: false,
      error: '',
      type: null,
      showLoading: false,
      ajaxUrl: null,
      data: {},
      coin: null,
      secondClick: true,
      base: null,
      label: false
    }
  },
  components: {
    elDialog, VPagination, InlineInput, loadingModel, fundsAside
  },
  created () {
    this.accountTab()
    this.formList = this.formList_obj
    this.formData = this.formData_obj
    this.xrpNumber = this.xrpNumber_obj
    this.coinList = this.coinList_obj
    if (this.$route.query.type) {
      let coinSymbol = this.$route.query.type
      if (this.coinlist[coinSymbol].tokenBase) {
        if (this.coinlist[coinSymbol].tokenBase === 'EOS') {
          this.base = 'EOS'
        } else if (this.coinlist[coinSymbol].tokenBase === 'XRP') {
          this.base = 'XRP'
        } else {
          this.base = 'other'
        }
      }
      // if (this.coinList[this.$route.query.type].name === 'ETH') {
      //   alert('aaa')
      // }
      this.coin = this.$route.query.type
      this.addShow = true
      this.formData.coinSymbol.value = this.$route.query.type
      if (this.userinfo.isOpenMobileCheck === 1) {
        this.formList['smsValidCode'].operationType = 11
      }
    }
  },
  computed: {
    ...mapState({
      userinfo ({baseData: {_user}}) {
        return _user || false
      },
      coinlist ({baseData: {_coinList}}) {
        return _coinList || false
      }
    }),
    formList_obj () {
      let obj = {}
      if (this.userinfo.isOpenMobileCheck === 1) {
        Object.assign(obj, {
          smsValidCode: {
            title: this.Internationalization.smsAuthCode,
            placeholder: this.Internationalization.smsAuthCode,
            formType: 'verifiCode',
            name: 'smsValidCode',
            operationType: null,
            startTime: false,
            data: [],
            value: null
          }
        })
      }
      if (this.userinfo.googleStatus === 1) {
        Object.assign(obj, {
          googleCode: {
            title: this.Internationalization.googleCode,
            placeholder: this.Internationalization.googleCode,
            formType: 'number',
            type: null,
            name: 'googleCode',
            value: null
          }
        })
      }
      return obj
    },
    formData_obj () {
      let list = []
      for (let i in this.coinlist) {
        let obj = {value: this.coinlist[i].name, code: this.coinlist[i].name}
        list.push(obj)
      }
      return {
        coinSymbol: {
          title: this.Internationalization.symbol,
          placeholder: this.Internationalization.changesymbol,
          formType: 'select',
          name: 'coinSymbol',
          value: '',
          optionList: list
        },
        address: {
          title: this.Internationalization.withdraw_addr,
          placeholder: this.Internationalization.InputWithdrawAddr,
          formType: 'text',
          name: 'address',
          value: ''
        },
        label: {
          title: this.Internationalization.label,
          placeholder: this.Internationalization.InputAddrLabel,
          formType: 'text',
          name: 'label',
          value: ''
        }
      }
    },
    coinList_obj () {
      let list = [
        {value: this.Internationalization.allsymbol, code: ''}
      ]
      for (let i in this.coinlist) {
        let obj = {value: this.coinlist[i].name, code: this.coinlist[i].name}
        list.push(obj)
      }
      return {
        coinList: {
          title: '',
          placeholder: this.Internationalization.changesymbol,
          formType: 'select',
          name: 'coinList',
          value: '',
          optionList: list
        }
      }
    },
    xrpNumber_obj () {
      return {
        numberId: {
          title: this.Internationalization.numberID,
          placeholder: this.Internationalization.pleaseInputNumber,
          formType: 'text',
          name: 'numberId',
          value: ''
        }
      }
    },
    // 国际化
    Internationalization () {
      return {
        funds_manage: this.$t('fund.funds_manage'), // 资金管理
        finance_manage: this.$t('fund.finance_manage'), // 资金流水
        address_manage: this.$t('fund.address_manage'), // 地址管理
        symbol: this.$t('fund.symbol'), // 币种
        total: this.$t('fund.total'), // 总额
        opera: this.$t('fund.opera'), // 操作
        add_addr: this.$t('fund.funds.add_addr'), // 添加地址
        withdraw_addr: this.$t('fund.funds.withdraw_addr'), // 提币地址
        changeWithdrawAddr: this.$t('fund.funds.changeWithdrawAddr'), // 请选择提币地址
        submit: this.$t('fund.funds.submit'), // 提交
        notice: this.$t('fund.notice'), // 提示
        firstGoRealname: this.$t('fund.firstGoRealname'), // 请先进行实名验证
        cancel: this.$t('fund.cancel'), // 取消
        confirm: this.$t('fund.confirm'), // 确认
        goRealname: this.$t('fund.goRealname'), // 去实名
        needVerify: this.$t('fund.needVerify'), // 手机谷歌验证至少需要一个
        setSafety: this.$t('fund.setSafety'), // 去验证
        smsAuthCode: this.$t('fund.smsAuthCode'), // 手机验证码
        googleCode: this.$t('fund.googleCode'), // 谷歌验证码
        passCode: this.$t('fund.passCode'), // 验证码已发送
        inputRightWithdraw: this.$t('fund.funds.inputRightWithdraw'), // 请输入正确的提现金额
        inputRightFee: this.$t('fund.funds.inputRightFee'), // 请输入正确的手续费
        inputRight: this.$t('fund.funds.inputRight'), // 请输入正确的
        amount: this.$t('fund.amount'), // 数量
        status: this.$t('fund.status'), // 状态
        label: this.$t('fund.finance.label'), // 钱包标签
        type: this.$t('fund.type'), // 类型
        time: this.$t('fund.time'), // 时间
        allsymbol: this.$t('fund.allsymbol'), // 全部币种
        changeType: this.$t('fund.finance.changeType'), // 请选择类型
        changesymbol: this.$t('fund.finance.changesymbol'), // 请选择币种
        digital_money: this.$t('fund.address.digital_money'), // 数字货币
        new_addr: this.$t('fund.address.new_addr'), // 新增地址
        delete: this.$t('fund.delete'), // 删除
        new_addAddr: this.$t('fund.address.new_addAddr'), // 新增提币地址
        address_notice: this.$t('fund.address.address_notice'), // 错误的地址会导致您的资产丢失，请务必确认输入无误。
        confirm_delete: this.$t('fund.address.confirm_delete'), // 确认删除地址
        confirm_deleteAddr: this.$t('fund.address.confirm_deleteAddr'), // 确认删除该提币地址？
        delete_notice: this.$t('fund.address.delete_notice'), // 删除地址会保留之前的提现记录。
        InputWithdrawAddr: this.$t('fund.address.InputWithdrawAddr'), // 请输入提币地址。
        InputAddrLabel: this.$t('fund.address.InputAddrLabel'), // 请输入地址标签。
        pleaseInput: this.$t('fund.address.pleaseInput'), // 请输入
        addSuccess: this.$t('fund.address.addSuccess'), // 新增成功
        deleteSuccess: this.$t('fund.address.deleteSuccess'), // 删除成功
        noAddress: this.$t('fund.address.noAddress'), // 您还没有地址
        goAdd: this.$t('fund.address.goAdd'), // 进行添加
        numberID: this.$t('fund.numberID'), // 数字ID
        pleaseInputNumber: this.$t('fund.pleaseInputNumber') // 请输入数字ID
      }
    }
  },
  watch: {
    'userinfo' () {
      this.formList = this.formList_obj
    },
    'formList_obj' (val) {
      this.formList = val
    },
    'formData_obj' (val) {
      console.log(123, val)
      this.formData = val
    },
    'coinList_obj' (val) {
      this.coinList = val
    },
    'xrpNumber_obj' (val) {
      this.xrpNumber = val
    }
  },
  methods: {
    somethings (value) {
      if (value.handleType === 'sendCode') {
        this.sendCode(value)
      }
      if (value.name === 'coinList') {
        this.accountTab(value.value.code)
      }
      if (value.name === 'coinSymbol') {
        if (this.coinlist[value.value.value].tokenBase) {
          if (this.coinlist[value.value.value].tokenBase === 'EOS') {
            this.base = 'EOS'
          } else if (this.coinlist[value.value.value].tokenBase === 'XRP') {
            this.base = 'XRP'
          } else {
            this.base = 'other'
          }
        }
        this.coin = value.value.value
        this.formData.address.value = null
        this.formData.label.value = null
        this.xrpNumber.numberId.value = null
        if (this.userinfo.googleStatus === 1) {
          this.formList.googleCode.value = null
        }
        if (this.userinfo.isOpenMobileCheck === 1) {
          this.formList.smsValidCode.value = null
          this.formList.smsValidCode.startTime = false
        }
      }
    },
    sendCode (item) {
      let data = {}
      if (this.formList[item.name].startTime) return false
      data.operationType = this.formList[item.name].operationType
      this.formList[item.name].startTime = true // 开启倒计时
      this.commonHttp.smsValidCode(data).then((data) => {
        if (data.code === '0') {
          this.$store.dispatch('setTipState', this.Internationalization.passCode)
        } else {
          this.formList.smsValidCode.startTime = false  // 关闭倒计时
          this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
        }
      })
    },
    accountTab (coin) {
      let _this = this
      this.showLoading = true
      this.ajaxUrl = this.$store.state.url.fund.address_list
      this.data = {
        coinSymbol: coin
      }
      setTimeout(function () {
        _this.getList()
      }, 300)
    },
    // 获取地址列表
    getList () {
      this.axios({
        url: this.ajaxUrl,
        headers: {},
        params: this.data,
        method: 'post'
      }).then((data) => {
        if (data.code === '0') {
          this.showLoading = false
          this.addressList = data.data.addressList
          for (let item in this.addressList) {
            let symbol = this.addressList[item].symbol
            if (this.coinlist[symbol].tokenBase) {
              if (this.coinlist[symbol].tokenBase === 'XRP' || this.coinlist[symbol].tokenBase === 'EOS') {
                let arr = this.addressList[item].address.split('_')
                this.addressList[item].address = arr[0] + '(' + arr[1] + ')'
              }
            } else {
              if (symbol === 'XRP' || symbol === 'EOS') {
                let arr = this.addressList[item].address.split('_')
                this.addressList[item].address = arr[0] + '(' + arr[1] + ')'
              }
            }
          }
        } else {
          this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
        }
      })
    },
    // 添加地址
    addAddress () {
      if (this.userinfo.isOpenMobileCheck !== 1 && this.userinfo.googleStatus !== 1) {
        this.setSafetyDialog = true
        return
      }
      if (this.userinfo.isOpenMobileCheck === 1) {
        this.formList['smsValidCode'].operationType = 11
      }
      this.addShow = true
      this.coin = ''
      for (let item in this.formData) {
        this.$set(this.formData[item], 'errorInfo', '')
      }
      for (let item in this.xrpNumber) {
        this.$set(this.xrpNumber[item], 'errorInfo', '')
      }
      for (let item in this.formList) {
        this.$set(this.formList[item], 'errorInfo', '')
      }
    },
    // 删除地址
    deleteAddress (data) {
      if (this.userinfo.isOpenMobileCheck !== 1 && this.userinfo.googleStatus !== 1) {
        this.setSafetyDialog = true
        return
      }
      if (this.userinfo.isOpenMobileCheck === 1) {
        this.formList['smsValidCode'].operationType = 21
      }
      this.delShow = true
      this.addressID = data.id
      for (let item in this.formList) {
        this.$set(this.formList[item], 'errorInfo', '')
      }
    },
    // 关闭弹窗
    closeDialog (e) {
      this.goRealnameDialog = false
      this.setSafetyDialog = false
      this.addShow = false
      this.delShow = false
      this.formData.coinSymbol.value = null
      this.formData.address.value = null
      this.formData.label.value = null
      this.xrpNumber.numberId.value = null
      if (this.userinfo.googleStatus === 1) {
        this.formList.googleCode.value = null
      }
      if (this.userinfo.isOpenMobileCheck === 1) {
        this.formList.smsValidCode.value = null
        this.formList.smsValidCode.startTime = false
      }
    },
    // 实名验证
    goRealname () {
      if (this.userinfo.authLevel === 3) {
        this.$router.push('/personal/infoAttestation')
      }
      if (this.userinfo.authLevel === 2 || this.userinfo.authLevel === 0) {
        this.$router.push('/personal')
      }
    },
    // 安全设置
    setSafety () {
      this.$router.push('/personal')
    },
    // 确认添加
    confirmAdd () {
      let data = {}
      let fla = true
      for (let item in this.formData) {
        if (this.formData[item].value !== undefined && !this.formData[item].value) {
          this.$set(this.formData[item], 'errorInfo', this.Internationalization.pleaseInput + this.formData[item].title)
          fla = false
        } else {
          data[item] = this.formData[item].value
        }
      }
      if (this.base === 'XRP' || this.base === 'EOS' || this.coin === 'XRP' || this.coin === 'EOS') {
        for (let item in this.xrpNumber) {
          if (this.xrpNumber[item].value !== undefined && !this.xrpNumber[item].value) {
            this.$set(this.xrpNumber[item], 'errorInfo', this.Internationalization.pleaseInput + this.xrpNumber[item].title)
            fla = false
          } else {
            data.address = data.address + '_' + this.xrpNumber[item].value
          }
        }
      }
      for (let item in this.formList) {
        if (this.formList[item].value !== undefined && !this.formList[item].value) {
          this.$set(this.formList[item], 'errorInfo', this.Internationalization.pleaseInput + this.formList[item].title)
          fla = false
        } else {
          data[item] = this.formList[item].value
        }
      }
      if (!fla) return false
      if (!this.secondClick) return false
      this.secondClick = false
      this.axios({
        url: this.$store.state.url.fund.add_withdraw_addr,
        headers: {},
        params: data,
        method: 'post'
      }).then((data) => {
        if (data.code === '0') {
          this.addShow = false
          this.secondClick = true
          this.$store.dispatch('setTipState', this.Internationalization.addSuccess)
          this.formData.coinSymbol.value = null
          this.formData.address.value = null
          this.formData.label.value = null
          this.xrpNumber.numberId.value = null
          this.accountTab()
          if (this.userinfo.googleStatus === 1) {
            this.formList.googleCode.value = null
          }
          if (this.userinfo.isOpenMobileCheck === 1) {
            this.formList.smsValidCode.value = null
            this.formList.smsValidCode.startTime = false
          }
        } else {
          this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
          this.secondClick = true
        }
      })
    },
    // 确认删除
    confirmDel () {
      this.operationType = 21
      let data = {
        'ids': [this.addressID]
      }
      let fla = true
      for (let item in this.formList) {
        if (this.formList[item].value !== undefined && !this.formList[item].value) {
          this.$set(this.formList[item], 'errorInfo', this.Internationalization.pleaseInput + this.formList[item].title)
          fla = false
        } else {
          data[item] = this.formList[item].value
        }
      }
      if (!fla) return false
      this.axios({
        url: this.$store.state.url.fund.delete_withdraw_addr,
        headers: {},
        params: data,
        method: 'post'
      }).then((data) => {
        if (data.code === '0') {
          this.delShow = false
          this.$store.dispatch('setTipState', this.Internationalization.deleteSuccess)
          this.formData.coinSymbol.value = null
          this.formData.address.value = null
          this.formData.label.value = null
          this.formData.numberId.value = null
          this.accountTab()
          if (this.userinfo.googleStatus === 1) {
            this.formList.googleCode.value = null
          }
          if (this.userinfo.isOpenMobileCheck === 1) {
            this.formList.smsValidCode.value = null
            this.formList.smsValidCode.startTime = false
          }
        } else {
          this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
        }
      })
    },
    // 标签介绍
    enter () {
      this.label = true
    },
    leave () {
      this.label = false
    }
  }
}
</script>

<style scoped>
</style>