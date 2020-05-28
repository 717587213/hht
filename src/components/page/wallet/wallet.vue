<template>
  <div class="mining">
    <div class="m-content">
      <div class="wallet-main">
        <h1 class="wallet-title">
          {{this.$t('wallet.title')}}
        </h1>
        <div v-if="balanceLoading">
          <div class="loading">
            <loading-model></loading-model>
          </div>
        </div>
        <div v-else class="balance-container clearfix">
          <div class="balance-left">
            <ul>
              <li class="clearfix left-li">
                <span class="balance-name">{{this.$t('wallet.balance.balance')}}</span>
                <span class="balance-val">{{balance.margin}}</span>
              </li>
              <li class="clearfix left-li">
                <span class="balance-name">{{this.$t('wallet.balance.benefit')}}</span>
                <span class="balance-val">{{balance.accountRight}}</span>
              </li>
              <li class="clearfix left-li">
                <span class="balance-name">{{this.$t('wallet.balance.unUse')}}</span>
                <span class="balance-val">{{balance.canUseBalance}}</span>
              </li>
            </ul>
            <div class="transfer-region clearfix">
              <a class="transfer-in" href="javascript:;" @click="transferCoin('in')">{{this.$t('wallet.balance.transferIn')}}</a>
              <a class="transfer-out" href="javascript:;" @click="transferCoin('out')">{{this.$t('wallet.balance.transferOut')}}</a>
            </div>
          </div>
          <div class="balance-right">
            <ul>
              <li class="clearfix">
                <span class="balance-name">{{this.$t('wallet.balance.balance')}}</span>
                <span class="balance-val">{{balance.margin}}</span>
              </li>
              <li class="underline"></li>
              <li class="clearfix">
                <span class="balance-name">{{this.$t('wallet.balance.unProfit')}}</span>
                <span class="balance-val">{{balance.unrealisedAmount}}</span>
              </li>
              <li class="clearfix">
                <span class="balance-name">{{this.$t('wallet.balance.benefit')}}</span>
                <span class="balance-val">{{balance.accountRight}}</span>
              </li>
              <li class="underline"></li>
              <li class="clearfix">
                <span class="balance-name">{{this.$t('wallet.balance.freightDeposit')}}</span>
                <span class="balance-val">{{balance.positionMargin}}</span>
              </li>
              <li class="clearfix">
                <span class="balance-name">{{this.$t('wallet.balance.entrustDeposit')}}</span>
                <span class="balance-val">{{balance.orderMargin}}</span>
              </li>
              <li class="clearfix">
                <span class="balance-name">{{this.$t('wallet.balance.unUse')}}</span>
                <span class="balance-val">{{balance.canUseBalance}}</span>
              </li>
              <li class="underline"></li>
              <li class="clearfix">
                <span class="balance-name">{{balance.useMarginRate}}{{this.$t('wallet.balance.usedDeposit')}}</span>
              </li>
            </ul>
          </div>
        </div>
        <div v-if="contractListLoading">
          <div class="loading">
            <loading-model></loading-model>
          </div>
        </div>
        <div v-else class="wallet-contract">
          <div class="wallet-record-title">
            <h1>{{this.$t('wallet.contract.title')}}</h1>
          </div>
          <div class="wallet-contract-list">
            <ul class="wallet-contract-container clearfix">
              <li v-for="items,inx in contractList" class="list-box" v-bind:class="computedListLast(inx, items)">
                <ul class="list-region">
                  <li v-for="item, inx in items" v-bind:class="computedClass(inx, item)">
                    {{item}}
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
        <div v-if="recordsLoading">
          <div class="loading">
            <loading-model></loading-model>
          </div>
        </div>
        <div v-else class="wallet-record">
          <div class="wallet-record-title">
            <h1>{{this.$t('wallet.records.title')}}</h1>
            <h3 class="record-titleDesc">{{this.$t('wallet.records.titleDesc')}}</h3>
          </div>
          <div class="record-desc-region">
            <p class="record-desc">{{this.$t('wallet.records.desc')}}</p>
          </div>
          <table class="record-list">
            <thead>
              <tr>
                <th v-for="item in recordsTitle">
                  {{item}}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="items in records">
                <td v-for="item in items">{{item}}</td>
              </tr>
            </tbody>
          </table>
          <v-pagination v-if="(count/wallet.pageSize) > 1"
                        :total="count"
                        :current-page='wallet.page'
                        :display='wallet.pageSize'
                        @pagechange="pagechange($event)">
          </v-pagination>
        </div>
      </div>
    </div>
    <el-dialog
      :title='transfer.title'
      :flag='isShow'
      name= 'transferDialog'
      :width='450'
      :dialogClose='closeDialog'>
      <div slot="content">
        <ul class="transfer-list transferOpe">
          <li><span>{{this.$t('wallet.transfer.from')}}</span><span class="current-acc">{{transfer.from}}</span></li>
          <li><span>{{this.$t('wallet.transfer.to')}}</span><span class="current-acc">{{transfer.to}}</span></li>
          <li><span>{{transfer.count}}</span><input type="number" :placeholder="transfer.count" v-model="transferAmount" @keydown="changeAllType"/><span>{{balance.quoteSymbol}}</span></li>
          <li><span class="usable-quantity"></span><div><i>{{transfer.canTransfer}}:</i><i>{{useBalance}}</i><a @click="alltransfer" href="javascript:void(0)">{{transfer.all}}</a></div></li>
          <li class="error-note">{{errorInfo}}</li>
        </ul>
      </div>
      <div slot="options">
        <button @click="closeDialog">{{this.$t('wallet.transfer.cancel')}}</button>
        <button @click="transferConfirm('in')">{{this.$t('wallet.transfer.ok')}}</button>
      </div>
    </el-dialog >
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import elDialog from '@/components/common/dialog'
  import loadingModel from '@/components/common/loadingModel'
  import VPagination from '@/components/common/pagination'
  const unFormatProperties = {
    'useMarginRate': true,
    'quoteSymbol': true,
    'walletAccountType': true,
    'contractAccountType': true
  }
  export default {
    name: 'wallet',
    data () {
      return {
        recordsTitle: this.$t('wallet.records.listTitle'),
        contractTitleList: this.$t('wallet.records.contractList'),
        transferAllType: false,
        showPrecision: 4,
        transferAmount: null,
        transferType: '',
        useBalance: 0,
        locale: this.lan,
        useBalanceNum: 0,
        transfer: {
          title: this.$t('wallet.transfer.title'),
          from: this.$t('wallet.transfer.transferAccount'),
          to: this.$t('wallet.transfer.contractAccount'),
          count: this.$t('wallet.transfer.inCount'),
          canTransfer: this.$t('wallet.transfer.canTransferIn'),
          transferAll: this.$t('wallet.transfer.allin')
        }
      }
    },
    components: {
      elDialog, loadingModel, VPagination
    },
    watch: {
      transferAmount (val, oldval) {
        if (Number(val) > Number(this.useBalanceNum)) {
          this.transferAmount = this.useBalanceNum
        }
        let newVal = val + ''
        let fixVal = newVal.split('.')[1]
        if (fixVal && fixVal.length > this.balancePriceData) {
          this.$nextTick(() => {
            if (!this.transferAllType) {
              this.transferAmount = this._P.fixD(val, this.balancePriceData)
            }
          })
        }
      },
      lan () {
        this.$store.dispatch('setSuccessMsg', this.$t('wallet.transfer.success'))
        this.recordsTitle = this.$t('wallet.records.listTitle')
      }
    },
    methods: {
      changeAllType () {
        this.transferAllType = false
      },
      pagechange (page) {
        this.$store.dispatch('getRecords', {
          pageSize: this.wallet.pageSize,
          page: page
        })
      },
      transferConfirm () {
        let fromType, toType, amount, bond
        if (this.transferType === 'in') {
          fromType = this.balance.walletAccountType
          toType = this.balance.contractAccountType
        } else {
          fromType = this.balance.contractAccountType
          toType = this.balance.walletAccountType
        }

        amount = Number(this.transferAmount)
        bond = this.balance.quoteSymbol
        if (isNaN(amount) || (amount === 0 && this.transferType !== 'in')) {
          this.$store.dispatch('setDialogError', this.$t('wallet.transfer.amountErrorNaN'))
          return
        }

        if (amount < 0.0001 && this.transferType === 'in') {
          this.$store.dispatch('setDialogError', this.$t('wallet.transfer.amountError'))
          return
        }
        this.$store.dispatch('capitalTransfer', {
          fromType: fromType,
          toType: toType,
          amount: amount,
          bond: bond,
          callback: () => {
            this.transferAmount = null
            this.amount = null
          }
        })
      },
      alltransfer () {
        if (parseFloat(this.useBalanceNum) === 0) {
          this.$store.dispatch('setDialogError', this.$t('wallet.transfer.notEnough'))
          return false
        }
        this.transferAllType = true
        this.transferAmount = this.useBalanceNum
      },
      transferCoin (type) {
        this.transfer.title = this.$t('wallet.transfer.title')
        if (type === 'in') {
          this.useBalance = this.balance.walletBalance
          this.useBalanceNum = this.balance.walletBalanceNum
          this.transfer.canTransfer = this.$t('wallet.transfer.canTransferIn')
          this.transfer.count = this.$t('wallet.transfer.inCount')
          this.transfer.from = this.$t('wallet.transfer.transferAccount')
          this.transfer.to = this.$t('wallet.transfer.contractAccount')
          this.transfer.all = this.$t('wallet.transfer.allin')
          this.transferType = 'in'
        } else {
          this.useBalance = this.balance.canUseBalance
          this.useBalanceNum = this.balance.canUseBalanceNum
          this.transfer.canTransfer = this.$t('wallet.transfer.canTransferOut')
          this.transfer.count = this.$t('wallet.transfer.outCount')
          this.transfer.from = this.$t('wallet.transfer.contractAccount')
          this.transfer.to = this.$t('wallet.transfer.transferAccount')
          this.transfer.all = this.$t('wallet.transfer.allout')
          this.transferType = 'out'
        }
        this.$store.dispatch('setDialogShow', true)
      },
      // 关闭弹窗
      closeDialog (e) {
        this.$store.dispatch('setDialogShow', false)
        this.$store.dispatch('setDialogError', '')
        this.transferAmount = null
        this.amount = null
      },
      computedListLast: function (inx, items) {
        let li = items[2]
        let cls = ''
        if (!((inx + 1) % 6)) {
          cls = 'last'
        }
        if (li.indexOf('-') > -1) {
          cls += ' short-selling'
        } else {
          cls += ' buying-long'
        }
        return cls
      },
      computedClass: function (inx, item) {
        let cls = ''
        if (!inx) {
          cls = 'list-title'
        } else if (inx % 2) {
          cls = 'list-title-name'
          if (inx !== 1) {
            cls += ' add-padding'
          }
        } else if (!(inx % 2) && inx) {
          cls = 'list-title-val'
        }
        if (inx !== 2) {
          if (parseFloat(item) > 0) {
            cls += ' buying-long'
          } else if (parseFloat(item) < 0) {
            cls += ' short-selling'
          } else {
            cls += ' white'
          }
        }
        return cls
      }
    },
    computed: mapState({
      isShow: state => state.wallet.isShow,
      pedding: state => state.wallet.pedding,
      errorInfo: state => state.wallet.errorInfo,
      balanceLoading: state => state.wallet.balanceLoading,
      recordsLoading: state => state.wallet.recordsLoading,
      contractListLoading: state => state.wallet.contractListLoading,
      wallet: state => state.wallet,
      lan: state => state.baseData._lan,
      count: function (state) {
        let info = state.wallet.records[state.wallet.page]
        let count = 0
        if (info) {
          count = info.count
        }
        return count
      },
      balancePriceData: function (state) {
        if (state.wallet.balance.quoteSymbol && state.coBaseData._coinList) {
          return state.coBaseData._coinList[state.wallet.balance.quoteSymbol.toLowerCase()].showPrecision
        }
      },
      records: function (state) {
        let info = state.wallet.records[state.wallet.page]
        let list
        if (!info) {
          return
        }
        list = info.transactionsList
        let data = []
        if (list) {
          for (let i = 0, len = list.length; i < len; i++) {
            let obj = list[i]
            data[i] = []
            data[i].push(this._P.formatTime(obj.ctimeL))
            data[i].push(obj.sceneStr)
            data[i].push(this._P.fixD(obj.amountStr, this.balancePriceData) + ' ' + this.balance.quoteSymbol)
            data[i].push(obj.address)
            data[i].push(this._P.fixD(obj.accountBalance, this.balancePriceData))
          }
        }
        return data
      },
      balance: function (state) {
        let obj = {}
        let data = state.wallet.balance
        try {
          data.quoteSymbol = data.quoteSymbol.toUpperCase()
        } catch (e) {

        }
        for (let key in data) {
          if (!unFormatProperties[key]) {
            obj[key] = this._P.fixD(data[key], this.showPrecision) + ' ' + data.quoteSymbol
          } else {
            obj[key] = data[key]
          }
        }
        obj['canUseBalanceNum'] = data['canUseBalance']
        obj['walletBalanceNum'] = data['walletBalance']
        return obj
      },
      contractList: function (state) {
        let list = []
        let contractList = state.wallet.contractList
        let contractListTitle = this.$t('wallet.contract.contractList')
        for (let i = 0, len = contractList.length; i < len; i++) {
          let volum = ''
          list.push([])
          let obj = contractList[i]
          let desc = ''
          if (obj.side === 'BUY') {
            desc = this.$t('wallet.contract.buyingLong')
          } else {
            desc = this.$t('wallet.contract.shortSelling')
            volum = '-'
          }
          list[i].push(obj.contractName)
          list[i].push(contractListTitle[0])
          list[i].push(volum + obj.volume + '( ' + desc + ' )')
          list[i].push(contractListTitle[1])
          list[i].push(this._P.fixD(obj.realisedAmount, this.balancePriceData) + obj.bond)
          list[i].push(contractListTitle[2])
          list[i].push(this._P.fixD(obj.unrealisedAmount, this.balancePriceData) + obj.bond)
        }
        return list
      }
    }),
    mounted () {
      this.$store.dispatch('setSuccessMsg', this.$t('wallet.transfer.success'))
      this.$store.dispatch('getBalance')
      setInterval(() => {
        if (!this.pedding) {
          this.$store.dispatch('setPedding', true)
          this.$store.dispatch('getBalance')
        }
      }, 20000)
    }
  }
