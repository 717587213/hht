<template>

  <div class="cms">
     <div class="cms-main clearfix">
       <!-- 左侧 -->
       <div class="aside">
          <ul class="aside-menu">
              <router-link  v-for="(v,i) in cmsData" :key="i" :class="{color:v.fileName === cmsfile}" tag="li" :to= "{path:'cms',query: {id: v.fileName}}">
                {{v.title}}
              </router-link>
              <template>
              </template>
          </ul>
       </div>
       <div class="cms-content" >
          <p class="title">{{article.ctimeLong}}</p>
          <h2>{{article.title}}</h2>
         <div v-html="article.content"></div>
       </div>
     </div>
  </div>

</template>

<script lang="js">
import {mapState} from 'vuex'
export default {
  name: 'cms',
  props: [],
  data () {
    return {
      cmsData: {},
      cms: '',
      article: '',
      cmsfile: this.$route.query.id
    }
  },
  created () {
    this.getData()
  },
  computed: {
    ...mapState({
      symbols ({baseData}) {
        if (baseData.isReady) {
          return baseData
        } else {
          return false
        }
      }
    })
  },
  watch: {
    $route (val) {
      this.cmsfile = val.query.id
      this.getfile()
    },
    '$store.state.baseData._lan' (val) {
      this.getData()
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
          this.cmsData = data.data
          if (this.$route.query.id) {
            this.cmsfile = this.$route.query.id
          } else {
            this.cmsfile = data.data[0].fileName
          }
          this.getfile()
        } else {
          this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
        }
      })
    },
    getfile () {
      this.axios({
        url: this.$store.state.url.common.info,
        headers: {},
        params: {
          fileName: this.cmsfile
        },
        method: 'post'
      }).then((data) => {
        if (data.code === '0') {
          this.article = data.data
          this.article.ctimeLong = this._P.formatTime(data.data.ctimeLong)
        } else {
          console.log(data.msg)
          // this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
        }
      })
    }
  }

}
</script>

<style  lang="stylus" scoped>

</style>
