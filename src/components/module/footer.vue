<template>
  <div id="footer-box" class="foot">
      <p style="display: none" v-if="public_info"></p>
         <template v-if="configFooterOpen === '1'">
        <!-- 后台配置的 footer -->
        <div v-html='footerTemplate'></div>
      </template>
         <template v-else>
        <!-- 默认显示的 footer -->
        <div class="default-foot-min">
        <div class="foot-min-top clearfix">
          <div class="foot-min-left clearfix">
            <ul class="get_data">
              <li v-for="(item,index) in fotdata" :key="index" v-if="fotdata.length > 0" class="uside">
                <router-link tag="span" :to= "{path:'/cms',query: {id: item.fileName}}">{{item.title}}</router-link>
              </li>
              <li class="uside"><router-link  tag="span" to="/help_center">{{$t('public.ft.help')}}</router-link></li>
            </ul>
          </div>
          <div class="foot-min-right">
            <div class="logo">
              <img :src="logo" alt="">
            </div>
            <div class="phone">
             <!-- <i class="icon-phone"></i> -->
              <span>{{number}}</span>
            </div>
            <div class="email clearfix">
              <!-- <i class="icon-letters"></i>  -->
              <div>
                <span>{{email}}</span>
              </div>
            </div>
          <div class="foot-right-btm" v-if="chaindown !== -1">
            <ul>
              <li><a href="javascript(0)"><img src="@/assets/img/footer/F.png" alt=""></a></li>
              <li><a href="javascript(0)"><img src="@/assets/img/footer/T.png" alt=""></a></li>
              <li><a href="javascript(0)"><img src="@/assets/img/footer/wechat.png" alt=""></a></li>
              <li><a href="javascript(0)"><img src="@/assets/img/footer/xl.png" alt=""></a></li>
              <li> <a href="javascript(0)"><img src="@/assets/img/footer/by.png" alt=""></a></li>
            </ul>
          </div>
          </div>
          </div>
          <div class="foot-min-bottom">
            <p>Copyright © 2018 {{name}}. All rights reserved</p>
          </div>
        </div>
      </template>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'foot',
  data () {
    return {
      fotdata: '',
      logo: null,
      footerTemplate: null,
      configFooterOpen: null,
      chaindown: location.host.indexOf('chaindown')
    }
  },
  mounted () {
    this.getData()
  },
  computed: {
    ...mapState({
      public_info ({baseData}) {
        if (baseData.isReady) {
          this.logo = baseData.logo
          this.configFooterOpen = baseData._data.config_footer_open
          this.footerTemplate = baseData.footerTemplate
          return baseData
        } else {
          return false
        }
      }

    }),
    number () {
      if (this.$store.state.baseData._footer) {
        return this.$store.state.baseData._footer.number
      }
      return null
    },
    email () {
      if (this.$store.state.baseData._footer) {
        return this.$store.state.baseData._footer.email
      }
      return null
    },
    name () {
      if (this.$store.state.baseData._footer) {
        return this.$store.state.baseData._footer.name
      }
      return null
    }
  },
  watch: {
    '$store.state.baseData._lan' (val, old) {
      if (old) {
        this.getData()
      }
    }
  },
  methods: {
    getData () {
      this.axios({
        url: this.$store.state.url.common.footer,
        headers: {},
        params: {},
        method: 'post'
      }).then((data) => {
        if (data.code === '0') {
          this.fotdata = data.data
        } else {
          this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
        }
      })
    }
  }
}
</script>