</script>

<style scoped>

  .mining{
    padding-top: 120px;
  }
  .m-content{
    background-color: #0a152d;
    padding-right: 0;
    padding-left: 0;
  }
  .wallet-title{
    font-size: 24px;
    text-align: center;
    font-weight: bold;
    color: #2b91f1;
    height: 60px;
    line-height: 60px;
    position: relative;
    background-color: #081024;
  }
  .save-csv{
    background-color: #2b91f1;
    color: #fff;
    font-size: 14px;
    padding: 10px 12px;
    border-radius: 5px;
    position: absolute;
    right: 24px;
    height: 14px;
    line-height: 14px;
    top: 50%;
    transform: translateY(-50%);
  }
  .wallet-record{
    padding: 0 44px;
    padding-bottom: 70px;
    min-height: 200px;
  }
  .wallet-record-title{
    padding-top: 22px;
    padding-bottom: 30px;
    text-align: center;
  }
  .wallet-main h1{
    font-size: 18px;
    margin-bottom: 10px;
  }
  .record-titleDesc{
    font-size: 12px;
    color: #6a799b;
  }
  .record-desc-region{
    background-color: #152139;
    border: #182540 solid 1px;
    padding-bottom: 15px;
    padding-top: 15px;
    display: none;
  }
  .record-desc{
    font-size: 12px;
    color: #6a799b;
    width: 568px;
    margin: 0 auto;
    text-align: center;
    line-height: 22px;
  }
  .record-list{
    width: 95%;
    margin-left: 10px;
   /* margin-top: 30px;*/
  }

  .record-list th{
    color: #6a799b;
  }
  .record-list th, .record-list td{
    text-align: right;
    padding: 9px 0;
  }
  .record-list th:nth-of-type(1), .record-list td:nth-of-type(1){
    text-align: left;
  }
  .wallet-contract{
    padding: 13px 44px 45px 44px;
    border-top: #182540 1px solid;
    border-bottom: #182540 1px solid;
    min-height: 200px;
  }
  .list-region{
    text-align: center;
    background-color: #152139;
    padding-bottom: 10px;
  }
  .list-region li{
   /*/ height: 25px;*/
    line-height: 25px;
  }
  .list-region .list-title{
    font-size: 16px;
    color: #6a799b;
    background-color: #081024;
    margin-bottom: 5px;
    height: 32px;
    line-height: 32px;
  }
  .list-region .list-title-name{
    color: #d3def4;
    font-size: 16px;
  }
  .list-region .list-title-val{
    font-size: 12px;
  }
  .list-box{
    width: 15%;
    float: left;
    padding-right: 2%;
    margin-bottom: 10px;
  }
  .last{
    padding-right: 0;
  }
  .balance-container{
    padding: 15px 44px 25px 44px;
    min-height: 200px;
  }
  .balance-container .balance-name, .balance-container .balance-val{
    font-size: 16px;
    width: 50%;
    float: left;
    text-align: center;
  }
  .balance-right .balance-name, .balance-right .balance-val{
    font-size: 14px;
    padding-bottom: 7px;
    padding-top: 7px;
  }
  .balance-container .balance-val{
    width: 40%;
    text-align: right;
  }
  .balance-container .balance-name{
    color: #7180a3;
    text-align: left;
  }

  .balance-left .balance-name{
    text-align: center;
  }
  .balance-right .balance-name{
    text-indent: 20px;
  }
  .balance-container .balance-val{
    color: #abb6c3;
  }
  .balance-container .balance-left{
    width: 462px;
    float: left;
    margin-top: 43px;
  }
  .balance-container .balance-right{
    float: right;
    width: 462px;
    margin-right: 25px;
  }
  .transfer-region{
    padding-top: 16px;
  }
  .balance-container .transfer-in, .balance-container .transfer-out{
    color: #ffffff;
    font-size: 16px;
    background-color: #00ce96;
    float: left;
    width: 50%;
    padding: 10px 0;
    text-align: center;
  }
  .balance-container .transfer-out{
    background-color: #2b91f1;
  }
  .left-li{
    margin-bottom: 26px;
  }
  .underline{
    border-bottom: #182540 2px solid;
    margin-top: 7px;
    margin-bottom: 7px;
  }
  .add-padding{
    padding-top: 10px;
  }
  .dialog-content .transfer-list {
    li {
      float: none;
      .select-option-box {
        height: 223px;
      }
    }
  }
  .transfer-list li,.infor-list li{
    position: relative;
    float: left;
    width: 99%;
    line-height: 42px;
  }
  .infor-list li span,.transfer-list li span{
    font-size: 14px;
    margin-right: 5px;
  }
  li.warn-txt{
    color:$red-color;
  }
  li.warn-txt i{
    display: inline-block;
    height: 18px;
    width: 18px;
    vertical-align: middle;
    margin-right: 10px;
  }
  .transferOpe input{
    display: inline-block;
    width: 220px;
    padding-left: 10px;
    margin-right: 10px;
    margin-top:5px;
  }
  .transfer-list li div a {
    float: right;
    margin-right:40px;
  }
  .transfer-list li div i{
    margin-right: 5px;
  }
  .transfer-list li span:first-child{
    text-align: right;
    display: inline-block;
    margin-right: 15px;
    width: 80px;

  }
  .transfer-list li span.usable-quantity{
    height: 42px;
    float: left;
    width: 4px;
  }

  .transfer-list li input{
  }
  .current-acc{
    display: inline-block;
    cursor: pointer;
    height: 32px;
    line-height: 32px;
    border: 1px solid $blue-font-color;
    text-align: center;
    border-radius: 5px;
    margin-right: 20px;
    background: $input-background;
  }
  .infor-list li.error-note,.transfer-list li.error-note{
    color: $red-color;
    height: auto;
    line-height: 30px;
    margin: 0;
  }
  li.last{
    overflow: hidden;
    text-align: center;
    //margin-top: 15px;
  }
  .cancel,.confirm{
    display: inline-block;
    height: 40px;
    width: 100px;
    text-align: center;
    line-height: 40px;
    font-size: 14px;
    border-radius: 2px;
    cursor: pointer;
    margin: 0 18px;
  }
  .cancel{
  }
  .confirm{

  }
  li.confirm-del-add{
    font-size: 16px;
  }
  .short-selling{
    color: #cb4848;
  }
  .buying-long{
    color: #00ce96;
  }
  .white{
    color: #fff;
  }
  .infor-list li.error-note,.transfer-list li.error-note{
    color: #ff001d;
    height: auto;
    line-height: 30px;
    margin: 0;
    text-align: center;
  }
</style>
