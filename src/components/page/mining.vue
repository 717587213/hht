<template>
  <div class="mining bg-color font-color" >
  <p v-if="!public_info"></p>
  <!-- 轮播 -->
    <div class="m-carousel">
      <div class="slide-img">
        <template v-if="sildePage.length > 1">
          <slider :pages="sildePage" :sliderinit="sliderinit" @tap='onTap'></slider>
        </template>
        <!-- 默认显示图片 -->
        <div v-else>
          <div v-if="sildePage.length === 1" v-html="sildePage[0].html"></div>
        </div>
      </div>
      <!-- 轮播end -->
    </div>
    <div class="m-content">
      <div class="noticeBox" >
         {{inviData.coin}}{{$t('mining.dig_out')}}<span>{{inviData.total_return_number}}<b> {{inviData.coin}}</b></span>
      </div> 
        <div class="recommend clearfix">
           <div class="recomm-content borderbox">
             <div class="content">
                <p class="title">{{$t('mining.distribution')}}</p>
                <span class="data">{{inviData.today_return_number}}<b> {{inviData.coin}}</b></span>
             </div>
           </div>
           <div class="recomm-content borderbox">
             <div class="content">
                <p class="title">{{$t('mining.dividend_income')}} </p>
                <span class="data">{{inviData.today_dividend_number}}<b> BTC</b></span>
             </div>
           </div>
           <div class="recomm-content borderbox">
             <div class="content">
                <p class="title">{{$t('mining.mining_output')}}</p>
                <span class="data">{{inviData.yesterday_return_number}}<b> {{inviData.coin}}</b></span>
             </div>
           </div>
           <div class="recomm-content borderbox">
             <div class="content">
                <p class="title">{{$t('mining.distribution_yesterday')}}</p>
                <span class="data">{{inviData.yesterday_dividend_number}}<b> BTC</b></span>
             </div>
           </div>
         </div>
         <!--分红数据 -->
         
         <div class="bonus" :class="{bonues:loading_entrust}">
            <div class="loading" v-if="loading_entrust">
                          <loading></loading>
                        </div>
             <div class="header">
               <ul>
                 <li @click="tabTog('mining')" :class="{findactive: tabTitle === 'mining'}"><span>{{$t('mining.mining_detail')}}</span></li>
                 <li @click="tabTog('income')" :class="{findactive: tabTitle === 'income'}"><span>{{$t('mining.amount_dividends')}}</span></li>
                 <li @click="tabTog('yestMining')"  :class="{findactive: tabTitle === 'yestMining'}"><span>{{$t('mining.bonus')}}</span></li>
              </ul>
            </div>
            <div class="bonus-box  front-color" :class="{bones:tabTitle=== 'mining' }">
                 <table>
                 <thead>
                    <tr class="noHover">
                      <th>{{$t('mining.time')}}</th>
                      <th>{{$t('mining.trader_volume')}}<b>BTC</b></th>
                      <th>{{$t('mining.Produce')}}<b>{{inviData.coin}}</b></th>
                      <th>{{$t('mining.state')}}</th>
                    </tr>
                 </thead>
                  <tbody v-if="inviData.return_list && inviData.return_list.length >0">
                    <tr v-for="(item, index) in inviData.return_list" :key="index" :class="{symboy_bgc: index % 2 === 0 }">
                        <td>{{item.dtime}}</td>
                        <td>{{item.return_number_btc}}</td>
                        <td>{{item.return_number}}</td>
                        <td>{{minin[item.status]}}</td>
                    </tr>
                    <tr class="pages">
                        <td colspan="4">
                            <v-pagination v-if="(inviDatas.count/inviDatas.display) > 1"
                                            :total="inviDatas.count"
                                            :current-page='inviDatas.page'
                                            :display='inviDatas.display'
                                             @pagechange="inviDatapage($event)">
                                </v-pagination>
                        </td></tr>
                  </tbody>
                 <tbody v-else>
                   <tr class="noHover"><td colspan="8" class="no_data">{{$t('user.questions.no_data')}}</td></tr>
                 </tbody>
              </table>
            </div>
             <div class="bonus-box  front-color" :class="{bones:tabTitle=== 'income' }">
                 <table>
                 <thead>
                    <tr class="noHover">
                      <th>{{$t('mining.coin')}}</th>
                      <th>{{$t('mining.platform')}}</th>
                      <th>{{$t('mining.divided')}}</th>
                    </tr>
                 </thead>
                  <tbody v-if="inviData.dividend_list&&inviData.dividend_list.length>0">
                    <tr v-for="(item, index) in inviData.dividend_list" :key="index" :class="{symboy_bgc: index % 2 === 0 }">
                        <td>{{item.coin}}</td>
                        <td>{{item.fee}}</td>
                        <td>{{item.dividend_number}}</td>
                    </tr>
                      <tr class="pages">
                        <td colspan="4">
                            <v-pagination v-if="(dividend.count/dividend.display) > 1"
                                            :total="dividend.count"
                                            :current-page='dividend.page'
                                            :display='dividend.display'
                                             @pagechange="dividendpage($event)">
                                </v-pagination>
                        </td></tr>
                  </tbody>

                 <tbody v-else>
                   <tr class="noHover"><td colspan="8" class="no_data">{{$t('user.questions.no_data')}}</td></tr>
                 </tbody>
              </table>
            </div>
             <div class="bonus-box  front-color" :class="{bones:tabTitle=== 'yestMining' }">
                 <table>
                 <thead>
                    <tr class="noHover">
                       <th>{{$t('mining.coin')}}</th>
                      <th>{{$t('mining.platform')}}</th>
                      <th>{{$t('mining.alreadyDivided')}}</th>
                    </tr>
                 </thead>
                  <tbody  v-if="inviData.yesterday_dividend_list && inviData.yesterday_dividend_list.length>0">
                    <tr v-for="(item, index) in inviData.yesterday_dividend_list" :key="index" :class="{symboy_bgc: index % 2 === 0 }">
                        <td>{{item.coin}}</td>
                        <td>{{item.fee}}</td>
                        <td>{{item.dividend_number}}</td>
                    </tr>
                      <tr class="pages">
                        <td colspan="4">
                            <v-pagination v-if="(dividends.count/dividends.display) > 1"
                                            :total="dividends.count"
                                            :current-page='dividends.page'
                                            :display='dividends.display'
                                             @pagechange="dividendsp($event)">
                                </v-pagination>
                        </td></tr>
                  </tbody>

                 <tbody v-else>
                   <tr class="noHover"><td colspan="8" class="no_data">{{$t('user.questions.no_data')}}</td></tr>
                 </tbody>
              </table>
            </div>
         </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import VPagination from '@/components/common/pagination'
