<template>
  <div>
    <!-- 推荐区 -->
    <div class="recommend clearfix">
      <div class="main-content">
        <div v-if="JSON.stringify(symbolTop) == '{}'">
          <div v-for="item in 5" class="recomm-content borderbox"></div>
        </div>
        <div class="recomm-content borderbox" v-for="(item, index) in symbolTop" :key="index" v-else>
          <div class="content" @click="goToTrade(item.name)">
            <div class="symbol_buy clearfix">
              <span>{{item.name}}</span>
              <b :class="item.rose.class">{{item.rose.data}}</b>
            </div>
            <p class="price" :class="item.close.class">{{item.close.data}}</p>
            <span class="turnover">{{$t('main.deal_forehead')}}：{{item.amount}}&nbsp;{{item.symbolname}} </span>
          </div>
          <div class="chart_box" :id="'chart_'+ index"></div>
        </div>
      </div>
    </div>
     <!--币对市场-->
    <div class="main-content market front-color">
        <div class="header">
           <ul>
             <li :class="{findactive:'myMarket' === markTitle}" @click="tabTog('myMarket')">
              <span>
                <!--<i class="icon-store" v-if="'myMarket' === markTitle"></i> -->
                <!--<i class="icon-cor icon-store" v-else ></i>-->
                <!--{{$t('main.marketSet')}}-->
                <img src="../../../assets/img/yunzun.png" style=" margin-right: 5px;">
                    WC
              </span>
              </li>
             <li v-for="(value,key,index) in baseData._symbols"
                 v-if ="(key !== 'myMarket')"
                 :key="index" @click="tabTog(key)"
                 :class='{findactive:key === markTitle}'
                 class="coin_currency">
                <span>
                  <template v-if="baseData._coinList[key]">
                    <img :src="baseData._coinList[key].icon" v-if="baseData._coinList[key].icon">
                  </template>
                  <img src="@/assets/img/coindef.png" v-else>
                  {{key}}
                </span>
              </li>
          </ul>
          <div class="inputBox">
            <div class="search" :class="{active:frame}"><i class="sos icon-search"></i> <input type="text" v-model="search" @focus="issue" @blur="lose"> </div>
          </div>
        </div>
        <div class="mark-box">
        <!-- <p style="display: none">{{aaa}}</p> -->
        <table>
             <thead>
                <tr class="noHover">
                  <th class="market_title">{{this.$t('main.market')}}</th>
                  <th @click="marketSort('close')" class="new_price newprice_align">{{this.$t('main.close')}}
                    <span class="receet"> <i class="sorte up  iconNoFont-sup" :class="{cur: sortType === 'down'}"></i>   <i class="sorte down iconNoFont-sdow"  :class="{cur: sortType === 'up'}"></i></span></th>
                  <th>{{this.$t('main.height')}}</th>
                  <th>{{this.$t('main.low')}}</th>
                  <th @click="marketSor('rose')" class="rise">{{this.$t('main.rose')}} <span class="receet"> <i class="sorte up iconNoFont-sup" :class="{curr: sortType === 'dow'}"></i>   <i class="sorte down iconNoFont-sdow" :class="{curr: sortType === 'ups'}"></i></span></th>
                  <th>24H{{this.$t('main.vol')}}</th>
                  <th>24H{{this.$t('main.amount')}}</th>
                </tr>
             </thead>
              <tbody v-if="symbolListArr.length > 0">
                <tr v-for="(item, index) in symbolListArr" v-if="item.isShow" :key="index" :class="{symboy_bgc: index % 2 === 0 }">
                    <td class="mark">
                      <i :class="{findactive:myMarket.indexOf(item.symbol) > -1}" class="icon-store" v-if="myMarket.indexOf(item.symbol) > -1 "  @click="changeMysymbol(item.symbol)" ></i>
                      <i class="icon-cor icon-store"  @click="changeMysymbol(item.symbol)"  v-else></i>
                     <span @click="transaction(item.symbol)">{{item.symbol}}</span></td>
                    <td :class="item.close.class" class="newprice_align">{{item.close.data}}</td>
                    <td>{{item.high}}&nbsp;{{item.coin}} </td>
                    <td>{{item.low}}&nbsp;{{item.coin}}</td>
                    <td :class="item.rose.class">{{item.rose.data}} </td>
                    <td>{{item.vol}}&nbsp;{{item.symbolname}}</td>
                    <td>{{item.amount}}&nbsp;{{item.coin}}</td>
                </tr>
              </tbody>

             <tbody v-else>
               <tr class="noHover"><td colspan="8" class="no_data">{{contentText.nodeDataText}}</td></tr>
             </tbody>
          </table>

        </div>
    </div>
    <p v-if="!public_info"></p>
  </div>
