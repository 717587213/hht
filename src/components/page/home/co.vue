<template>
      <div>
         <!--币对市场-->
         <div class="main-content market front-color">
            <div class="mark-box">
            <table>
              <thead>
                <tr class="noHover">
                  <!-- 市场 -->
                  <th class="market_title">{{$t('main.market')}}</th>
                  <!-- 最新价 -->
                  <th @click="marketSort('close')" class="new_price newprice_align">{{$t('main.close')}}
                    <span class="receet"> <i class="sorte up  iconNoFont-sup" :class="{cur: sortType === 'down'}"></i>   <i class="sorte down iconNoFont-sdow"  :class="{cur: sortType === 'up'}"></i></span></th>
                    <!-- 最高价 -->
                  <th>{{$t('main.height')}}</th>
                  <!-- 最低价 -->
                  <th>{{$t('main.low')}}</th>
                  <!-- 涨跌 -->
                  <th @click="marketSor('rose')" class="rise">{{$t('main.rose')}} <span class="receet"> <i class="sorte up iconNoFont-sup" :class="{curr: sortType === 'dow'}"></i>   <i class="sorte down iconNoFont-sdow" :class="{curr: sortType === 'ups'}"></i></span></th>
                  <!-- 25H成交量 -->
                  <th>24H{{$t('main.vol')}}</th>
                  <!-- 24H成交金额 -->
                  <th>24{{$t('main.amount')}}</th>
                </tr>
              </thead>
            <tbody v-if="symbolListData">
              <tr v-for="(item, index) in symbolListData" v-if="item.isShow" :key="index" :class="{symboy_bgc: index % 2 === 0 }">
                  <td class="mark"> 
                    <span @click="transaction(item.name)">{{item.name | split}}</span></td>
                  <td :class="item.colorClass" class="newprice_align">{{item.price}}</td>
                  <td>{{item.high}}&nbsp;{{item.coin}} </td>
                  <td>{{item.low}}&nbsp;{{item.coin}}</td>
                  <td :class="item.roseClass">{{item.rose}} </td>
                  <td>{{item.vol}}&nbsp;{{item.symbolname}}</td>
                  <td>{{item.amount}}&nbsp;{{item.coin}}</td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr class="noHover"><td colspan="8" class="no_data">{{$t('main.no_data')}}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    <p v-if="!co_baseData"></p>
    </div>
</template>
<script>
import { mapState } from 'vuex'
import pako from 'pako'