import slider from 'vue-concise-slider'// 引入slider组件
import loading from '../common/loadingModel'

export default {
  name: 'm-main',
  components: {
    slider,
    VPagination,
    loading
  },
  data () {
    return {
      firstFlag: true,
      sildePage: [],
      isArr: [], // 轮播图数据
      mack: 0,   // 图片索引
      time: null, // 定时器
      notice: null,  // 公告
      sliderinit: {
        currentPage: 0,
        thresholdDistance: 500,
        thresholdTime: 100,
        autoplay: 10000,
        loop: true,
        infinite: 1,
        slidesToScroll: 1,
        timingFunction: 'ease',
        duration: 300
      },
      inviData: {},
      itemArray: [],
      tabTitle: 'mining',
      inviDatas: {
        count: 0,
        page: 1,
        display: 10
      },
      dividend: {
        count: 0,
        page: 1,
        display: 10
      },
      dividends: {
        count: 0,
        page: 1,
        display: 10
      },

      baseData: '',
      loading_entrust: false
    }
  },
  mounted () {
    this.getLundata()
  },
  computed: {
    ...mapState({
      public_info ({baseData}) {
        if (baseData.isReady && this.firstFlag) {
          this.baseData = baseData
          this.getInvition()
          this.firstFlag = false
          return baseData
        } else {
          return true
        }
      }
    }),
    minin () {
      return [
        this.$t('mining.replaced'),
        this.$t('mining.Return')

      ]
    }

  },
  watch: {
    // 监听 语言切换
    '$store.state.baseData._lan' (val, old) {
      // 重新请求轮播图
      if (old) {
        this.getLundata()
      }
    }
  },
  methods: {
    getLundata () {
      this.axios({
        url: this.$store.state.url.common.index_data,
        headers: {},
        params: {},
        method: 'post'
      }).then((data) => {
        if (data.code === '0') {
          this.notice = data.data.noticeInfo
          let res = data.data.cmsAdvertList
          this.isArr = []
          let arr = []
          for (let i = 0; i < res.length; i++) {
            let obj = {}
            obj.html = '<div><img src="' + res[i].imageUrl + '"></div>'
            arr.push(obj)
            this.isArr.push(res[i])
          }
          this.sildePage = arr
        } else {
          this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
        }
      })
    },
    tabTog (i) {
      this.tabTitle = i
      // this.getInvition()
    },
    onTap (data) {
      window.open(this.isArr[data.currentPage].httpUrl)
    },
    getInvition () {
      this.axios({
        url: this.$store.state.url.return.mining,
        headers: {},
        params: {
          page: this.inviDatas.page || this.dividend.page || this.dividends.page,
          pageSize: 10
        },
        method: 'post'
      }).then((data) => {
        if (data.code === '0') {
          this.loading_entrust = false
          let mindata = data.data
          mindata.total_return_number = this._P.fixD(mindata.total_return_number, this.baseData._coinList[mindata.coin].showPrecision)
          mindata.today_return_number = this._P.fixD(mindata.today_return_number, this.baseData._coinList[mindata.coin].showPrecision)
          mindata.today_dividend_number = this._P.fixD(mindata.today_dividend_number, this.baseData._coinList['BTC'].showPrecision)
          mindata.yesterday_return_number = this._P.fixD(mindata.yesterday_return_number, this.baseData._coinList[mindata.coin].showPrecision)
          mindata.yesterday_dividend_number = this._P.fixD(mindata.yesterday_dividend_number, this.baseData._coinList['BTC'].showPrecision)
          for (let i in mindata.return_list) {
            mindata.return_list[i].return_number_btc = this._P.fixD(mindata.return_list[i].return_number_btc, this.baseData._coinList['BTC'].showPrecision)
            mindata.return_list[i].return_number = this._P.fixD(mindata.return_list[i].return_number, this.baseData._coinList[mindata.coin].showPrecision)
            mindata.return_list[i].dtime = this._P.formatTime(mindata.return_list[i].dtime)
          }
          for (let iten in mindata.dividend_list) {
            mindata.dividend_list[iten].fee = this._P.fixD(mindata.dividend_list[iten].fee, this.baseData._coinList[mindata.dividend_list[iten].coin].showPrecision)
            mindata.dividend_list[iten].dividend_number = this._P.fixD(mindata.dividend_list[iten].dividend_number, this.baseData._coinList[mindata.dividend_list[iten].coin].showPrecision)
          }
          for (let iten in mindata.yesterday_dividend_list) {
            mindata.yesterday_dividend_list[iten].fee = this._P.fixD(mindata.yesterday_dividend_list[iten].fee, this.baseData._coinList[mindata.yesterday_dividend_list[iten].coin].showPrecision)
            mindata.yesterday_dividend_list[iten].dividend_number = this._P.fixD(mindata.yesterday_dividend_list[iten].dividend_number, this.baseData._coinList[mindata.yesterday_dividend_list[iten].coin].showPrecision)
          }
          this.inviDatas.count = mindata.return_count
          this.inviData = mindata
          this.$forceUpdate()
        } else {
          this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
        }
      })
    },
    inviDatapage (i) {
      this.inviDatas.page = i
      this.getInvition()
      this.loading_entrust = true
    },
    dividendpage (i) {
      this.dividend.page = i
      this.getInvition()
      this.loading_entrust = true
    },
    dividendsp (i) {
      this.loading_entrust = true
      this.getInvition()
      this.dividends.page = i
    }
  }
}
</script>