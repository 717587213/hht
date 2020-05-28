<template>
  <section class="co_manage">
    <div class="co_even" v-for='(item, key ,index) in listData' :key='index'>
      <div class="co_even_head">
        <!-- 交易帐户 -->
        <div class="co_even_head_symbol">{{ item.market }}（{{ $t('co.funds.tradingAccount') }}）</div>
        <!-- 可用 -->
        <div class="co_even_head_have"><span>{{ $t('co.funds.available') }}：</span>{{ item.normal_balance | exFix(item.market, _that) }}</div>
        <!-- 冻结 -->
        <div class="co_even_head_none"><span>{{ $t('co.funds.lock') }}：</span>{{ item.lock_balance | exFix(item.market, _that) }}</div>
      </div>
      <ul class="co_even_body_ul co_even_body_title">
        <!-- 合约 -->
        <li class="co_even_body_symbol">{{ $t('co.funds.contract') }}</li>
        <!-- 帐户权益 -->
        <li class="co_even_body_user">{{ $t('co.funds.equity') }}</li>
        <!-- 可用保证金 -->
        <li class="co_even_body_have">{{ $t('co.funds.ensure') }}</li>
        <!-- 操作 -->
        <li class="co_even_body_options">{{ $t('co.funds.option') }}</li>
      </ul>
      <ul class="co_even_body_ul" v-for="(citem, cindex) in item.children" :key='cindex'>
        <!-- 合约 -->
        <li class="co_even_body_symbol">{{citem.contract.split(item.market)[0] + '/' + item.market}}</li>
        <!-- 账户权益 -->
        <li class="co_even_body_user">{{citem.legal_balance | exFix(item.market, _that)}}</li>
        <!-- 可用保证金 -->
        <li class="co_even_body_have">{{citem.deposit_balance | exFix(item.market, _that)}}</li>
        <!-- 操作 -->
        <li class="co_even_body_options">
          <!-- 转入 -->
          <span @click="evenClickIn(item, citem)" class="deff-text">{{ $t('co.funds.in') }}</span>
          <!-- 转出 -->
          <span @click="evenClickOut(item, citem)">{{ $t('co.funds.out') }}</span>
        </li>
      </ul>
    </div>
    <!--转入-->
    <el-dialog 
      name= 'transferout'
      :title="$t('co.funds.marktile')"
      :flag='inFlag'
      :width='450'
      :dialogClose='closeInDialog'>
      <div slot="content">
        <ul class="transfer-list transferOpe">
          <!-- 从 交易帐户 -->
          <li><span>{{ $t('co.funds.from') }}</span><span class="current-acc">{{ $t('co.funds.tradingAccount') }}</span></li>
          <!-- 转入 合约帐户 -->
          <li><span>{{ $t('co.funds.in') }}</span><span class="current-acc">{{ $t('co.funds.contractAccount') }}</span></li>
          <!-- 转入数量 -->
          <li><span>{{ $t('co.funds.volume') }}</span><input @keyup="keyUpInInput" @focus='ininpfocus' v-model="inObj.inpV" :placeholder="$t('co.funds.volume')"/><span>{{ inObj.coinType }}</span></li>
          <li>
            <!-- 该span标签 撑结构 -->
            <span class="usable-quantity"></span>
            <!-- 可转入数量 全部转入 -->
            <div><i>{{ $t('co.funds.Quantity') }}:</i><i>{{ inObj.maxNum | exFix(inObj.coinType, _that) }}</i><a @click="inAllCLICK">{{ $t('co.funds.all') }}</a></div>
          </li>
          <li class="error-note" v-if="inObj.errorFlag">
            <!-- 请输入 范畴内数数量 -->
            <i v-if="inObj.maxNum > 0">{{ $t('co.funds.please') }} 0～{{ inObj.maxNum | exFix(inObj.coinType, _that) }} {{ $t('co.funds.category') }}</i>
            <!-- 可转入数量不足 -->
            <i v-else>{{ $t('co.funds.error') }}</i> 
          </li>
        </ul>
      </div>
      <div slot="options">
        <!-- 取消 -->
        <button @click="closeInDialog">{{ $t('co.funds.none') }}</button>
        <!-- 确认 -->
        <button @click="InDialog_true">{{ $t('co.funds.true') }}</button>
      </div>
    </el-dialog >
    <!--转出-->
    <el-dialog 
      :title="$t('co.funds.marktile')"
      name= 'transferout'
      :flag='outFlag'
      :width='450'
      :dialogClose='closeOutDialog'>
      <div slot="content">
        <ul class="transfer-list transferOpe">
          <!-- 从  合约帐户 -->
          <li><span>{{ $t('co.funds.from') }}</span><span class="current-acc">{{ $t('co.funds.contractAccount') }}</span></li>
          <!-- 转入  交易帐户 -->
          <li><span>{{ $t('co.funds.in') }}</span><span class="current-acc">{{ $t('co.funds.tradingAccount') }}</span></li>
          <!-- 转出数量 -->
          <li><span>{{ $t('co.funds.volume') }}</span><input @keyup="keyUpOutInput" @focus="outinpfocus" v-model="outObj.inpV" :placeholder="$t('co.funds.volume')"/><span>{{ outObj.coinType }}</span></li>
          <!-- 可转出数量 全部转出-->
          <li><span class="usable-quantity"></span><div><i>{{ $t('co.funds.Quantity') }}:</i><i>{{ outObj.maxNum | exFix(outObj.coinType, _that) }}</i><a @click="outAllCLICK">{{ $t('co.funds.all') }}</a></div></li>
          <li class="error-note" v-if="outObj.errorFlag">
            <!-- 请输入 范畴内数数量 -->
            <i v-if="outObj.maxNum > 0">{{ $t('co.funds.please') }} 0～{{ outObj.maxNum | exFix(outObj.coinType, _that) }} {{ $t('co.funds.category') }}</i>
            <!-- 可转入数量不足 -->
            <i v-else>{{ $t('co.funds.error') }}</i> 
          </li>
        </ul>
      </div>
      <div slot="options">
        <!-- 取消 -->
        <button @click="closeOutDialog">{{ $t('co.funds.none') }}</button>
        <!-- 确认 -->
        <button @click="outDialog_true">{{ $t('co.funds.true') }}</button>
      </div>
    </el-dialog >
  </section>