export default {
  name: 'm-main',
  components: {},
  data () {
    return {
      // Web Sockte
      MywebSocket: null,
      // 是否创建WS
      coBaseDataFlag: true,
      // 货币对列表
      symbolList: {},
      // 基础数据
      baseData: null,
      // 排序
      sortType: null,
      // 数据列表
      symbolListData: {}
    }
  },
  mounted () {
  },
  computed: {
    ...mapState({
      co_baseData ({coBaseData}) {
        if (coBaseData._symbols && coBaseData.isReady) {
          // 合约 public info 基础数据
          this.baseData = coBaseData
          // 货币对列表
          this.symbolList = coBaseData._symbols

          this.creatSymbolList()
          // 创建WS
          this.creatWebSocket()
        }
        return coBaseData
      },
      public_info ({baseData}) {
        if (baseData.isReady) {
          return true
        } else {
          return true
        }
      },
      // 全部货币对小写名称列表数组
      symbolCaseAllArr () {
        let arr = []
        for (let item in this.symbolList) {
          let name = this.symbolList[item].symbol.toLowerCase()
          arr.push(name)
        }
        return arr
      }
    })
  },
  filters: {
    toFix (v, that, num) { return that._P.fixD(v, num) },
    split (val) { return val.split('_')[1] ? val.split('_')[1] : val }
  },
  watch: {
  },
  methods: {
    // 创建 Web Socket
    creatWebSocket () {
      this.MywebSocket = new WebSocket(this.baseData._ws)
      this.MywebSocket.binaryType = 'arraybuffer'
      // WS 链接成功
      this.MywebSocket.onopen = (event) => {
        this.wsReady = true
        this.sendSymbolList()
      }
      this.MywebSocket.onmessage = (event) => {
        let ua = new Uint8Array(event.data)
        let data = JSON.parse(pako.inflate(ua, {to: 'string'}))
        let Dtype
        if (data['ping']) {
          this.wsReady && this.MywebSocket.send(JSON.stringify({'pong': data['ping']}))
          return false
        }
        if (data.channel) {
          // 判断 是否是带 E_ 的币对
          if (this.symbolCaseAllArr.indexOf(data.channel.split('_')[1]) === -1) {
            Dtype = data.channel.split('_')[3]
          } else {
            Dtype = data.channel.split('_')[2]
          }
        }
        // 合约列表数据
        if (data.tick && Dtype === 'ticker') {
          this.setSymbolListData(data)
        }
      }
    },
    // 创建货币对元素
    creatSymbolList () {
      let list = {}
      let arr = this.symbolList
      for (let i in arr) {
        let key = arr[i].symbol
        list[key] = {
          // 合约名称
          name: arr[i].symbol,
          // 合约基础货币
          baseSymbol: arr[i].baseSymbol,
          // 最新价
          price: '-- --',
          // 涨跌幅
          rose: '-- --',
          // 涨跌幅颜色
          roseClass: '',
          // 最新价颜色
          colorClass: '',
          // 最高价
          high: '-- --',
          // 最低价
          low: '-- --',
          // 24小时成交量
          vol: '-- --',
          // 24小时成交金额
          amount: '-- --',
          // key 大写
          key: key,
          wsData: {},
          isShow: true
        }
        if (this.MywebSocket) {
          this.wsSend('sub', key.toLowerCase())
        }
      }
      this.symbolListData = list
    },
    setSymbolListData (data) {
      let symbol = ''
      let split1 = data.channel.split('_')
      if (this.symbolCaseAllArr.indexOf(split1[1]) === -1) {
        symbol = split1[1] + '_' + split1[2]
      } else {
        symbol = split1[1]
      }
      symbol = symbol.toUpperCase()
      let pricePrecision = this.symbolList[symbol]['pricePrecision']

      if (JSON.stringify(data.tick) === '{}') {
        return
      }
      // 涨跌幅判断
      let num = Math.abs(Number(data.tick.rose) * 10000 / 100)
      let rose = null
      let rc = null
      if (isNaN(num)) {
        rose = '--'
      } else {
        rose = Number(num.toString().match(/^\d+(?:\.\d{0,2})?/)) + '%'
        if (Number(data.tick.rose) < 0) {
          rc = 'c-fall'
          rose = '-' + rose
        }
        if (Number(data.tick.rose) > 0) {
          rc = 'c-rise'
          rose = '+' + rose
        }
        if (Number(data.tick.rose) === 0) {
          rc = ''
          rose = '0.00%'
        }
      }
      if (this.symbolListData[symbol]) {
        let lastPrice = this.symbolListData[symbol].price // 上一价格
        // 最新价格颜色
        if (!isNaN(lastPrice)) {
          this.symbolListData[symbol].colorClass = lastPrice > data.tick.close ? 'c-fall' : 'c-rise'
        }
        // 涨跌幅度
        this.symbolListData[symbol].rose = rose
        // 涨跌幅度Class
        this.symbolListData[symbol].roseClass = rc
        // 最新价
        this.symbolListData[symbol].price = this._P.fixD(data.tick.close, pricePrecision)
        // 还原ws对象
        this.symbolListData[symbol].wsData = data.tick
        // 最高价x
        this.symbolListData[symbol].high = this._P.fixD(data.tick.high, pricePrecision)
        // 最低价
        this.symbolListData[symbol].low = this._P.fixD(data.tick.low, pricePrecision)
        // 24小时成交量
        this.symbolListData[symbol].vol = data.tick.vol
        // 24小时成交金额
        this.symbolListData[symbol].amount = this._P.fixD(data.tick.amount, pricePrecision)
      }
    },
    // 发送send 请求WS 数据
    sendSymbolList () {
      for (let item in this.symbolListData) {
        this.wsSend('sub', item.toLowerCase())
      }
    },
    // 发送 send
    wsSend (type, symbol) {
      let json = JSON.stringify({
        'event': type,
        'params': {
          'channel': 'market_' + symbol + '_ticker',
          'cb_id': symbol
        }
      })
      if (this.MywebSocket) { this.MywebSocket.send(json) }
    },
    //  跳转至合约交易页面
    transaction (item) {
      // 当前货币对 字符串:(E_ETHBTC)
      localStorage.setItem('coNowSymbol', item)
      this.$store.commit('SET_NOWSYMBOL', item)
      this.$router.push({ name: 'contract' })
    }

  }
}
</script>