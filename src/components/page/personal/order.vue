<template>
  <div class="order">
      <div class="order-box bg-color font-color"> 
        <div class="order-content clearfix front-color">
            <div class="bgc-title ">
               <ul class="nav">
                  <li @click="ordtag('Venue')" :class='{oswitch:current == "Venue"}'>{{$t('user.order.venue')}}</li>
                  <!-- <li @click="ordtag('contract')" :class='{oswitch:current == "contract"}' v-if="this.symbols.contractOpen === '1'">合约帐户</li> -->
                  <li @click="ordtag('Outside')" :class='{oswitch:current == "Outside"}' v-if="this.symbols.otcOpen === '1'">{{$t('user.order.outside')}}</li>
                </ul>
                <div class="bgc-right clearfix " v-if="current === 'Venue'">
                    <div class="select-box">
                       <template >
                          <inline-input :property = "entrust" v-model = "entrust.value" v-on:onevents="setsymbol"></inline-input>
                      </template>
                    </div>
                      <ul>
                         <li v-for ="(item,index) in whole" :key="index" @click="whol(index)" class="choice" :class="{osw:who == index}">{{item}}</li>
                      </ul>  
                </div>
                <div class="bgc-right clearfix " v-if="current == 'Outside'">
                    <div class="select-box">
                      <template >
                          <inline-input :property = "otc_order" 
                          v-model = "otc_order.value"
                          v-on:onevents="coinsym">
                          </inline-input>
                      </template>
                    </div>
              
                </div>
             </div>
             <!-- 交易账户 -->
              <template>
                <!-- 全部委托 -->
                    <div class="venue"  :class="{exhibition: current === 'Venue' }">
                      <div class="venue-box">
                           <div class="venue-title">
                          <span>{{$t('user.order.trans_account.currentEntru')}}</span>
                            <i @click="curren(state)" > {{state}} &gt;</i>
                        </div>
                         <div class="loading" v-if="loading_entrust">
                          <loading></loading>
                        </div>
                        <div v-show="isshow" v-else>
                        <div v-if="entrust_list.length > 0"> 
                        <table>
                          <thead>
                            <tr>
                              <th v-for="(item,index) in current_title" :key="index" class="thead-color">{{item}}</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(item,index) in entrust_list" :key="index">
                              <td class="time">{{item.created_at}}</td>
                              <td @click="transaction(item.pair)">{{item.pair}}</td>
                              <td class="directions" :class="{direction:item.side === 'BUY'}">{{item.side_text}}</td>
                              <td >{{item.price}}&nbsp;{{item.countCoin}}</td>
                              <td>{{item.volume}}&nbsp;{{item.baseCoin}}</td>
                              <td>{{item.deal_volume}}&nbsp;{{item.baseCoin}}</td>
                              <td>{{item.status_text}}</td>
                              <td @click="revoke(item)" class="revokes">{{$t(('user.order.trans_account.revoke'))}}</td>
                            </tr>
                          </tbody>
                        
                        </table>
                         <!-- 当前委托分页 -->
                         <Vpagination v-if="(currtion.count/currtion.pageSize) > 1"
                              :total="currtion.count"
                              :current-page='currtion.page'
                              :display='currtion.pageSize'
                              @pagechange="currchange($event)" class="page">
                        </Vpagination>
                        </div>
                        <div v-else-if="entrust_list.length <= 0">
                        <table class="no_record">
                          <tbody>
                            <tr >
                              <td id="record">{{$t('user.order.no_record')}}</td>
                            </tr>
                          </tbody>
                        
                        </table>
                        </div>
                        </div>
                       
                        </div>
                <!-- 历史委托 -->
                      <div class="venue-box">
                        <div class="venue-title" >
                          <span>{{$t('user.order.trans_account.historyEntru')}}</span>
                            <i @click="history(date)" >{{date}} &gt;</i>
                            <label class="error"><input type="checkbox" v-model="shies">{{$t('user.order.shield')}}</label>
                        </div>
                        <div class="loading" v-if="loading_history">
                          <loading></loading>
                        </div>
                        <div v-show="ishow" v-else>
                        <div  v-if="entrust_history.length > 0">
                          <table>
                          <thead>
                            <tr>
                              <th v-for="(item,index) in history_title" :key="index" class="thead-color">{{item}}</th>
                            </tr>
                          </thead>
                          <tbody v-for="(item,index) in entrust_history" :key="index">
                            <tr>
                              <td class="time">{{item.created_at}}</td>
                              <td @click="transaction(item.pair)">{{item.pair}}</td>
                              <td class="directions" :class="{direction:item.side === 'BUY'}">{{item.side_text}}</td>
                              <td>{{item.price}}&nbsp;{{item.countCoin}}</td>
                              <td>{{item.volume}}&nbsp;{{item.baseCoin}}</td>
                              <td>{{item.avg_price}}&nbsp;{{item.countCoin}}</td>
                              <td>{{item.status_text}}</td>
                              <td @click="details(item)" class="detai" v-if="item.status !== 4">{{$t('user.order.trans_account.details')}}</td>
                              <td v-else></td>
                            </tr> 
                            <tr v-show="item.tradeOpen">
                              <td colspan="8" class="">
                                       <div class="loadings" v-if="loading_details">
                          <loading></loading>
                        </div>
                                <div v-else>  
                                   <table class="details"   :class="{detailbot: trad_list.length < detai.pageSize}">
                                    <div class="up-arrow"></div>
                                  <thead>
                                    <tr>
                                      <th v-for="(item,index) in history_details" :key="index" class="thead-color">{{item}}</th>
                                    </tr>
                                  </thead>
                                   <tbody>
                            <tr v-for="(v,k) in trad_list" :key="k" class="font-color">
                              <td class="time">{{v.ctime}}</td>
                              <td>{{v.price}}</td>
                              <td>{{v.volume}}</td>
                              <td>{{v.deal_price}}</td>
                              <td>{{v.fee}}</td>
                            </tr>
                          </tbody>
                                </table>
                              <Vpagination v-if="(detai.count/detai.pageSize) > 1"
                              :total="detai.count"
                              :current-page='detai.page'
                              :display='detai.pageSize'
                              @pagechange="hichange($event, item)" >
                        </Vpagination>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                          
                        </table>
                        <!-- 历史委托分页 -->
                         <Vpagination v-if="(histion.count/histion.pageSize) > 1"
                              :total="histion.count"
                              :current-page='histion.page'
                              :display='histion.pageSize'
                              @pagechange="hischange($event)" class="page">
                        </Vpagination>
                        </div>
                         <div v-else-if="entrust_history.length <= 0">
                        <table class="no_record">
                          <tbody>
                            <tr >
                              <td id="record">{{$t('user.order.no_record')}}</td>
                            </tr>
                          </tbody>
                        
                        </table>
                        </div>
                      </div>
                      </div>
                    </div>
            </template>
            <!-- 合约 -->
            <!-- <div class="venue" :class="{exhibition: current === 'contract' }"><co-order/></div> -->
            <!-- 场外账户 -->
            <template>
              <div class="outside" :class="{exhibition: current === 'Outside' }">
                <!--未完成订单  -->
                <div class="outside-box">
                      <div class="outside-title">
                        <span>{{$t('user.order.otc_account.unfinished')}}</span>
                          <i @click="curren(state)"> {{state}} &gt;</i>
                      </div>
                      <div class="loading" v-if="loading_otc">
                          <loading></loading>
                        </div>
                      <div v-show="isshow" v-else>
                        <div v-if="otc_unfinished.length > 0">
                        <table >
                        <thead>
                            <tr>
                              <th v-for="(item,index) in otc_title" :key="index" class="thead-color">{{item}}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item,index) in otc_unfinished" :key="index">
                              <td>{{item.adsId}}</td>
                              <td>{{item.sequence}}</td>
                              <td>{{item.coinSymbol}}</td>
                              <td class="directions" :class="{direction:item.side === 'BUY'}">{{item.type}}</td>
                              <td>{{item.price}}</td>
                              <td>{{item.totalPrice}}</td>
                              <td>{{item.volume}}</td>
                              <td>{{item.nickName}}</td>
                              <td>{{item.status_text}}</td>
                              <td>
                                <template v-if="siteType.indexOf('otc') !== -1">
                                  <router-link :to="{path: '/otc_order', query:{orderId: item.sequence}}">   
                                    {{$t('user.order.otc_account.watch')}}
                                  </router-link>
                                </template>
                                <template v-else>
                                  <a href="javascript:;" @click="goOrderView(item.sequence)">
                                    {{$t('user.order.otc_account.watch')}}
                                  </a>
                                </template>
                              </td>

                            </tr>
                        </tbody>
                      </table>
                      <Vpagination v-if="(otcstion.count/otcstion.pageSize) > 1"
                              :total="otcstion.count"
                              :current-page='otcstion.page'
                              :display='otcstion.pageSize'
                              @pagechange="otcschage($event)" class="page">
                        </Vpagination>
                      </div>
                        <div v-else-if="otc_unfinished.length <= 0">
                        <table class="no_record">
                          <tbody>
                            <tr >
                              <td id="record">{{$t('user.order.no_record')}}</td>
                            </tr>
                          </tbody>
                        
                        </table>
                        </div>
                      </div>
                      
                    </div> 
                    <!-- 已完成订单 -->
                    <div class="outside-box">
                      <div class="outside-title">
                        <span>{{$t('user.order.otc_account.completed')}}</span>
                          <i @click="history(date)"> {{date}} &gt;</i>
                          <label class="error"><input type="checkbox" v-model="otcshie">{{$t('user.order.shield')}}</label>
                      </div>
                      <div class="loading" v-if="loading_complete">
                          <loading></loading>
                        </div>
                      <div v-show="ishow" v-else>
                        <div v-if="otc_complete.length > 0">
                        <table >
                        <thead>
                            <tr>
                              <th v-for="(item,index) in otc_title" :key="index" class="thead-color">{{item}}</th>
                            </tr>
                        </thead>
                        <tbody>
                             <tr v-for="(item,index) in otc_complete" :key="index">
                              <td>{{item.adsId}}</td>
                              <td>{{item.sequence}}</td>
                              <td>{{item.coinSymbol}}</td>
                              <td class="directions" :class="{direction:item.side === 'BUY'}">{{item.type}}</td>
                              <td>{{item.price}}</td>
                              <td>{{item.totalPrice}}</td>
                              <td>{{item.volume}}</td>
                              <td>{{item.nickName}}</td>
                              <td>{{item.status_text}}</td>
                              <td>
                                <template v-if="siteType.indexOf('otc') !== -1">
                                  <router-link :to="{path: '/otc_order', query:{orderId: item.sequence}}">   
                                    {{$t('user.order.otc_account.watch')}}
                                  </router-link>
                                </template>
                                <template v-else>
                                  <a href="javascript:;" @click="goOrderView(item.sequence)"> 
                                    {{$t('user.order.otc_account.watch')}}
                                  </a>
                                </template>
                              </td>
                             </tr>
                        </tbody>
                        
                      </table>
                      <Vpagination v-if="(otcside.count/otcside.pageSize) > 1"
                              :total="otcside.count"
                              :current-page='otcside.page'
                              :display='otcside.pageSize'
                              @pagechange="otcsidechage($event)" class="page">
                        </Vpagination>
                        </div>
                         <div v-else-if="otc_complete.length <= 0">
                        <table class="no_record">
                          <tbody>
                            <tr >
                              <td id="record">{{$t('user.order.no_record')}}</td>
                            </tr>
                          </tbody>
                        
                        </table>
                        </div>
                      </div>
                      
                    </div> 
                  </div>
              </template>
       </div>
   </div>
  </div>
