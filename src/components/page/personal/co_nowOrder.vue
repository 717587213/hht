<template>
  <div class="venue-box">
    <!-- 头部 -->
    <div class="venue-title">
      <span>当前委托</span>
      <!-- <i @click="curren(state)"> {{state}} &gt;</i> -->
    </div>
    <!-- loading -->
    <!-- <div class="loading"><loading></loading></div> -->
    <!-- 正常内容 -->
    <div>
      <!-- 有数据 -->
      <div> 
        <table>
          <thead>
            <tr>
              <th class="thead-color">订单号</th>
              <th class="thead-color">合约</th>
              <th class="thead-color">杠杆</th>
              <th class="thead-color">时间</th>
              <th class="thead-color">类型</th>
              <th class="thead-color">数量</th>
              <th class="thead-color">价格</th>
              <th class="thead-color">已成交</th>
              <th class="thead-color">成交均价</th>
              <th class="thead-color">冻结保证金</th>
              <th class="thead-color">状态</th>
              <th class="status_msg">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>123123</td>
              <td>12312312</td>
              <td>123123</td>
              <td>12312312</td>
              <td>123123</td>
              <td>12312312</td>
              <td>123123</td>
              <td>12312312</td>
              <td>123123</td>
              <td>12312312</td>
              <td>123123</td>
              <td>撤销</td>
            </tr>
          </tbody>         
        </table>
        <!-- 当前委托分页 -->
        <!-- <Vpagination v-if="(currtion.count/currtion.pageSize) > 1"
          :total="currtion.count"
          :current-page='currtion.page'
          :display='currtion.pageSize'
          @pagechange="currchange($event)" class="page">
        </Vpagination> -->
      </div>
    </div>            
  </div>
</template>
<script>
import { mapState } from 'vuex'
import VPagination from '@/components/common/pagination'
export default {
  name: 'co_order_now',
  data () {
    return {
      first: true, // getList事件 开关
      timer: null, // 定时器
      pageOptions: { // 分页器
        page: 1, // 当前页码 -> 自行配置
        pageSize: 5, // 每页条数 -> 自行配置
        pageSum: 0 // 总数据条数 -> 接口返回
      }
    }
  },
  components: {
    VPagination
  },
  watch: {
    '$store.state.coBaseData._co_ID' (v) {
      if (!this.first && v) { this.getList(v) }
    },
    '$store.state.coBaseData._nowSymbol' (v) {
      this.pageOptions.pageSum = 0
      this.co_baseData._co_nowOrder = []
    }
  },
  computed: {
    ...mapState({
      co_baseData ({coBaseData}) {
        if (coBaseData._co_ID && this.first) {
          this.first = false
          this.getList()
        }
        return coBaseData
      },
      baseData ({baseData}) {
        return baseData
      }
    }),
    _that () { return this }
  },
  filters: {
    // 订单状态
    status (v) {
      // （1.新订单.2.完全成绩看3.部分成交4.已撤单5.待撤单 6.异常订单 注：0 是初始订单展示为新订单）
      switch (v) {
        case 0:
          return '新订单'
        case 1:
          return '新订单'
        case 2:
          return '完全成交'
        case 3:
          return '部分成交'
        case 4:
          return '已撤单'
        case 5:
          return '待撤单'
        case 6:
          return '异常订单'
      }
    }
  },
  methods: {
    // 分页器切换
    pagechange (e) {
      this.pageOptions.page = e
      this.getList()
    },
    // 获取数据
    getList () {
      this.co_baseData._co_nowOrder = []
      clearInterval(this.timer)
      this.sendAxios()
      this.timer = setInterval(() => {
        this.sendAxios()
      }, 3000)
    },
    sendAxios () {
      this.axios({
        url: 'user_current_orders',
        hostType: 'co',
        params: {
          contractId: this.co_baseData._co_ID, // 合约id
          page: this.pageOptions.page, // 当前页码
          pageSize: this.pageOptions.pageSize // 每页条数
        } // 例如 btcusdt
      }).then((e) => {
        if (e.code === '0') {
          this.co_baseData._co_nowOrder = e.data.currentOrders
          this.pageOptions.pageSum = e.data.currentSum
        }
      })
    },
    // 撤单
    cancelOrder (item) {
      this.axios({
        url: 'cancel_order',
        hostType: 'co',
        params: {
          orderId: item.id,
          // tradeSybmbol: this.co_baseData._nowSymbol.split('/')[0] + this.co_baseData._nowSymbol.split('/')[1]
          contractId: this.co_baseData._co_ID
        } // 例如 btcusdt
      }).then((e) => {
        if (e.code === '0') {
          this.$store.dispatch('setTipState', {text: '撤销成功', type: 'success'})
        } else {
          this.$store.dispatch('setTipState', {text: e.msg, type: 'error'})
        }
      })
    }
  }
}
</script>
