<template>
     <div>
     <!-- 推荐区 -->
     <div class="recommend clearfix">
      <div class="main-content">
        <div v-if="JSON.stringify(symbolTop) == '{}'">
          <div v-for="item in 5" class="recomm-content"></div>
        </div>
        <div class="recomm-content" v-for="(item, index) in symbolTop" :key="index">
          <dl class="hot-box clearfix">
            <dt class="portrait" @click="getUid(item.userId)">
              <img :src="item.imageUrl" alt="" v-if="item.imageUrl">
              <img src="@/assets/img/otc/portrait.png" alt="" v-else>
              <i v-if="item.loginStatus=== 1"></i>
            </dt>
            <dd class="nickname" @click="getUid(item.userId)">
              {{item.otcNickName}}
              <span class="sellColor" v-if="item.side === 'SELL'">({{$t('otc.index.sell')}})</span>
              <span class="buyColor" v-if="item.side === 'BUY'">({{$t('otc.index.buy')}})</span>
            </dd>
            <dd class="price"><span>{{$t('otc.index.volume')}}</span>{{item.volumeBalance}} {{item.coin}}</dd>
             <dd class="price"><span>{{$t('otc.index.price')}}</span>{{item.price}} {{item.payCoin}}</dd>
             <dd class="progress">{{$t('otc.index.progress')}}{{item.creditGrade}}% </dd>
             <dd class="turnov" @click="busin(item.advertId, item.userId)">{{$t('otc.index.tradeButton')}}</dd>
          </dl>
        </div>
      </div>
     </div>
     <!--币对市场-->
     <div class="main-content market front-color">
        <div class="header">
           <ul>
             <li v-for="(item,index) in market" :key="index"  @click="switchMarket(item)" class="coin_currency" :class='{findactive:switchs=== item.name  }'>
              <span> <img :src="item.icon" alt="" v-if="item.icon">
               <img src="@/assets/img/coindef.png" v-else> {{item.name}}</span> 
            </li>
            <li class="header-more">
              <router-link to="/adsHall" >{{$t('otc.index.more')}}</router-link>
            </li>
          </ul>
        </div>
        <div class="mark-box">
        <!-- <p style="display: none">{{aaa}}</p> -->
        <table>
             <thead>
                <tr class="noHover">
                  <th class="payment">{{$t('otc.index.business')}}</th>
                  <th > <!-- class="clickpointer" -->
                    {{$t('otc.index.buy')}} / {{$t('otc.index.sell')}}
                  </th>
                  <th @click="marketSort('close')" class="clickpointer">
                    {{$t('otc.index.number')}}&nbsp;({{switchs}})
                    <span class="receet"> 
                      <i class="sorte up  iconNoFont-sup" :class="{cur: sortType === 'down'}"></i>   
                      <i class="sorte down iconNoFont-sdow"  :class="{cur: sortType === 'up'}"></i>
                    </span>
                  </th>
                  <th>{{$t('otc.index.quota')}}</th>
                  <th @click="marketSor('rose')" class="clickpointer">
                    {{$t('otc.index.priceName')}}
                    <span class="receet"> 
                      <i class="sorte up iconNoFont-sup" :class="{curr: sortType === 'dow'}"></i>   
                      <i class="sorte down iconNoFont-sdow" :class="{curr: sortType === 'ups'}"></i>
                    </span>
                  </th>
                  <th class="payment">{{$t('otc.index.payment')}}</th>
                  <th>{{$t('otc.index.link')}}</th>
                </tr>
             </thead>
              <tbody v-if="otc_list">
                <tr v-for="(item,index) in otc_list.slice(0, 20)" :key="index"  :class="{symboy_bgc: index % 2 === 0 }">
                  <td class="payment">
                    <span @click="getUid(item.userId)" class="pointer">
                      <img :src="item.imageUrl" width="20" height="20" alt="" v-if="item.imageUrl">
                      <img src="@/assets/img/otc/portrait.png" width="20" height="20" alt="" v-else>
                      {{item.otcNickName}}
                    </span>
                  </td>
                  <td>
                    <span class="sellColor" v-if="item.side === 'SELL'">{{$t('otc.index.sell')}}</span>
                    <span class="buyColor" v-if="item.side === 'BUY'">{{$t('otc.index.buy')}}</span>
                  </td>
                  <td>{{item.volumeBalance}}&nbsp;/&nbsp;{{item.volume}}</td>
                  <td> {{item.minTrade}} - {{item.maxTrade}}&nbsp;({{item.payCoin}})</td>
                  <td>{{item.price}}&nbsp;({{item.payCoin}})</td>
                  <td class="payment">
                    <span v-for="(ider,index) in item.payments" :key="index"><img :src="ider.icon" width="18" height="18"  alt=""></span>
                  </td>
                  <td>
                    <span class="turnov" @click="busin(item.advertId, item.userId)">{{$t('otc.index.tradeButton')}}</span>
                  </td>
                </tr>
              </tbody>
             <tbody v-else>
               <tr class="noHover"><td colspan="8" class="no_data">{{contentText.nodeDataText}}</td></tr>
             </tbody>
          </table>
        </div>
     </div>
      <p v-if="!publicInfo"></p>
      <p v-if="otc_public"></p>
    </div>