</template>

<script lang="js">
import { mapState } from 'vuex'
import InlineInput from '@/components/common/inlineInput'
import Vpagination from '@/components/common/pagination'
import loading from '../../common/loadingModel'
// import coOrder from './co_order'
export default {
  name: 'order',
  props: [],
  components: {
    InlineInput,
    Vpagination,
    loading
  },
  data () {
    return {
      loading_entrust: false, // 当前委托
      loading_history: false, // 历史委托
      loading_complete: false, // 场外已完成
      loading_otc: false,
      loading_details: false,
        // 默认显示交易账户
      current: 'Venue', // contract Venue
      screen: true,
      // 交易账户下拉框
      entrust: {
        formType: 'select',
        name: 'enterust',
        value: null,
        placeholder: '',
        optionList: []
      },
      // 场外订单下拉框
      otc_order: {
        formType: 'select',
        name: 'otc_order',
        value: null,
        placeholder: 'USDT',
        optionList: []
      },
      state: {},
      isshow: true,
      date: {},
      ishow: true,
      who: 2,
      side: '',
      entrust_list: '',     // 当前委托数据
      entrust_history: '',  // 历史委托数据
      otc_unfinished: '',       // 场外未完成数据
      otc_complete: '',     // 已完成数据
      otcshie: 0,          // 场外账户屏蔽撤单
      shies: 0,         // 交易账户屏蔽撤单
      shie: 0,
      OrderId: null,
      coin_pair: '',        // 币对
      coin_seed: '',        // 币种
      trad_list: '',         // 详情数据
      coin: '',
      // 场外账户自定义精度
      otction: {
        volumeFix: 8,
        priceFix: 2
      },
      // 当前委托分页
      currtion: {
        count: '',
        pageSize: 10,
        page: 1
      },
      // 历史委托分页
      histion: {
        count: '',
        pageSize: 10,
        page: 1
      },
      // 未完成订单分页
      otcstion: {
        count: '',
        pageSize: 10,
        page: 1
      },
      // 已完成订单分页
      otcside: {
        count: '',
        pageSize: 10,
        page: 1
      },
      // 详情分页
      detai: {
        count: '',
        pageSize: 10,
        page: 1
      },
      siteType: [],
      webSiteInfo: null,
      noFirst: false
    }
  },
  mounted () {
    this._P.fixUrl('type') && (this.current = this._P.fixUrl('type'))
    this._P.fixUrl('coin') && (this.coin = this._P.fixUrl('coin'))
    this.entrust.optionList = this.option
    this.otc_order.optionList = this.currens
    this.state = this.state_obj
    this.date = this.date_obj
    this.noFirst && this.ordtag(this.current)
    if (this.siteType[0] === 'otc') {
      this.current = 'Outside'
    }
  },
  watch: {
    'state_obj' (val) {
      this.state = val
    },
    noFirst (val) {
      val && this.ordtag(this.current)
    },
    'date_obj' (val) {
      this.date = val
    },
    'option' (val) {
      this.entrust.optionList = val
    },
    'currens' (val) {
      this.otc_order.optionList = val
    },
    '$store.state.baseData._lan' (val) {
      this.currentData()
      this.historyData()
      this.complete_otc()
      this.details_data()
      this.unfinished_otc()
    },
    shies (val) {
      this.shield()
    },
    otcshie () {
      this.otcshields()
    }
  },

  computed: {
    ...mapState({
      symbols ({baseData}) {
        if (baseData.isReady) {
          this.noFirst = true
          this.siteType = baseData._siteType
          this.webSiteInfo = baseData._webSiteInfo
          return baseData
        } else {
          return false
        }
      }
    }),
    whole () {
      return [
        this.$t('user.order.buy'),
        this.$t('user.order.sell'),
        this.$t('user.order.whole')
      ]
    },
    state_obj () {
      return this.$t('user.order.take_up')
    },
    date_obj () {
      return this.$t('user.order.take_up')
    },
    // 当前委托
    current_title () {
      return [
        this.$t('user.order.trans_account.time'),
        this.$t('user.order.trans_account.transaction'),
        this.$t('user.order.trans_account.direction'),
        this.$t('user.order.trans_account.price'),
        this.$t('user.order.trans_account.number'),
        this.$t('user.order.trans_account.done_deal'),
        this.$t('user.order.trans_account.no_deal'),
        this.$t('user.order.trans_account.operation')
      ]
    },
    // 历史委托
    history_title () {
      return [
        this.$t('user.order.trans_account.time'),
        this.$t('user.order.trans_account.transaction'),
        this.$t('user.order.trans_account.direction'),
        this.$t('user.order.trans_account.price'),
        this.$t('user.order.trans_account.number'),
        this.$t('user.order.trans_account.deal_average_price'),
        this.$t('user.order.trans_account.state'),
        this.$t('user.order.trans_account.operation')

      ]
    },
    // 历史委托详情
    history_details () {
      return [
        this.$t('user.order.trans_account.time'),
        this.$t('user.order.trans_account.deal_price'),
        this.$t('user.order.trans_account.number'),
        this.$t('user.order.trans_account.deal_forehead'),
        this.$t('user.order.trans_account.service_charge')
      ]
    },
    // 场外账户
    otc_title () {
      return [
        this.$t('user.order.otc_account.advertId'),
        this.$t('user.order.otc_account.order_number'),
        this.$t('user.order.otc_account.currency'),
        this.$t('user.order.otc_account.type'),
        this.$t('user.order.otc_account.price'),
        this.$t('user.order.otc_account.turnover'),
        this.$t('user.order.otc_account.trading_capacity'),
        this.$t('user.order.otc_account.deal_party'),
        this.$t('user.order.otc_account.deal_state'),
        this.$t('user.order.otc_account.operation')
      ]
    },
    option () {
      let arr = []
      let symbol = this.symbols._symbols
      if (!symbol) return false
      for (let k in symbol) {
        if (k !== 'myMarket') {
          for (let a in symbol[k]) {
            let obj = {}
            obj.code = symbol[k][a].symbol
            obj.value = symbol[k][a].name
            arr.push(obj)
          }
        }
      }
      if (this.coin) {
        let _this = this
        this.otc_order.value = this.coin
        this.loading_complete = true
        this.loading_otc = true
        this.entrust.value = arr[0].code
        setTimeout(function () {
          _this.complete_otc()
          _this.unfinished_otc()
        }, 500)
      } else {
        this.entrust.value = arr[0].code
        this.otc_order.value = this.currens[0].code
      }
      return arr
    },
    currens () {
      let arr = [{code: null, value: '全部币种'}]
      let curr = this.symbols._coinList
      for (let i in curr) {
        if (curr[i].otcOpen === 1) {
          let obj = {}
          obj.code = curr[i].name
          obj.value = curr[i].name
          arr.push(obj)
        }
      }
      return arr
    },
    sell () {
      return this.$t('otc.search.sell')
    },
    buy () {
      return this.$t('otc.search.buy')
    },
    sells () {
      return this.$t('user.order.trans_account.sell')
    },
    buys () {
      return this.$t('user.order.trans_account.buy')
    }
  },
  methods: {
    gotuOrder (id) {
      this.$router.push({name: 'otcOrder', query: { orderId: id }})
    },
    goOrderView (id) {
      window.location.href = location.protocol + '//' + this.webSiteInfo.otc_pc_url + '/otc_order?orderId=' + id
    },
    ordtag (tag) {
      this.loading_entrust = true
      this.loading_complete = true
      this.loading_history = true
      this.loading_otc = true
      this.current = tag
      let _this = this
      if (tag === 'Venue') {
        this.screen = true
        setTimeout(function () {
          _this.currentData()
          _this.historyData()
        }, 500)
      } else {
        this.screen = false
        setTimeout(function () {
          _this.complete_otc()
          _this.unfinished_otc()
        }, 500)
      }
    },
    curren (i) {
      if (i === this.$t('user.order.take_up')) {
        this.isshow = false
        this.state = this.$t('user.order.open')
      } else {
        this.isshow = true
        this.state = this.$t('user.order.take_up')
      }
    },
    history (i) {
      if (i === this.$t('user.order.take_up')) {
        this.ishow = false
        this.date = this.$t('user.order.open')
      } else {
        this.ishow = true
        this.date = this.$t('user.order.take_up')
      }
    },
    whol (index) {
      this.loading_entrust = true
      this.loading_history = true
      this.who = index
      let _this = this
      if (index === 0) {
        this.side = 'BUY'
      } else if (index === 1) {
        this.side = 'SELL'
      } else if (index === 2) {
        this.side = ''
      }
      setTimeout(function () {
        _this.currentData() // 当前委托数据
        _this.historyData() // 历史委托数据
        _this.currchange()  // 当前委托分页
        _this.hischange()   // 历史委托分页
      }, 500)
    },
     // 屏蔽撤单
    shield () {
      this.histion.page = 1
      // this.shies = this.shies ? 0 : 1
      this.historyData()
    },
    // 场外账户屏蔽撤单
    otcshields () {
      this.otcside.page = 1
      // this.otcshie = this.otcshie ? 0 : 1
      this.complete_otc()
    },
      // 当前委托-分页
    currchange (page) {
      this.loading_entrust = true
      this.loading_otc = true
      let _this = this
      this.currtion.page = page
      setTimeout(function () {
        _this.currentData()
      }, 500)
    },
    // 历史委托分页
    hischange (page) {
      this.loading_history = true
      let _this = this
      this.histion.page = page
      setTimeout(function () {
        _this.historyData()
      }, 500)
    },
    // 场外账户-未完成订单-分页
    otcschage (page) {
      this.loading_otc = true
      let _this = this
      this.otcstion.page = page
      setTimeout(function () {
        _this.unfinished_otc()
      }, 500)
    },
     // 场外账户-完成订单-分页
    otcsidechage (page) {
      this.loading_complete = true
      let _this = this
      this.otcside.page = page
      setTimeout(function () {
        _this.complete_otc()
      }, 500)
    },
    // 详情分页
    hichange (page, i) {
      this.detai.page = page
      this.loading_details = true
      let _this = this
      if (i) {
        setTimeout(function () {
          _this.details_data(i)
        }, 500)
        i.tradeOpen = true
      }
    },
    // 详情
    details (item) {
      let _this = this
      setTimeout(function () {
        _this.details_data(item)
      }, 500)
      this.loading_details = true
      this.entrust_history.map((Oitem) => {
        if (Oitem === item) {
          Oitem.tradeOpen = !Oitem.tradeOpen
          this.OrderId = Oitem.tradeOpen ? Oitem.id : ''
        } else {
          Oitem.tradeOpen = false
        }
      })
    },
        // 币对
    setsymbol (s) {
      if (s.handleType === 'selected') {
        this.coin_pair = s.value.code
        this.loading_entrust = true
        this.loading_history = true
        let _this = this
        setTimeout(function () {
          _this.currentData()
          _this.historyData()
          _this.currchange()
          _this.hischange()
        }, 500)
        this.hichange()
      }
    },
    // 币种
    coinsym (i) {
      if (i.handleType === 'selected') {
        this.coin_seed = i.value.code
        this.loading_complete = true
        this.loading_otc = true
        let _this = this
        setTimeout(function () {
          _this.unfinished_otc() // 场外未完成订单
          _this.complete_otc()   // 场外已完成订单
          _this.otcschage()      // 场外完成订单分页
          _this.otcsidechage()   // 场外已完成订单分页
        }, 500)
      }
    },
    // 当前委托数据
    currentData () {
      this.axios({
        url: this.$store.state.url.personal.entrust_current,
        params: {
          side: this.side,
          symbol: this.coin_pair || this.entrust.value,
          page: this.currtion.page,
          pageSize: this.currtion.pageSize
        },
        method: 'post'
      }).then((data) => {
        if (data.code === '0') {
          this.loading_entrust = false
          this.entrust_list = this.currVenue(data.data.orderList)
          this.currtion.count = data.data.count
          let entrust = data.data.orderList
          for (let i in entrust) {
            if (entrust[i].side === 'SELL') {
              entrust[i].side_text = this.sells
            } else {
              entrust[i].side_text = this.buys
            }
          }
          // console.log(data.data)
        } else {
          this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
        }
      })
    },
    // 历史委托数据
    historyData () {
      this.axios({
        url: this.$store.state.url.personal.entrust_history,
        params: {
          side: this.side,
          page: this.histion.page,
          pageSize: this.histion.pageSize,
          symbol: this.coin_pair || this.entrust.value,
          isShowCanceled: this.shies && 1
        },
        method: 'post'
      }).then((data) => {
        if (data.code === '0') {
          this.loading_history = false
          this.entrust_history = this.currVenue(data.data.orderList)
          this.histion.count = data.data.count
        } else {
          this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
        }
      })
    },
    // 场外账户-已完成订单
    complete_otc () {
      this.axios({
        url: this.$store.state.url.personal.otc_order_complete,
        params: {
          page: this.otcside.page,
          pageSize: this.otcside.pageSize,
          coinSymbol: this.coin_seed || this.otc_order.value,
          isShowCanceled: this.otcshie && 1
        },
        method: 'post'
      }).then((data) => {
        if (data.code === '0') {
          this.loading_complete = false
          this.otc_complete = this.currOtc(data.data.orderList)
          this.otcside.count = data.data.count
          let otcdata = data.data.orderList
          for (let i in otcdata) {
            if (otcdata[i].side === 'SELL') {
              otcdata[i].type = this.sell
            } else {
              otcdata[i].type = this.buy
            }
          }
        } else {
          this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
        }
      })
    },
    // 场外账户-未完成订单
    unfinished_otc (i) {
      this.axios({
        url: this.$store.state.url.personal.otc_order_unfinished,
        params: {
          page: this.otcstion.page,
          pageSize: this.otcstion.pageSize,
          coinSymbol: this.coin_seed || this.otc_order.value
        },
        method: 'post'
      }).then((data) => {
        if (data.code === '0') {
          this.loading_otc = false
          this.otc_unfinished = this.currOtc(data.data.orderList)
          this.otcstion.count = data.data.count
          let otcdata = data.data.orderList
          for (let i in otcdata) {
            if (otcdata[i].side === 'SELL') {
              otcdata[i].type = this.sell
            } else {
              otcdata[i].type = this.buy
            }
          }
        } else {
          this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
        }
      })
    },
    // 精度计算-交易账户
    currVenue (res) {
      if (res) {
        for (let i = 0; i < res.length; i++) {
        // 获取币对
          let count = res[i].countCoin
          let base = res[i].baseCoin
          let symbol = base + '/' + count
          res[i].pair = symbol
          let accuracy = this.symbols._symbols[count][symbol]
          res[i].created_at = this._P.formatTime(res[i].time_long)
          res[i].total_price = this._P.fixD(res[i].total_price, accuracy.price)
          res[i].avg_price = this._P.fixD(res[i].avg_price, accuracy.price)
          res[i].deal_volume = this._P.fixD(res[i].deal_volume, accuracy.volume)
          // res[i].price = this._P.fixD(res[i].price, accuracy.price)
          res[i].price = res[i].type === 2 ? this.$t('trade.marketPrice') : this._P.fixD(res[i].price, accuracy.price)
          res[i].remain_volume = this._P.fixD(res[i].remain_volume, accuracy.volume)
          res[i].volume = this._P.fixD(res[i].volume, accuracy.volume)
          if (res[i].id === this.OrderId) {
            res[i].tradeOpen = true
          } else {
            res[i].tradeOpen = false
          }
        }
        return res
      } else {
        return res
      }
    },
    // 场外账户-精度计算
    currOtc (data) {
      if (data) {
        for (let i = 0; i < data.length; i++) {
          data[i].coinSymbol = data[i].coinSymbol.toUpperCase()
          // data[i].price = this._P.fixD(data[i].price, this.otction.priceFix)
          // data[i].totalPrice = this._P.fixD(data[i].totalPrice, this.otction.priceFix)
          data[i].volume = this._P.fixD(data[i].volume, this.symbols._coinList[data[i].coinSymbol].showPrecision)
        }
        return data
      }
    },
    // 撤销
    revoke (i) {
      let data = i.pair
      let res = data.replace('/', '').toLowerCase()
      this.axios({
        url: this.$store.state.url.cointran.order_cancel,
        params: {
          orderId: i.id,
          symbol: res
        },
        method: 'post'
      }).then((data) => {
        if (data.code === '0') {
          this.$store.dispatch('setTipState', this.$t('user.order.revo_success'))
          this.currentData()
          this.historyData()
        } else {
          this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
        }
      })
    },
    // 历史委托详情
    details_data (item) {
      if (item) {
        let res = item.pair.replace('/', '').toLowerCase()
        this.axios({
          url: this.$store.state.url.personal.list_by_order,
          params: {
            order_id: item.id,
            symbol: res,
            page: this.detai.page,
            pageSize: this.detai.pageSize
          },
          method: 'post'
        }).then((data) => {
          if (data.code === '0') {
            this.loading_details = false
            // 总页数
            this.detai.count = data.data.count
            let tradeList = data.data.trade_list
            // 币种
            let count = item.countCoin
            // 精度
            let accuracy = this.symbols._symbols[count][item.pair]
            // 精度计算
            for (let i in tradeList) {
              tradeList[i].deal_price = this._P.fixD(tradeList[i].deal_price, accuracy.price)
              tradeList[i].deal_price = this._P.fixD(tradeList[i].deal_price, accuracy.price)
              tradeList[i].fee = this._P.fixD(tradeList[i].fee, accuracy.price)
              // tradeList[i].price = this._P.fixD(tradeList[i].price, accuracy.price)
              tradeList[i].price = tradeList[i].type === 2 ? this.$t('trade.marketPrice') : this._P.fixD(tradeList[i].price, accuracy.price)
              tradeList[i].volume = this._P.fixD(tradeList[i].volume, accuracy.volume)
              if (tradeList[i].side === 'SELL') {
                tradeList[i].type = this.sell
              } else {
                tradeList[i].type = this.buy
              }
            }
            this.trad_list = tradeList
          } else {
            this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
          }
        })
      }
    },
    transaction (item) {
      localStorage.setItem('sSymbolName', item)
      this.$router.push({ name: 'coinTran' })
    }
  }
}
</script>

<style lang="stylus" scoped >
</style>

