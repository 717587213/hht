<template>
	<div class="funds">
    <p style="display: none">{{lan}}</p>
		<div class="funds-main">
			<!-- <div class="funds-aside">
		 			<div class="funds-aside-list">
		 				<router-link to="/funds/funds_manage" ><i class="icon-account"></i>{{Internationalization.funds_manage}}</router-link>
		 				<router-link to="/funds/finance_manage" class="asideActive"><i class="icon-trade "></i>{{Internationalization.finance_manage}}</router-link>
		 				<router-link to="/funds/address_manage" ><i class="icon-address"></i>{{Internationalization.address_manage}}</router-link>
		 			</div>
	 		 </div> -->
       <funds-aside></funds-aside>
	 		 <div class="funds-content">
			<div class="finance-manage-top">
				<ul class="finance-manage-nav">
          <!-- 充值 -->
					<li @click="accountTab('depositList')" :class="financeTabClass === 'depositList' ? 'fundActive' : ''">{{Internationalization.deposit}}</li>
					<!-- 提现 -->
          <li @click="accountTab('withdrawList')" :class="financeTabClass === 'withdrawList' ? 'fundActive' : ''">{{Internationalization.withdraw}}</li>
					<!-- 场外划转 -->
          <li  v-if="otcOpen === '1'" @click="accountTab('transferList')" :class="financeTabClass === 'transferList' ? 'fundActive' : ''">{{ $t('co.finance.otc') }}{{Internationalization.transferList}}</li>
          <!-- 合约划转 -->
          <!-- <li  v-if="coOpen === '1'" @click="accountTab('coList')" :class="financeTabClass === 'coList' ? 'fundActive' : ''">{{ $t('co.finance.co') }}{{Internationalization.transferList}}</li> -->
					<!-- 其他 -->
          <li @click="accountTab('othertransferList')" :class="financeTabClass === 'othertransferList' ? 'fundActive' : ''">{{Internationalization.otherList}}</li>
				</ul>
				<div class="listFilter">
          <!-- 充值 提现 其他 -- 选择币种 -->
					 <inline-input 
					 	  v-if = "financeTabClass === 'depositList' || financeTabClass === 'withdrawList' || financeTabClass === 'othertransferList'"
              v-bind:property = "formList.coinList"
              v-model = "formList.coinList.value"
              v-on:onevents = "somethings"> 
          </inline-input>
          <!-- 场外 -- 选择币种 -->
          <inline-input 
          	  v-if = "financeTabClass === 'transferList'" 
              v-bind:property = "formList.otcCoinList"
              v-model = "formList.otcCoinList.value"
              v-on:onevents = "somethings"> 
          </inline-input>
           <!-- 场外 -- 选择类型 -->
          <inline-input 
          	  v-if = "financeTabClass === 'transferList'"
              v-bind:property = "formList.transferType"
              v-model = "formList.transferType.value"
              v-on:onevents = "somethings"> 
          </inline-input>
          <!-- 合约 -- 选择币种 -->
          <inline-input 
          	  v-if = "financeTabClass === 'coList'"
              v-bind:property = "formList.coCoinList"
              v-on:onevents = "somethings"
              v-model = "formList.coCoinList.value"> 
          </inline-input>
          <!-- 合约 -- 选择类型 -->
          <inline-input 
          	  v-if = "financeTabClass === 'coList'" 
              v-bind:property = "formList.coType"
              v-on:onevents = "somethings"
              v-model = "formList.coType.value"> 
          </inline-input>
          <!-- 其他 -->
          <inline-input 
          	  v-if = "financeTabClass === 'othertransferList'"
              v-bind:property = "formList.otherType"
              v-model = "formList.otherType.value"
              v-on:onevents = "somethings"> 
          </inline-input>
				</div>
			</div>
			<div class="financeList">
				<div>
				  <div v-if="showLoading">
						<div class="loading">
							<loading-model></loading-model>
						</div>
					</div>

					<div v-else>
						<table>
							<template v-if="financeTabClass === 'depositList'">
								<tr>
									<th>{{Internationalization.depositTime}}</th>
									<th>{{Internationalization.symbol}}</th>
									<th>{{Internationalization.amount}}</th>
									<th>{{Internationalization.status}}</th>
									<th>{{Internationalization.opera}}</th>
								</tr>
								<template v-for="(item, key) in financeList">
									<tr>
										<td>{{item.createdAtTime}}</td>
										<td>{{item.symbol}}</td>
										<td>{{item.amount}}</td>
										<td>{{item.status_text}}（{{item.confirmDesc}}）</td>
										<td>
											<a href="javascript:void(0)" @click="detailShow(key)">{{Internationalization.detail}} &gt;</a>
											<!--<s class="triangle" ></s>-->
										</td>
									</tr>
									
									<tr v-if="item.isopen" class="detailShow">
										<td colspan="5" >
											<div class="detailCon">
												<s class="deposittriangle"></s>
											 	<p>{{Internationalization.disposeTime}}:{{item.updateAt}}</p>
											 	<p>{{Internationalization.dealID}}:{{item.txid}}</p>
											</div>
											
										</td>
									</tr>
								</template>
								<tr v-if="financeList.length <= 0" >
									<td colspan="5" class="noMessage">{{Internationalization.noDepositList}}</td>
								</tr>
							</template>
							<template v-if="financeTabClass === 'withdrawList'">
								<tr>
									<th>{{Internationalization.withdrawTime}}</th>
									<th>{{Internationalization.symbol}}</th>
									<th>{{Internationalization.actual}}</th>
									<th>{{Internationalization.label}}</th>
									<th>{{Internationalization.status}}</th>
									<th>{{Internationalization.opera}}</th>
								</tr>
								<template v-for="(item, key) in financeList">
									<tr>
										<td>{{item.createdAtTime}}</td>
										<td>{{item.symbol}}</td>
										<td>{{item.amount}}</td>
										<td>{{item.label}}</td>
										<td>{{item.status_text}}</td>
										<td>
                      <span class="del">
                        <a href="javascript:void(0)" @click="detailShow(key)" class="det" style="margin:0  10px;">{{Internationalization.detail}} </a>
                        <s class="triangle" v-if="item.isopen"></s>
                      </span>
                      <a href="javascript:void(0)" style="margin:0px 10px;" v-if="item.status === 0" @click="cancel_withdraw(item.id)">{{$t('user.order.trans_account.revoke')}}</a>
										</td>
									</tr>
                  
									<tr v-if="item.isopen" class="detailShow">
										<td colspan="6" >
											<div class="detailCon">
												<!-- <s class="triangle" ></s> -->
											 	<p>{{Internationalization.disposeTime}}:{{item.createdAt}}</p>
											 	<p>{{Internationalization.dealID}}:{{item.txid}}</p>
											 	<p>{{Internationalization.feeWithdraw}}:{{item.fee}}</p>
											 	<p>{{Internationalization.withdraw_addr}}:{{item.addressTo}}</p>
											</div>
											
										</td>
									</tr>
                  	<el-dialog 
                      :title='Internationalization.cancel_withdraw'
                      :flag='cancel_pop'
                      name= 'cancel_pop'
                      :width='450'
                      :dialogClose='closeDialog'>
                      <div slot="content">
                        {{Internationalization.confirm_cancel}}
                      </div>
                      <div slot="options">
                        <button @click="closeDialog">{{Internationalization.cancel}}</button>
                        <button @click="confirm_cancel">{{Internationalization.confirm}}</button>
                      </div>
                    </el-dialog >
								</template>
								<tr v-if="financeList.length <= 0" >
									<td colspan="6" class="noMessage">{{Internationalization.noWithdrawList}}</td>
								</tr>
							</template>
							<template v-if="financeTabClass === 'transferList'">
								<tr>
									<th>{{Internationalization.time}}</th>
									<th>{{Internationalization.symbol}}</th>
									<th>{{Internationalization.amount}}</th>
									<th>{{Internationalization.type}}</th>
								</tr>
								<template v-for="(item, key) in financeList">
									<tr :key="key">
										<td>{{item.createdAtTime}}</td>
										<td>{{item.coinSymbol}}</td>
										<td>{{item.amount}}</td>
										<td>{{item.transactionType_text}}</td>
									</tr>
								</template>
								<tr v-if="financeList.length <= 0" >
									<td colspan="4" class="noMessage">{{Internationalization.noTransferList}}</td>
								</tr>
							</template>
              <!-- 合约列表 -->
              <template v-if="financeTabClass === 'coList'">
                <tr>
                  <!-- 时间 -->
									<th>{{Internationalization.time}}</th>
                  <!-- 钱包帐户 -->
                  <th>{{ $t('co.finance.exAm') }}</th>
                  <!-- 合约帐户 -->
									<th>{{ $t('co.finance.coAm') }}</th>
                  <!-- 数量 -->
									<th>{{Internationalization.amount}}</th>
                  <!-- 类型 -->
									<th>{{Internationalization.type}}</th>
								</tr>
                <template v-for="(item, key) in coArr" >
									<tr :key="key">
                    <!-- 时间 -->
										<td>{{item.createTime}}</td>
                    <!-- 钱包帐户 -->
										<td v-if="item.transactionType === 'wallet_to_contract'">{{item.fromAccount}}</td>
                    <td v-else>{{item.toAccount}}</td>
                    <!-- 合约帐户 -->
                    <td v-if="item.transactionType === 'wallet_to_contract'">{{item.toAccount.split(item.fromAccount)[0] + '/' + item.fromAccount}}</td>
                    <td v-else>{{item.fromAccount.split(item.toAccount)[0] + '/' + item.toAccount}}</td>
                    <!-- 数量 -->
										<td v-if="item.transactionType === 'wallet_to_contract'">{{item.amount | coFix(item.toAccount.split(item.fromAccount)[0] + '/' + item.fromAccount, _that)}}</td>
                    <td v-else>{{item.amount | coFix(item.fromAccount.split(item.toAccount)[0] + '/' + item.toAccount, _that)}}</td>
                    <!-- 类型 -->
                    <!-- 转入 -->
										<td v-if="item.transactionType === 'wallet_to_contract'">{{ $t('co.finance.in') }}</td>
                    <!-- 转出 -->
                    <td v-else>{{ $t('co.finance.out') }}</td>
									</tr>
								</template>
								<tr v-if="coArr.length <= 0" >
									<td colspan="5" class="noMessage">{{Internationalization.noOtherList}}</td>
								</tr>
              </template>
              <div class=""></div>
							<template v-if="financeTabClass === 'othertransferList'">
								<tr>
									<th>{{Internationalization.time}}</th>
									<th>{{Internationalization.symbol}}</th>
									<th>{{Internationalization.type}}</th>
									<th>{{Internationalization.amount}}</th>
									<th>{{Internationalization.status}}</th>
								</tr>
								<template v-for="(item, key) in financeList">
									<tr>
										<td>{{item.createdAtTime}}</td>
										<td>{{item.coinSymbol}}</td>
										<td>{{item.transactionScene}}</td>
										<td>{{item.amount}}</td>
										<td>{{item.status_text}}</td>
									</tr>
								</template>
								<tr v-if="financeList.length <= 0" >
									<td colspan="5" class="noMessage">{{Internationalization.noOtherList}}</td>
								</tr>
							</template>
						</table>
					</div>
				</div>	
			</div>
      <div class="page" v-if="(count / myData.pageSize) > 1">
        <VPagination :total='count' :display='myData.pageSize' :currentPage='myData.page' @pagechange='pagechange'/>
      </div>
		</div>
		</div>
	</div>