</template>
<script>
import elDialog from '@/components/common/dialog'
export default {
  name: 'co_manage',
  components: { elDialog },
  data () {
    return {
      inFlag: false, // 转入弹层开关变量
      outFlag: false, // 转入弹层开关变量
      inClickBut: true, // 转入弹层防止二次点击
      outClickBut: true, // 转出弹层防止二次点击
      inObj: {
        inpV: '', // input框的内容
        maxNum: 0, // 可转入数量
        coinType: '--', // 交易帐户单位 币种
        symbol: '--', // 合约帐户单位 币对
        errorFlag: false, // 转入错误提示开关
        userId: null, // 我的帐户id
        coId: null // 合约id
      },
      outObj: {
        inpV: '', // input框的内容
        maxNum: 0, // 可转出数量
        coinType: '--', // 交易帐户单位 币种
        symbol: '--', // 合约帐户单位 币对
        errorFlag: false, // 转入错误提示开关
        userId: null, // 我的帐户id
        coId: null // 合约id
      },
      listData: {} // 页面渲染的资产列表
    }
  },
  filters: {
    // 币种的精度校验
    exFix (v, type, that) {
      let { _coinList } = that.$store.state.baseData
      let coinObj = _coinList[type]
      if (!coinObj) { return v }
      return that._P.fixD(v, coinObj.showPrecision)
    }
  },
  // 首次获取数据
  created () { this.getListData() },
  // _that是供filters使用
  computed: { _that () { return this } },
  methods: {
    //  ====================  获取列表  ====================
    getListData () {
      this.axios({
        url: 'account_blance',
        hostType: 'co'
      }).then((e) => {
        this.listData = {}
        let { coin_account, contract_account_list } = e.data
        coin_account.forEach((ev) => { this.listData[ev.market] = ev })
        contract_account_list.forEach((ev) => { this.listData[ev.market].children = ev.data })
      })
    },
    //  ====================  转入  ====================
    // 列表中点击转入按钮
    evenClickIn (user, co) {
      this.inFlag = true
      this.inObj = {
        userId: user.coin_type, // fromID
        coId: co.contract_type, // toID
        maxNum: user.normal_balance, // 可用
        coinType: user.market, // 交易帐户单位 币种
        symbol: co.contract.split(user.market)[0] + '/' + user.market // 合约帐户单位 币对
      }
    },
    // 转入input框 精度限制
    keyUpInInput (e) {
      let { _coinList } = this.$store.state.baseData
      let coinObj = _coinList[this.inObj.coinType]
      this.inObj.inpV = this._P.fixInput(this.inObj.inpV, coinObj.showPrecision)
    },
    // 转入弹层 取消 和 右上x号
    closeInDialog () { this.inFlag = false },
    // 转入弹层 全部转入事件
    inAllCLICK () {
      this.inObj.inpV = this.inObj.maxNum
      this.$forceUpdate()
    },
    // 转入按钮 聚焦后隐藏error字段
    ininpfocus () {
      if (this.inObj.errorFlag) {
        this.inObj.errorFlag = false
        this.$forceUpdate()
      }
    },
    // 转入弹层 确认按钮
    InDialog_true () {
      // input内容  最大  币种  资产id  合约id
      let { inpV, maxNum, coinType, userId, coId } = this.inObj
      inpV = Number(inpV)
      if (inpV > 0 && inpV <= maxNum) {
        if (!this.inClickBut) { return }
        this.inClickBut = false
        this.axios({
          url: 'capital_transfer',
          hostType: 'co',
          params: {
            symbolMarket: coinType.toLowerCase(), // 市场
            fromType: userId, // 被划转合约
            toType: coId, // 划转合约
            amountStr: inpV // 划转数量
          }
        }).then((e) => {
          this.inClickBut = true
          if (e.code === '0') {
            this.getListData() // 刷新列表数据
            this.inFlag = false // 关闭弹层
            this.$store.dispatch('setTipState', {text: this.$t('co.funds.success'), type: 'success'}) // 操作成功提示
            this.$forceUpdate()
          } else {
            this.$store.dispatch('setTipState', {text: this.$t(`co.error.${e.code}`), type: 'error'})
          }
        })
      } else {
        this.inObj.errorFlag = true
        this.$forceUpdate()
      }
    },
    //  ====================  转出  ====================
    // 列表中点击转出按钮
    evenClickOut (user, co) {
      this.outFlag = true
      this.outObj = {
        userId: user.coin_type, // fromID
        coId: co.contract_type, // toID
        maxNum: co.trans_amount, // 可用
        coinType: user.market, // 交易帐户单位 币种
        symbol: co.contract.split(user.market)[0] + '/' + user.market // 合约帐户单位 币对
      }
    },
    // 出input框 精度限制
    keyUpOutInput (e) {
      let { _coinList } = this.$store.state.baseData
      let coinObj = _coinList[this.outObj.coinType]
      this.outObj.inpV = this._P.fixInput(this.outObj.inpV, coinObj.showPrecision)
    },
    // 转出弹层 取消 和 右上x号
    closeOutDialog () { this.outFlag = false },
    // 转入弹层 全部转入事件
    outAllCLICK () {
      this.outObj.inpV = this.outObj.maxNum
      this.$forceUpdate()
    },
    // 转入按钮 聚焦后隐藏error字段
    outinpfocus () {
      if (this.outObj.errorFlag) {
        this.outObj.errorFlag = false
        this.$forceUpdate()
      }
    },
    // 转出弹层 确认按钮
    outDialog_true () {
      // input内容  最大  币种  资产id  合约id
      let { inpV, maxNum, coinType, userId, coId } = this.outObj
      inpV = Number(inpV)
      if (inpV > 0 && inpV <= maxNum) {
        if (!this.outClickBut) { return }
        this.outClickBut = false
        this.axios({
          url: 'capital_transfer',
          hostType: 'co',
          params: {
            symbolMarket: coinType.toLowerCase(), // 市场
            fromType: coId, // 被划转合约
            toType: userId, // 划转合约
            amountStr: inpV // 划转数量
          }
        }).then((e) => {
          this.outClickBut = true
          if (e.code === '0') {
            this.getListData()
            this.outFlag = false
            this.$store.dispatch('setTipState', {text: this.$t('co.funds.success'), type: 'success'})
            this.$forceUpdate()
          } else {
            this.$store.dispatch('setTipState', {text: this.$t(`co.error.${e.code}`), type: 'error'})
          }
        })
      } else {
        this.outObj.errorFlag = true
        this.$forceUpdate()
      }
    }
  }
}
</script>

