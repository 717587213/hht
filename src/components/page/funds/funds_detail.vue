<template>
  <div class="funds">
     <div class="funds-main">
       <funds-aside></funds-aside>
       <div class="funds-content">
         <!-- 头部 -->
         <div  class="address-manage-top">
            <ul class="address-manage-nav">
                <!-- 币宝账户 -->
                <li @click="accountTab('bibao')" :class="financeTabClass === 'bibao' ? 'fundActive' : ''">{{ $t('fund.bibaoAcc') }}</li>
            </ul>
            <div class="coinlist">
              <inline-input 
                      v-bind:property = "coinList.coinList"
                      v-model = "coinList.coinList.value"
                      v-on:onevents = "somethings"> 
              </inline-input>
            </div>
         </div>
         <!-- 详情列表 -->
         <div class="address-transaction-acc">
            <div>
              <div v-if="showLoading">
                <div class="loading">
                  <loading-model></loading-model>
                </div>
              </div>
              <div v-else>
                <table >
                  <template v-if="financeTabClass === 'bibao'">
                    <tr>
                      <th>{{ $t('fund.symbol') }}</th>
                      <th>{{ $t('fund.funds.transferInAmount') }}</th>
                      <th>{{ $t('fund.freed') }}</th>
                      <th>{{ $t('fund.start') }}</th>
                      <th>{{ $t('fund.end') }}</th>
                      <th>{{ $t('fund.status') }}</th>
                    </tr>
                    <template v-for="(item, key) in dataList">
                      <tr>
                        <td>{{item.symbol}}</td>
                        <td>{{item.amount}}</td>
                        <td>{{item.unlocked_amount}}</td>
                        <td>{{item.startDate}}</td>
                        <td>{{item.expireDate}}</td>
                        <td>{{item.statusText}}</td>
                      </tr>
                    </template>
                    <tr v-if="dataList.length <= 0" >
                        <td colspan="6" class="noMessage">{{ $t('fund.noDetail') }}</td>
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
import VPagination from '@/components/common/pagination'
import InlineInput from '@/components/common/inlineInput'
import loadingModel from '@/components/common/loadingModel'
export default {
  name: 'funds-detail',
  data () {
    return {
      financeTabClass: 'bibao',
      coinList: {},
      showLoading: false,
      dataList: [],
      noFirst: false,
      myData: {
        coinSymbol: null,
        page: 1, // 当前页码
        pageSize: 10 // 当前页要多少条数据
      },
      count: 0 // 数据库总数据
    }
  },
  components: {fundsAside, VPagination, InlineInput, loadingModel},
  created () {
    this.noFirst && this.accountTab()
    this.coinList = this.coinList_obj
    console.log(this.$route.query.type)
    if (this.$route.query.type) {
      this.myData.coinSymbol = this.$route.query.type
      this.coinList.coinList.value = this.$route.query.type
      console.log(this.myData)
      this.accountTab()
    }
  },
  computed: {
    ...mapState({
      coinlist ({baseData: {_coinList}}) {
        if (_coinList) {
          this.noFirst = true
          return _coinList
        } else {
          return false
        }
      }
    }),
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
          placeholder: '',
          formType: 'select',
          name: 'coinList',
          value: '',
          optionList: list
        }
      }
    },
    Internationalization () {
      return {
        allsymbol: this.$t('fund.allsymbol') // 全部币种
      }
    }
  },
  watch: {
    'coinList_obj' (val) {
      this.coinList = val
    },
    noFirst (val) {
      val && this.accountTab()
    }
  },
  methods: {
    // 触动分页
    pagechange (page) {
      this.myData.page = page
      this.getList()
    },
    somethings (value) {
      if (value.name === 'coinList') {
        this.myData.coinSymbol = value.value.code
        this.accountTab()
      }
    },
    accountTab () {
      this.showLoading = true
      this.ajaxUrl = this.$store.state.url.fund.deposit_detail
      setTimeout(() => { this.getList() }, 300)
    },
    getList () {
      this.axios({
        url: this.ajaxUrl,
        headers: {},
        params: this.myData,
        method: 'post'
      }).then((data) => {
        if (data.code === '0') {
          this.showLoading = false
          // console.log(data)
          this.count = data.data.count
          // console.log(this.count)
          this.dataList = data.data.depositList
          for (let item in this.dataList) {
            let coinSymbol = this.dataList[item].symbol
            this.dataList[item].startDate = this._P.formatTime(this.dataList[item].startDate)
            this.dataList[item].expireDate = this._P.formatTime(this.dataList[item].expireDate)
            this.dataList[item].amount = this._P.fixD(this.dataList[item].amount, this.coinlist[coinSymbol].showPrecision)
            this.dataList[item].unlocked_amount = this._P.fixD(this.dataList[item].unlocked_amount, this.coinlist[coinSymbol].showPrecision)
          }
        } else {
          this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
        }
      })
    }
  }
}
</script>
