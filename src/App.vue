<template>
  <section class="VuePage"   v-on:dblclick="ondblclick" @click="onclickfun">
    <tip />
    <router-view :key="activeDate"></router-view>
      <transition name="fade">
      <div id="page-loading" v-show="isshowLoading">
        <div class="bar">
          <loading-model></loading-model>
        </div>
        </div>
    </transition>
    <i style="display: none">{{indexTitle}}</i>
    <div class="addpageDialog">
    <el-dialog
      :title='alerttitle'
      :flag='copyShow'
      name= 'copyShow'
      :width='500'>
      <div slot="content" class="noMarketList">
          {{$t('public.all.tpis')}}
      </div>
    </el-dialog >
    </div>
  </section>
</template>
<script>
import tip from './components/common/tip'
import changeTheme from './utils/changeTheme.js'
import bus from './apis/bus.js'
import loadingModel from '@/components/common/loadingModel'
import elDialog from '@/components/common/dialog'
import JWFP from '../static/jwfp'
export default {
  name: 'app',
  components: {
    tip,
    elDialog,
    loadingModel
  },
  data () {
    return {
      lan: null,
      coverKlineBox: null,
      isshowLoading: false,
      startTimestamp: null,
      indexHeaderTitle: null,
      routeMeta: this.$route.name,
      defaultTheme: this.$store.state.baseData.defaultTheme,
      rateArr: ['index', 'coinTran', 'funds'],
      baseData: this.$store.state.baseData._data
    }
  },
  mounted () {
    let self = this
    // 埋点
   // this.buriedPoint()
    // public_info 请求
    this.$store.dispatch('getCommonPublic_info')
    // user_info
    this.$store.dispatch('getCommonUser_info')
    // otc public_info
    if (window.siteType.indexOf('otc') !== -1) {
      this.$store.dispatch('otcPublic_info')
    }
    // otc public_info
    if (window.siteType.indexOf('co') !== -1) {
      this.axios({
        url: this.$store.state.coUrl.public_info,
        hostType: 'co'
      }).then((e) => {
        if (e.code === '0') {
          this.$store.dispatch('setCoPublicData', e.data)
        }
      })
    }
    bus.$on('loginOut', (e) => {
      self.$store.commit('ISLOGIN', false)
    })
    // 加载默认皮肤
    if (!localStorage.getItem('theme-type') || localStorage.getItem('theme-type').split('-')[1]) {
      localStorage.setItem('theme-type', this.defaultTheme)
    }
    let theme = localStorage.getItem('theme-type')
    this.$nextTick(() => {
      changeTheme(theme)
      self.$store.commit('THEME', theme)
    })
    let routeName = {title: this.$route.name}
    document.title = this.$t('pageTitle.' + routeName.title)
    // 设置汇率
    if (this.rateArr.indexOf(this.$route.name) === -1) {
      this.$store.dispatch('getRate_info', false)
    } else {
      this.$store.dispatch('getRate_info', true)
    }
  },
  watch: {
    // public_info 数据
    '$store.state.baseData._data' (val) {
      this.baseData = val
    },
    // 在首页，币币交易，资金管理页面 长轮询汇率接口的请求
    '$route.name' (val) {
      if (this.rateArr.indexOf(val) === -1) {
        this.$store.dispatch('getRate_info', false)
      } else {
        this.$store.dispatch('getRate_info', true)
      }
    },
    '$store.state.baseData._symbols' (val) {
      if (Object.keys(val).length < 1) {
        this.copyShow = true
      }
    },
    // 设置页面的title
    '$route.meta' (val) {
      if (val.title) {
        this.routeMeta = val.title
      }
    },
    '$store.state.baseData._lan' (val, oldVal) {
      if (oldVal) {
        // 切换语言重新请求自定义的 footer 和 header
        if (this.baseData.config_footer_open === '1' || this.baseData.config_header_open === '1') {
          this.$store.dispatch('getFooterHeander_info')
        }
      }
      this.lan = val
    },
    '$store.state.baseData.indexHeaderTitle' (val) {
      this.indexHeaderTitle = val
    },

    '$store.state.options.isshowLoading' (val) {
      if (val) {
        this.startTimestamp = Date.parse(new Date())
        this.isshowLoading = true
      } else {
        let endTimestamp = Date.parse(new Date())
        let difference = endTimestamp - this.startTimestamp
        let number = 0
        if (difference < 1000) {
          number = 1000 - difference
        }
        setTimeout(() => {
          this.isshowLoading = false
        }, number)
      }
    }
  },
  computed: {
    activeDate () {
      return this.$store.state.baseData.activeDate
    },
    indexTitle () {
      if (!this.indexHeaderTitle) {
        document.title = this.$t('pageTitle.' + this.routeMeta)
        return false
      }
      let baseTitle = ''
      this.indexHeaderTitle.map(item => {
        if (item.langKey === this.lan) {
          baseTitle = item.content + ' - '
        }
        document.title = baseTitle + this.$t('pageTitle.' + this.routeMeta)
        return false
      })
    },
    alerttitle () {
      return this.$t('user.questions.ques_prompt')
    },
    copyShow () {
      let o = false
      if (this.$store.state.baseData._symbols !== null && Object.keys(this.$store.state.baseData._symbols).length < 1) {
        o = true
      }
      return o
    }
  },
  methods: {
    ondblclick () {
      return false
    },
    onclickfun (e) {
      // 显示和隐藏币币交易页面 TradingView 的遮罩
      if (e.target.className === 'coverKlineBox') {
        this.coverKlineBox = e.target
        this.coverKlineBox.style.display = 'none'
      } else if (this.coverKlineBox) {
        this.coverKlineBox.style.display = 'block'
        this.coverKlineBox = null
      }
    },
    buriedPoint () {
      this.axios({
        url: 'data/pc_hash',
        headers: {},
        params: {},
        method: 'post'
      }).then((data) => {
        if (data.code === '0') {
          let prefix = ''
          if (process.env.NODE_ENV === 'development') {
            prefix = '/ex-api/'
          } else {
            let protocol = location.protocol + '//' || 'https://'
            prefix = protocol + window.HOST_API.ex_api + '/'
          }
          prefix = prefix + 'data/jwfp'
          let fp = new JWFP()
          fp.init(data.data, prefix, (e) => {})
        }
      })
    }
  }
}
</script>
<style>
  .VuePage {
    display: none;
  }
  .noMarketList{
    padding-top: 30px;
    text-align: center;
  }
  .addpageDialog .dialog-pop .dialog-close{
    display: none;
  }
</style>