</template>
<script>
import echarts from 'echarts'
import { mapState } from 'vuex'
import pako from 'pako'

export default {
  name: 'm-main',
  components: {},
  computed: {
    ...mapState({
      public_info ({baseData}) {
        if (baseData.isReady && this.firstFlag) {
          this.baseData = baseData
          this.lang = baseData._lan
          this.creatWs()
          this.firstFlag = false
          return true
        } else {
          return true
        }
      }
    }),
    contentText () {
      return {
        nodeDataText: this.$t('main.loading_ing')
      }
    },
    homeSymbolsList () {
      let sList = this.baseData._symbols[this.markTitle]
      if (!sList) return []
      let arr = []
      for (let item in sList) {
        arr.push(sList[item].symbol)
      }
      return arr
    },
    homeSymbolsTop () {
      let topSymbol = this.$store.state.baseData._topSymbol
      if (!topSymbol) return []
      let arr = []
      topSymbol.map((item) => {
        let sWs = item.toLowerCase().split('/')
        let key = sWs[0] + sWs[1]
        arr.push(key)
      })
      return arr
    }
  },
  data () {
    return {
      flag: true,
      firstFlag: true,
      isArr: [], // 轮播图数据
      mack: 0,   // 图片索引
      time: null, // 定时器
      marketListWS: null,
      topMarket: null,
      symbolTop: {},
      skin: '',
      markTitle: localStorage.getItem('homeMarkTitle'),
      symbolListData: {},
      symbolListArr: [],
      lastSymbol: [],
      search: null,
      lang: localStorage.getItem('lan'),
      rate: '',
      baseData: {},
      aaa: '',
      frame: false,
      sortName: null,
      sortType: null,
      topMarketTrade: null,
      klineData: null,
      klineKey: null,
      myEcharts: {},
      theme: this.$store.state.baseData._theme,
      myMarket: localStorage.getItem('myMarket')
        ? localStorage.getItem('myMarket').split(',')
        : [],
      timeoutTop: null,
      lockReconnectTop: false,
      lockDestroyTop: false
    }
  },
  mounted () {
  },
  destroyed () {
    if (this.marketListWS) {
      this.marketListWS.onclose()
    }
    if (this.topMarket) {
      this.topMarket.onclose()
    }
  },
  watch: {
    // 监听货币对搜索
    search (val) {
      for (let i = 0; i < this.symbolListArr.length; i++) {
        this.symbolListArr[i].symbol.split('/')[0].indexOf(val.toUpperCase()) === -1
          ? (this.symbolListArr[i].isShow = false)
          : (this.symbolListArr[i].isShow = true)
      }
    },
    'symbolListData' (value) {
      let arr = []
      for (let item in value) {
        arr.push(value[item])
      }
      if (arr.length < 1) {
        this.contentText.nodeDataText = this.$t('main.no_data')
      }
      this.symbolListArr = arr
    },
    //  监听皮肤切换
    '$store.state.baseData._theme' (val, old) {
      if (!val) return false

      this.theme = val
      if (old) {
        for (let item in this.myEcharts) {
          this.myEcharts[item].setOption({
            series: {
              lineStyle: {
                normal: {
                  color: this.$store.state.color.HomeChartColor[this.theme].lineStyle,
                  width: 1
                }
              },
              areaStyle: {
                normal: {
                  color: this.$store.state.color.HomeChartColor[this.theme].areaStyle
                }
              }
            }
          })
        }
      }
    }
  },
  methods: {
    goToTrade (symbol) {
      localStorage.setItem('sSymbolName', symbol)
      this.$router.push({ name: 'coinTran' })
    },
    eachart (data, key) {
      this.myEcharts[key].resize()
      this.myEcharts[key] && this.myEcharts[key].setOption({
        series: [
          {
            data: data
          }
        ]
      })
    },
    initEachart (data, key) {
      this.myEcharts[key] = echarts.init(document.getElementById('chart_' + key))
      // 绘制图表
      this.myEcharts[key] && this.myEcharts[key].setOption({
        grid: {
          left: 0,
          bottom: 0,
          top: 0,
          right: 0
        },
        xAxis: {
          show: false,
          type: 'category',
          min: 'dataMin',
          max: 'dataMax'
        },
        yAxis: {
          show: false,
          type: 'value',
          min: 'dataMin',
          max: 'dataMax'
        },
        series: [{
          data: data,
          type: 'line',
          symbol: 'none',
          // smooth: true,
          lineStyle: {
            normal: {
              color: this.$store.state.color.HomeChartColor[this.theme].lineStyle,
              width: 1
            }
          },
          areaStyle: {
            normal: {
              color: this.$store.state.color.HomeChartColor[this.theme].areaStyle
            }
          }
        }]
      })
    },
    // 市场切换
    tabTog (key) {
      if (key === 'myMarket') {
        if (this.baseData.isLogin) {
          this.getoptional()
        }
      }
      if (this.markTitle === key) {
        return
      }
      for (let i = 0; i < this.lastSymbol.length; i++) {
        this.sedWs(this.lastSymbol[i], 'unsub')
      }
      key !== 'myMarket' && localStorage.setItem('homeMarkTitle', key)
      this.markTitle = key
      this.markList()
    },
    // 心跳检测
    heartCheckTop () {
      let self = this
      let timeout = 10000
      if (self.topMarket.readyState === 3) return false
      clearTimeout(this.timeoutTop)
      if (this.lockReconnectTop || this.lockDestroyTop) return
      this.timeoutTop = setTimeout(() => {
        console.log('未检测到心跳体征')
        self.topMarket.send('HeartBeat')
      }, timeout)
    },
    // 重连WS
    reconnectTop (type) {
      if (this.lockReconnectTop || this.lockDestroyTop) return
      this.lockReconnectTop = true
      setTimeout(() => {
        console.log('开始执行WS重连操作')
        this.creatWs(type)
      }, 3000)
    },
    creatWs () {
      // 创建ws
      console.log('开始链接WS')
      this.topMarket = new WebSocket(this.baseData._ws)
      this.topMarket.binaryType = 'arraybuffer'
      this.webSocketTopEvent()
      this.lockReconnectTop = false
    },
    webSocketTopEvent () {
      // 建立连接
      this.topMarket.onopen = ev => {
        console.log('WS链接成功')
        this.symbolTopList()
        this.markList()
        // 开启心跳检测
        this.heartCheckTop()
      }
      // 获取数据
      this.topMarket.onmessage = evt => {
        var na = new Uint8Array(evt.data)
        if (na.length > 0) {
          let data = JSON.parse(pako.inflate(na, { to: 'string' }))
          if (data['ping']) {
            // 重置心跳检测
            this.heartCheckTop()
            this.topMarket.send(JSON.stringify({ pong: data['ping'] }))
          } else if (data.event_rep && data.event_rep === 'rep' && data.data) { // 1分钟K线历史
            let key = data.channel.split('_')[1]
            if (!this.symbolTop[key]) return false
            this.myEcharts[key] = true
            if (data.data.length <= 0) return false
            this.symbolTop[key].kline = []
            for (let i = data.data.length - 1; i >= 0; i--) {
              if (i <= data.data.length - 100) break
              this.symbolTop[key].kline.push([data.data[i].id, data.data[i].close])
            }
            this.symbolTop[key].kline.reverse()
            this.initEachart(this.symbolTop[key].kline, key)
          } else if (data.tick && data.channel.indexOf('_kline_') > -1) { // 1分钟K线
            let key = data.channel.split('_')[1]
            if (this.symbolTop[key] && this.symbolTop[key].kline !== null && this.myEcharts[key]) {
              this.symbolTop[key].kline.length > 100 && this.symbolTop[key].kline.shift()
              this.symbolTop[key].kline.push([data.tick.id, data.tick.close])
              this.klineData = this.symbolTop[key].kline
              this.klineKey = key
              this.eachart(this.symbolTop[key].kline, key)
            }
          } else if (data.tick) { // 24小时行情
            let d = data.tick
            let key = data.channel.split('_')[1]
            // 判断数据是否是 推荐列表列数据
            if (this.homeSymbolsTop.indexOf(key) !== -1) {
              let topMN = this.symbolTop[key].name.split('/')[1]  // 当前市场
              let j = this.baseData._symbols[topMN][this.symbolTop[key].name].price // 当前市场信息
              let oldClose = this.symbolTop[key].close.data // 上次价格
              let close = this._P.fixD(d.close, j)
              let rate = this._P.fixRate(d.close, this.baseData._rate, topMN)
              let Od = parseFloat(oldClose)
              let cs = parseFloat(close)
              let rs = ''
              if (Od + '' !== 'NaN') {
                cs > Od && (rs = 'c-fall')
                cs < Od && (rs = 'c-rise')
                cs === Od && (rs = '')
              }
              this.symbolTop[key].close = {
                class: rs,
                data: close + '/' + rate
              }
              let num = Math.abs(d.rose * 10000 / 100)
              let rose = null
              let rc = null
              if (isNaN(num)) {
                rose = '0.00%'
              } else {
                rose = Number(num.toString().match(/^\d+(?:\.\d{0,2})?/)) + '%'
                if (d.rose < 0) {
                  rc = 'c-fall'
                  rose = '-' + rose
                }
                if (d.rose > 0) {
                  rc = 'c-rise'
                  rose = '+' + rose
                }
                d.rose === 0 && (rc = '')
              }
              this.symbolTop[key].rose = {
                class: rc,
                data: rose
              }
              this.symbolTop[key].amount = this._P.fixD(d.amount, j)
            }
            // 表格数据
            // 判断数据是否是 全部列表列数据
            if (this.homeSymbolsList.indexOf(key) !== -1) {
              let symboList = this.baseData._symbols[this.markTitle]
              for (let v in symboList) {
                if (symboList[v].symbol === key) {
                  this.addWsListData(symboList[v].name, data.tick)
                }
              }
            }
            this.$forceUpdate()
          }
        }
      }
      this.topMarket.onclose = evt => {
        this.reconnectTop('onclose')
        console.log('WS已关闭')
      }
      this.topMarket.onerror = evt => {
        console.log('错误', evt)
      }
    },
    symbolTopList () {
      for (let i = 0; i < this.$store.state.baseData._topSymbol.length; i++) {
        let s = this.$store.state.baseData._topSymbol[i]
        let sMarket = s.split('/')[1]
        let sWs = s.toLowerCase().split('/')
        let key = sWs[0] + sWs[1]
        this.symbolTop[key] = {
          close: {
            class: '',
            data: '--'
          },
          rose: {
            class: '',
            data: '--'
          },
          amount: '--',
          name: s,
          kline: null
        }
        this.$forceUpdate()
        if (this.$store.state.baseData._symbols[sMarket] && this.$store.state.baseData._symbols[sMarket][s]) {
          this.sendsymbolTop(key)
          this.myEcharts[key] = false
        }
      }
    },
    sendsymbolTop (symbol) {
      if (!this.topMarket) return
      this.topMarket.send(JSON.stringify({
        event: 'sub',
        params: {
          channel: 'market_' + symbol + '_ticker',
          cb_id: symbol
        }
      }))
      this.topMarket.send(JSON.stringify({
        event: 'req',
        params: {
          channel: 'market_' + symbol + '_kline_1min',
          cb_id: symbol
        }
      }))
      this.topMarket.send(JSON.stringify({
        event: 'sub',
        params: {
          channel: 'market_' + symbol + '_kline_1min',
          cb_id: symbol
        }
      }))
    },
    markList () {
      !this.markTitle && (this.markTitle = this.baseData._maket_index)
      let sList = this.baseData._symbols[this.markTitle]
      this.symbolListData = {}
      this.lastSymbol = []
      for (let item in sList) {
        let unit = sList[item].name.split('/')[1]
        if (this.baseData._symbols[unit][item]) {
          this.symbolListData[sList[item].name] = {
            isShow: true,
            close: {
              class: '',
              data: '--'
            },
            rose: {
              class: '',
              data: '--'
            },
            high: '--',
            low: '--',
            vol: '--',
            amount: '--',
            symbol: sList[item].name
          }
          this.lastSymbol.push(sList[item].symbol)
          this.sedWs(sList[item].symbol, 'sub')
        }
      }
    },
    sedWs (symbol, type) {
      this.topMarket.send(JSON.stringify({
        event: type,
        params: {
          channel: 'market_' + symbol + '_ticker',
          cb_id: symbol
        }
      }))
    },
    addWsListData (name, data) {
      let t = this.symbolListData[name]
      if (!t) return false
      let thisMarket = this.baseData._symbols[name.split('/')[1]]
      // 最新价
      let oldClose = t.close.data
      let close = this._P.fixD(data.close, thisMarket[name].price)
      let rate = this._P.fixRate(data.close, this.baseData._rate, name.split('/')[1].toUpperCase())
      let Od = parseFloat(oldClose)
      let cs = parseFloat(close)
      let rs = ''
      if (Od + '' !== 'NaN') {
        cs > Od && (rs = 'c-rise')
        cs < Od && (rs = 'c-fall')
        cs === Od && (rs = '')
      }
      t.close = {
        class: rs,
        data: close + '/' + rate
      }
      let symbolname = name.split('/')[0]
      let coin = name.split('/')[1]
      t.symbolname = symbolname
      t.coin = coin
      t.symbol = symbolname + '/' + coin
      // 涨跌

      let num = Math.abs(data.rose * 10000 / 100)
      let rose = null
      let rc = null
      if (isNaN(num)) {
        rose = '0.00%'
      } else {
        rose = Number(num.toString().match(/^\d+(?:\.\d{0,2})?/)) + '%'
        if (data.rose < 0) {
          rc = 'c-fall'
          rose = '-' + rose
        }
        if (data.rose > 0) {
          rc = 'c-rise'
          rose = '+' + rose
        }
        if (data.rose === 0) {
          rc = ''
          rose = '0.00%'
        }
      }
      t.rose = {
        class: rc,
        data: rose
      }
      t.high = this._P.fixD(data.high, thisMarket[name].price)
      t.low = this._P.fixD(data.low, thisMarket[name].price)
      t.vol = this._P.fixD(data.vol, thisMarket[name].volume)
      t.amount = this._P.fixD(data.amount, thisMarket[name].price)
      // this.aaa = this._P.fixD(data.amount, thisMarket[name].price)
      this.$forceUpdate()
    },
    changeMysymbol (symbol) {
      console.log(symbol)
      if (this.myMarket.indexOf(symbol) > -1) {
        this.myMarket = this.myMarket.filter(function (item, index, array) {
          return item !== symbol
        })
      } else {
        this.myMarket.push(symbol)
      }
      localStorage.setItem('myMarket', this.myMarket)
      let newMyMarket = {}
      for (let i = 0; i < this.myMarket.length; i++) {
        let tempSymbol = this.myMarket[i].split('/')
        newMyMarket[this.myMarket[i]] = {
          'name': this.myMarket[i],
          'symbol': tempSymbol[0].toLowerCase() + tempSymbol[1].toLowerCase()
        }
      }
      this.$store.commit('MYMARKET', newMyMarket)
      if (this.baseData.isLogin) {
        this.getoptional()
      }
      if (this.markTitle === 'myMarket') {
        for (let i = 0; i < this.symbolListArr.length; i++) {
          if (this.symbolListArr[i].symbol === symbol) {
            this.symbolListArr.splice(i, 1)
          }
        }
      }
    },
    getoptional () {
      this.axios({
        url: this.$store.state.url.common.optional_symbol,
        headers: {},
        params: {
          optional_symbol: this.myMarket,
          time: new Date().getTime()
        },
        method: 'post'
      }).then((data) => {
        if (data.code === '0') {
        } else {
          this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
        }
      })
    },
    issue () {
      this.frame = true
    },
    lose () {
      this.frame = false
    },
    marketSor (val) {
      if (val !== this.sortName || this.sortType === 'ups') {
        this.symbolListArr = this.quickSort(this.symbolListArr, val).reverse()
        this.sortName = val
        this.sortType = 'dow'
      } else {
        this.symbolListArr = this.quickSort(this.symbolListArr, val)
        this.sortType = 'ups'
      }
    },
    marketSort (val) {
      if (val !== this.sortName || this.sortType === 'up') {
        this.symbolListArr = this.quickSort(this.symbolListArr, val).reverse()
        this.sortName = val
        this.sortType = 'down'
      } else {
        this.symbolListArr = this.quickSort(this.symbolListArr, val)
        this.sortType = 'up'
      }
    },
    quickSort (dataArrer, key) {
      if (dataArrer.length <= 1) {
        return dataArrer
      }
      let index = Math.floor(dataArrer.length / 2)
      let temp = dataArrer.splice(index, 1)
      let leftArr = []
      let rightArr = []
      for (let i = 0; i < dataArrer.length; i++) {
        if (parseFloat(dataArrer[i][key]['data']) < parseFloat(temp[0][key]['data']) || dataArrer[i][key]['data'] === '--') {
          leftArr.push(dataArrer[i])
        } else {
          rightArr.push(dataArrer[i])
        }
      }
      return this.quickSort(leftArr, key).concat(temp, this.quickSort(rightArr, key))
    },
    transaction (item) {
      localStorage.setItem('sSymbolName', item)
      localStorage.setItem('markTitle', this.markTitle)
      this.$router.push({ name: 'coinTran' })
    }
  },
  // 页面实例销毁之前调用 关闭WS
  beforeDestroy () {
    this.lockDestroyTop = true
    this.topMarket.close()
    clearTimeout(this.timeoutTop)
  }
}
</script>
