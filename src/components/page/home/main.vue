<template>
  <div class="m-main bg-color font-color" > 
  <!-- 轮播 -->
    <div class="carousel">
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
    <!-- 公告 -->
    <div class="noticeBox" id="noticeBox">
      <div class="main-content">
        <i class="horn icon-broadcast"></i>
        <template v-if="noticeInfoList.length > 1">
          <slider :pages="noticeInfoList" :sliderinit="noticeinit" @tap='noticesOnTap'></slider>
        </template>
        <template v-else>
          <p class="notice" v-if="notice" @click="notices(notice.id)">{{notice.title}}</p>
        </template>
        <p @click="notices(notice.id)" class="notices_more">{{this.$t('main.more')}}></p>
      </div> 
    </div>
    <!-- 市场 -->
    <template v-for="(item, index) in itemArray">
      <div v-if="item === 'ex'">
        <!-- 交易所市场 -->
        <market-ex v-show="currentItem === 'ex'"></market-ex>
      </div>
      <div v-if="item === 'otc'">
        <!-- 场外市场 -->
        <market-otc v-show="currentItem === 'otc'"></market-otc>
      </div>
      <div v-if="item === 'co'">
        <!-- 合约市场 -->
        <market-co v-show="currentItem === 'co'"/>
      </div>
    </template>
    <!-- 调试首页三站数据 -->
    <div class="main-content">
      <ul class="siteTab clearfix" v-if="itemArray.length > 1">
        <li v-for="(item, index) in itemArray"
            :key='index'
            :class="{selected: currentItem === item}" 
            @click="switchItem(item)">
            <template v-for="itemName in itemArrayText" v-if="itemName.val === item">
              {{itemName.text}}
            </template>
        </li>
      </ul>
    </div>
    <!-- 调试首页三站数据-结束 -->
    <!-- 自定义首页内容 -->
    <div id="content-prompt" v-if="prompt" v-html="prompt"></div>
    <!-- 自定义首页内容-结束 -->
    <p v-if="!public_info"></p>
  </div>
</template>
<script>

import { mapState } from 'vuex'
import slider from 'vue-concise-slider'// 引入slider组件
import marketEx from './ex.vue'// 引入交易所的首页
import marketOtc from './otc.vue'// 引入场外的首页
import marketCo from './co.vue'// 引入场外的首页
export default {
  name: 'm-main',
  components: {
    slider,
    marketEx,
    marketOtc,
    marketCo
  },
  data () {
    return {
      firstFlag: null,
      baseData: {},
      sildePage: [],
      isArr: [], // 轮播图数据
      mack: 0,   // 图片索引
      time: null, // 定时器
      notice: null,  // 公告
      sliderinit: {
        currentPage: 0,
        thresholdDistance: 500,
        thresholdTime: 300,
        autoplay: 10000,
        loop: true,
        infinite: 1,
        slidesToScroll: 1,
        timingFunction: 'ease',
        duration: 300
      },
      noticeinit: {
        pagination: false,
        currentPage: 0,
        thresholdDistance: 500,
        thresholdTime: 100,
        autoplay: 6000,
        loop: true,
        direction: 'vertical',
        infinite: 1,
        slidesToScroll: 1,
        timingFunction: 'ease',
        duration: 300
      },
      noticeInfoList: [],
      noticeList: [],
      host: this.$store.state.baseData._webSiteInfo,
      prompt: '',
      itemArray: [],
      currentItem: null,
      moreSite: false,
      myMarket: localStorage.getItem('myMarket')
        ? localStorage.getItem('myMarket').split(',')
        : []
    }
  },
  mounted () {
    this.getLundata()
    let siteType = window.siteType || ['ex']
    this.itemArray = siteType
    this.currentItem = this.itemArray[0]
  },
  computed: {
    ...mapState({
      public_info ({baseData}) {
        if (baseData.isReady && this.firstFlag) {
          this.baseData = baseData
          // this.prompt = baseData.prompt
          this.firstFlag = false
          return true
        } else {
          return true
        }
      }
    }),
    itemArrayText () {
      return [
        {
          text: '调试-首页币币数据（用于首页）',
          val: 'ex'
        },
        {
          text: '调试-首页场外数据（用于独立场外）',
          val: 'otc'
        },
        {
          text: '调试-首页合约数据（用户独立合约）',
          val: 'co'
        }
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
    notices (i) {
      localStorage.setItem('ntId', i)
      this.$router.push({name: 'notice_info', query: { ntId: i }})
    },
    // 切换Tab
    switchItem (type) {
      this.currentItem = type
    },
    getLundata () {
      this.axios({
        url: this.$store.state.url.common.index_data,
        headers: {},
        params: {},
        method: 'post'
      }).then((data) => {
        if (data.code === '0') {
          if (data.data.noticeInfoList && data.data.noticeInfoList.length > 0) {
            this.noticeList = data.data.noticeInfoList
            let noticearr = []
            for (let j = 0; j < this.noticeList.length; j++) {
              let noticeObj = {}
              noticeObj.html = '<p>' + this.noticeList[j].title + '</p>'
              noticearr.push(noticeObj)
            }
            this.noticeInfoList = noticearr
          }
          this.notice = data.data.noticeInfo
          let res = data.data.cmsAdvertList
          this.isArr = []
          let arr = []
          this.prompt = data.data.footer_warm_prompt
          for (let i = 0; i < res.length; i++) {
            let obj = {}
            obj.html = '<div><a target="_blank" href="' + res[i].httpUrl + '"><img src="' + res[i].imageUrl + '"></a></div>'
            arr.push(obj)
            this.isArr.push(res[i])
          }
          this.sildePage = arr
        } else {
          this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
        }
      })
    },
    onTap (data) {
      window.open(this.isArr[data.currentPage].httpUrl)
    },
    noticesOnTap (data) {
      let id = this.noticeList[data.currentPage].id
      localStorage.setItem('ntId', id)
      this.$router.push({name: 'notice_info', query: { ntId: id }})
    }
  }
}
</script>