</template>
<script>
import { mapState } from 'vuex'
import slider from 'vue-concise-slider'// 引入slider组件
export default {
  name: 'otc_home',
  components: {
    slider
  },
  data () {
    return {
      nootc: false,
      noFirst: false,
      symbolTop: {},    // 推荐区数据
      switchs: null,
      sortName: null,
      sortType: null,
      payCoin: '',
      currencys: [],
      market: JSON.parse(localStorage.getItem('otc')) || null,
      otc_list: []

    }
  },
  computed: {
    ...mapState({
      publicInfo ({baseData}) {
        if (baseData.isReady) {
          this.noFirst = true
          this.public_info = baseData
          this.getLundata()
          this.getcurrency()
          return true
        } else {
          return false
        }
      },
      otc_public ({otcData}) {
        if (otcData.isData) {
          this.switchs = localStorage.getItem('otc_currency') || otcData.defaultCoin
          this.nootc = true
          return true
        } else {
          return false
        }
      },
      contentText () {
        return {
          nodeDataText: this.$t('main.loading_ing')
        }
      }
    })
  },
  watch: {
    nootc (val) {
      val && this.adsList()
    }
  },
  methods: {
    getUid (uid) {
      this.$router.push({name: 'otc_personal', query: { uId: uid }})
    },
    busin (aid, uid) {
      this.$router.push({name: 'busines_mesage', query: { aId: aid, uId: uid }})
    },
    getLundata () {
      this.axios({
        url: this.$store.state.otcUrl.common.otc_home,
        headers: {},
        params: {},
        hostType: 'otc',
        method: 'post'
      }).then((data) => {
        if (data.code === '0') {
          let advertMapList = data.data.advertMapList
          for (let i = 0; i < advertMapList.length; i++) {
            advertMapList[i].loginStatus = advertMapList[i].loginStatus
            advertMapList[i].creditGrade = this._P.fixD(advertMapList[i].creditGrade * 100, 2)
            advertMapList[i].price = this._P.fixD(advertMapList[i].price, 2)
            advertMapList[i].coin = advertMapList[i].coin.toUpperCase()
            advertMapList[i].payCoin = advertMapList[i].payCoin.toUpperCase()
            advertMapList[i].volumeBalance = this._P.fixD(advertMapList[i].volumeBalance, this.public_info._coinList[advertMapList[i].coin].showPrecision)
          }
          this.symbolTop = advertMapList
        } else {
          this.$store.dispatch('setTipState', {text: this.$t('error.' + data.code), type: 'error'})
        }
      })
    },
    onTap (data) {
      window.open(this.isArr[data.currentPage].httpUrl)
    },
    switchMarket (i) {
      localStorage.setItem('otc_currency', i.name)
      this.switchs = i.name
      this.adsList()
    },
    getcurrency () {
      let currency = this.public_info._coinList
      this.currencys = []
      for (let item in currency) {
        if (currency[item].otcOpen === 1) {
          this.currencys.push(currency[item])
          let obj = JSON.stringify(this.currencys)
          localStorage.setItem('otc', obj)
        }
      }
      this.market === null && (this.market = this.currencys)
    },
    adsList (i) {
      this.axios({
        url: this.$store.state.otcUrl.wanted.search,
        headers: {},
        params: {
          symbol: this.switchs,
          sort: i,
          page: 1,
          pageSize: 50
        },
        hostType: 'otc',
        method: 'post'
      }).then((data) => {
        if (data.code.toString() === '0') {
          let list = data.data ? data.data.advertList : null
          if (list !== null) {
            for (let i = 0; i < list.length; i++) {
              list[i].price = this._P.fixD(list[i].price, 2)
              list[i].volumeBalance = this._P.fixD(list[i].volumeBalance, this.public_info._coinList[this.switchs].showPrecision)
              list[i].volume = this._P.fixD(list[i].volume, this.public_info._coinList[this.switchs].showPrecision)
              this.payCoin = list[i].payCoin.toUpperCase()
            }
            if (list.length < 1) {
              this.contentText.nodeDataText = this.$t('main.no_data')
            }
            this.otc_list = list
          } else {
            this.contentText.nodeDataText = this.$t('main.no_data')
            this.otc_list = ''
          }
        } else {
          this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
        }
      })
    },
    marketSor (val) {
      if (val !== this.sortName || this.sortType === 'ups') {
        this.sortName = val
        this.sortType = 'dow'
        this.adsList(2)
      } else {
        this.sortType = 'ups'
        this.adsList(1)
      }
    },
    marketSort (val) {
      if (val !== this.sortName || this.sortType === 'up') {
        this.sortName = val
        this.sortType = 'down'
        this.adsList(4)
      } else {
        this.sortType = 'up'
        this.adsList(3)
      }
    },
    transaction (item) {
      localStorage.setItem('sSymbolName', item)
      this.$router.push({ name: 'coinTran' })
    }
  }
}
</script>