</template>
<script>
import fundsAside from './funds_aside'
import { mapState } from 'vuex'
import InlineInput from '@/components/common/inlineInput'
import loadingModel from '@/components/common/loadingModel'
import VPagination from '@/components/common/pagination'
import elDialog from '@/components/common/dialog'
export default {
  name: 'finance-manage-content',
  data () {
    return {
      coArr: [],
      financeList: [],
      financeTabClass: null,
      isopen: false,
      formList: {},
      ajaxUrl: null,
      showLoading: false,
      myData: {
        coinSymbol: null,
        transactionType: null,
        transactionScene: null,
        page: 1, // 当前页码
        pageSize: 10 // 当前页要多少条数据
      },
      count: 0, // 数据库总数据
      cancel_pop: false, // 取消提现弹窗
      id: null // 提现ID
    }
  },
  components: {
    InlineInput, loadingModel, VPagination, fundsAside, elDialog
  },
  created () {
    this.accountTab('depositList')
    // this.accountTab('coList')
    this.formList = this.formList_obj
    // this.formData = this.formData_obj
  },
  filters: {
    coFix (v, symbol, that) {
      let { _coinList } = that.$store.state.baseData
      let market = symbol.split('/')[1]
      if (!_coinList[market]) { return v }
      let symbolObj = _coinList[market]
      return that._P.fixD(v, symbolObj.showPrecision)
    }
  },
  watch: {
    '$store.state.baseData._lan' (v, oldval) {
      if (oldval) {
        this.getScene() // 重新获取其他版块下的类型下拉框的选项数据
        this.getList() // 重新获取表格列表数据
        this.formList = this.formList_obj
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
      },
      otcOpen ({baseData: {otcOpen}}) {
        return otcOpen || false
      },
      coOpen ({baseData: {contractOpen}}) { // 是否开启合约
        return contractOpen || false
      },
      // 监听语言切换
      lan ({baseData: {_lan}}) {
        return _lan || false
      }
    }),
    _that () { return this },
    formList_obj () {
      let list = [
        {value: this.Internationalization.allsymbol, code: ''}
      ]
      let otcList = [
        {value: this.Internationalization.allsymbol, code: ''}
      ]
      for (let i in this.coinlist) {
        let obj = {value: this.coinlist[i].name, code: this.coinlist[i].name}
        list.push(obj)
        if (this.coinlist[i].otcOpen === 1) {
          let obj = {value: this.coinlist[i].name, code: this.coinlist[i].name}
          otcList.push(obj)
        }
      }
      // 合约币种
      let coCoinList = [
        {value: this.Internationalization.allsymbol, code: ''}
      ]
      for (let e in this.$store.state.coBaseData._symbols) {
        if (e !== 'myMarket') {
          coCoinList.push({value: e.toUpperCase(), code: e})
        }
      }
      return {
        transferType: {
          title: '',
          placeholder: this.Internationalization.changeType,
          formType: 'select',
          name: 'transferType',
          value: '',
          optionList: [
            {value: this.Internationalization.alltype, code: ''},
            {value: this.Internationalization.transferinOtc, code: 1},
            {value: this.Internationalization.transferoutOtc, code: 2}
          ]
        },
        // 合约 下拉 -- 类型选择
        coType: {
          title: '',
          placeholder: this.Internationalization.changeType,
          formType: 'select',
          name: 'coType',
          value: '',
          optionList: [
            {value: this.Internationalization.alltype, code: ''},
            {value: this.$t('co.finance.in'), code: 1},
            {value: this.$t('co.finance.out'), code: 2}
          ]
        },
        otherType: {
          title: '',
          // placeholder: this.Internationalization.changeType,
          formType: 'select',
          name: 'otherType',
          value: '',
          optionList: [
            // {value: this.Internationalization.alltype, code: ''},
            // {value: this.Internationalization.present_coin, code: 'present_coin'}
          ]
        },
        coinList: {
          title: '',
          placeholder: this.Internationalization.changesymbol,
          formType: 'select',
          name: 'coinList',
          value: '',
          optionList: list
        },
        otcCoinList: {
          title: '',
          placeholder: this.Internationalization.changesymbol,
          formType: 'select',
          name: 'otcCoinList',
          value: '',
          optionList: otcList
        },
        coCoinList: {
          title: '',
          placeholder: this.Internationalization.changesymbol,
          formType: 'select',
          name: 'coCoinList',
          value: '',
          optionList: coCoinList
        }
      }
    },
     // 国际化
    Internationalization () {
      return {
        funds_manage: this.$t('fund.funds_manage'), // 资金管理
        finance_manage: this.$t('fund.finance_manage'), // 资金流水
        address_manage: this.$t('fund.address_manage'), // 地址管理
        transaction_acc: this.$t('fund.transaction_acc'), // 交易账户
        contract_acc: this.$t('fund.contract_acc'), // 合约账户
        outside_acc: this.$t('fund.outside_acc'), // 场外账户
        hidden_zero: this.$t('fund.hidden_zero'), // 资金管理
        symbol: this.$t('fund.symbol'), // 币种
        total: this.$t('fund.total'), // 总额
        usable: this.$t('fund.usable'), // 可用
        lock: this.$t('fund.lock'), // 冻结
        opera: this.$t('fund.opera'), // 操作
        deposit_addr: this.$t('fund.funds.deposit_addr'), // 充值地址
        add_addr: this.$t('fund.funds.add_addr'), // 添加地址
        canWithdraw: this.$t('fund.funds.canWithdraw'), // 可提现
        feeWithdraw: this.$t('fund.funds.feeWithdraw'), // 手续费
        workerFeeWithdraw: this.$t('fund.funds.workerFeeWithdraw'), // 矿工手续费
        withdraw_addr: this.$t('fund.funds.withdraw_addr'), // 提币地址
        changeWithdrawAddr: this.$t('fund.funds.changeWithdrawAddr'), // 请选择提币地址
        submit: this.$t('fund.funds.submit'), // 提交
        deposit: this.$t('fund.funds.deposit'), // 充值
        withdraw: this.$t('fund.funds.withdraw'), // 提现
        transferOut: this.$t('fund.funds.transferOut'), // 转出
        transferIn: this.$t('fund.funds.transferIn'), // 转入
        notice: this.$t('fund.notice'), // 提示
        cancel: this.$t('fund.cancel'), // 取消
        confirm: this.$t('fund.confirm'), // 确认
        actual: this.$t('fund.funds.actual'), // 实际到账
        applyTime: this.$t('fund.funds.applyTime'), // 申请时间
        transfer: this.$t('fund.funds.transfer'), // 资金划转
        transferOutAmount: this.$t('fund.funds.transferOutAmount'), // 转出数量
        transferInAmount: this.$t('fund.funds.transferInAmount'), // 转入数量
        smsAuthCode: this.$t('fund.smsAuthCode'), // 手机验证码
        googleCode: this.$t('fund.googleCode'), // 谷歌验证码
        passCode: this.$t('fund.passCode'), // 验证码已发送
        transferList: this.$t('fund.funds.transferList'), // 划转
        otherList: this.$t('fund.funds.otherList'), // 其他
        amount: this.$t('fund.amount'), // 数量
        status: this.$t('fund.status'), // 状态
        depositTime: this.$t('fund.finance.depositTime'), // 充值时间
        detail: this.$t('fund.finance.detail'), // 详情
        disposeTime: this.$t('fund.finance.disposeTime'), // 处理时间
        dealID: this.$t('fund.finance.dealID'), // 区块链交易ID
        withdrawTime: this.$t('fund.finance.withdrawTime'), // 提现时间
        label: this.$t('fund.finance.label'), // 钱包标签
        type: this.$t('fund.type'), // 类型
        time: this.$t('fund.time'), // 时间
        allsymbol: this.$t('fund.allsymbol'), // 全部币种
        changeType: this.$t('fund.finance.changeType'), // 请选择类型
        changesymbol: this.$t('fund.finance.changesymbol'), // 请选择币种
        alltype: this.$t('fund.finance.alltype'), // 全部类型
        transferinOtc: this.$t('fund.finance.transferinOtc'), // 转入场外
        transferoutOtc: this.$t('fund.finance.transferoutOtc'), // 转出场外
        present_coin: this.$t('fund.finance.present_coin'), // 赠币
        noCheck: this.$t('fund.finance.noCheck'), // 未审核
        noConfirm: this.$t('fund.finance.noConfirm'), // 未确认
        noFinish: this.$t('fund.finance.noFinish'), // 未完成
        checkPass: this.$t('fund.finance.checkPass'), // 审核通过
        finished: this.$t('fund.finance.finished'), // 已完成
        abnormal: this.$t('fund.finance.abnormal'), // 异常
        checkReject: this.$t('fund.finance.checkReject'), // 审核拒绝
        paying: this.$t('fund.finance.paying'), // 支付中已打币
        payFail: this.$t('fund.finance.payFail'), // 支付失败
        repeal: this.$t('fund.finance.repeal'), // 已撤销
        noDepositList: this.$t('fund.finance.noDepositList'), // 没充值记录
        noWithdrawList: this.$t('fund.finance.noWithdrawList'), // 没提现记录
        noTransferList: this.$t('fund.finance.noTransferList'), // 没记录
        noOtherList: this.$t('fund.finance.noOtherList'), // 没充值记录
        cancel_withdraw: this.$t('fund.finance.cancel_withdraw'), // 取消提现
        confirm_cancel: this.$t('fund.finance.confirm_cancel'), // 确认取消提现？
        cancel_success: this.$t('fund.finance.cancel_success') // 撤销成功
      }
    }
  },
  methods: {
    // 触动分页
    pagechange (page) {
      this.myData.page = page
      this.getList()
    },
    somethings (data) {
      let _this = this
      if (data.name === 'transferType') {
        this.myData.transactionType = data.value.code
      }
      if (data.name === 'otherType') {
        this.myData.transactionScene = data.value.code
      }
      if (data.name === 'coinList' || data.name === 'otcCoinList') {
        this.myData.coinSymbol = data.value.code
      }
      if (data.name === 'coCoinList') {
        this.myData.coinSymbol = data.value.code
      }
      if (data.name === 'coType') {
        this.myData.transactionType = data.value.code
      }
      this.myData.page = 1
      this.myData.pageSize = 10
      this.showLoading = true
      setTimeout(function () {
        _this.getList()
      }, 300)
//    this.getList()
    },
    accountTab (type, code) {
      this.myData.page = 1
      let _this = this
      this.showLoading = true
      this.data = {}
      for (let item in this.formList) {
        this.formList[item].value = ''
      }
//    this.$nextTick(() => {
//  		console.log(this.formList.coinList.value)
//      this.formList.coinList.value = ''
//    })
      this.myData = {
        coinSymbol: null,
        page: 1,
        pageSize: 10,
        transactionScene: null,
        transactionType: null
      }
      this.financeTabClass = type
      this.ajaxUrl = this.$store.state.url.fund.deposit_list
      if (this.financeTabClass === 'withdrawList') {
        this.ajaxUrl = this.$store.state.url.fund.withdraw_list
      } else if (this.financeTabClass === 'transferList') {
        this.ajaxUrl = this.$store.state.url.fund.otc_transfer_list
      } else if (this.financeTabClass === 'othertransferList') {
        this.ajaxUrl = this.$store.state.url.fund.other_transfer_list
        this.getScene()
      } else if (this.financeTabClass === 'coList') {
        this.ajaxUrl = 'co_transfer_list'
      } else {
        this.ajaxUrl = this.$store.state.url.fund.deposit_list
      }
      // _this.getList()
      setTimeout(function () {
        _this.getList()
      }, 300)
//    this.getList()
    },
    // 请求数据
    getList () {
      let hostType = null
      if (this.financeTabClass === 'coList') {
        hostType = 'co'
      }
      this.financeList = []
      this.axios({
        url: this.ajaxUrl,
        headers: {},
        hostType: hostType,
        params: this.myData,
        method: 'post'
      }).then((data) => {
        if (this.financeTabClass === 'coList') {
          if (data.code === '0') {
            this.showLoading = false
            this.count = data.data.count
            this.coArr = data.data.financeList
          } else {
            this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
          }
        } else {
          if (data.code === '0') {
            this.showLoading = false
            this.count = data.data.count
            this.financeList = data.data.financeList
            for (let item in this.financeList) {
              this.financeList[item].createdAtTime = this._P.formatTime(this.financeList[item].createdAtTime)
            }
          } else {
            this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
          }
        }
      })
    },
    // 详情显示
    detailShow (item) {
      let j = item.toString()
      for (let i in this.financeList) {
        if (i === j) {
          if (this.financeList[i].isopen) {
            this.financeList[i].isopen = false
          } else {
            this.$set(this.financeList[i], 'isopen', true)
          }
        } else {
          this.$set(this.financeList[i], 'isopen', false)
        }
      }
    },
    // 获取 资金流水 其他里面的类型选项
    getScene () {
      this.axios({
        url: this.$store.state.url.fund.other_transfer_scene,
        headers: {},
        params: {},
        method: 'post'
      }).then((data) => {
        if (data.code === '0') {
          let arr = []
          if (data.data.cenceList && data.data.cenceList.length > 0) {
            let cenceList = data.data.cenceList
            cenceList.map((item) => {
              arr.push({value: item.key_text, code: item.key})
            })
            this.formList.otherType.optionList = arr
            this.formList.otherType.value = this.formList.otherType.optionList[0].code
            this.myData.transactionScene = this.formList.otherType.optionList[0].code
          }
        } else {
          this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
        }
      })
    },
    // 设置数量的精度校验
    setCalculation (num, symbo) {
      return this._P.fixD(num, this.coinlist[symbo].showPrecision)
    },
    // 未审核状态取消提现
    cancel_withdraw (id) {
      this.cancel_pop = true
      this.id = id
    },
    // 关闭弹窗
    closeDialog () {
      this.cancel_pop = false
      this.id = null
    },
    // 取消提现接口
    confirm_cancel () {
      this.axios({
        url: this.$store.state.url.fund.cancel_withdraw,
        headers: {},
        params: {
          withdrawId: this.id
        },
        method: 'post'
      }).then((data) => {
        this.cancel_pop = false
        this.id = null
        if (data.code === '0') {
          this.$store.dispatch('setTipState', {text: this.Internationalization.cancel_success})
          this.getList()
        } else {
          this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
        }
      })
    }
  }
}
</script>

<style scoped> 
/* .financeList {
  min-height: 550px;
} */
</style>