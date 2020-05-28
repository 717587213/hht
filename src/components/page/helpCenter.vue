<template>
  <section class="help-center">
    <div class="help-main clearfix">
      <div class="let-side">
         <ul>
           <li  v-for="(item,index) in helpList" :key="index" @click="changeli(item, index)" class="abroad">{{item.articleTypeName}}<b v-if="item.show" class="icon-down"></b> <b v-else class="icon-right"></b>
              <ul v-show ="item.show" class="help_list">
                <li v-for="(v,k) in item.cmsArticleList" :key="k" :class="{actives: v.fileName === helpCon.fileName}" @click.stop="doThis(v)" class="within">{{v.title}}</li>
              </ul>
           </li>
         </ul>
      </div>
      <div class="help-content">
          <p class="title">{{helpCon.ctimeLong}}</p>
          <h2>{{helpCon.title}}</h2>
          <div v-html="helpCon.content"></div>
      </div>
    </div>
  </section>
</template>

<script lang="js">
import { mapState } from 'vuex'

export default {
  name: 'help-center',
  props: [],
  data () {
    return {
      helpList: '',
      helpCon: '',
      file: ''
    }
  },
  mounted () {
    if (this.$route.query.fileName) {
      this.file = this.$route.query.fileName
    }
    this.gethelp()
    this.getfile()
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
    '$store.state.baseData._lan' (val, old) {
      if (old) {
        this.gethelp('lan')
      }
    }
  },

  methods: {
    changeli (v, k) {
      this.helpList.forEach(i => {
        if (v.show !== this.helpList[k].show) {
          i.show = false
        }
      })
      v.show = !v.show
    },
    doThis (i) {
      if (i.fileName === this.file) return false
      this.file = i.fileName
      this.$router.push({path: 'help_center', query: { fileName: i.fileName }})
      this.getfile()
    },
    gethelp (source) {
      this.axios({
        url: this.$store.state.url.common.helpList,
        headers: {},
        params: {},
        method: 'post'
      }).then((data) => {
        if (data.code === '0') {
          let file = {}
          let help = data.data
          for (let i in help) {
            help[i].show = false
            if (help[0].cmsArticleList && help[0].cmsArticleList.length > 0) {
              if (source === 'lan' || !this.$route.query.fileName) {
                file = help[0].cmsArticleList[0]
                help[0].show = true
              } else {
                for (let t in help[i].cmsArticleList) {
                  if (help[i].cmsArticleList[t].fileName === this.file) {
                    help[i].show = true
                  }
                }
              }
            }
          }
          if (source === 'lan' || !this.$route.query.fileName) {
            this.doThis(file)
          }
          this.helpList = help
        } else {
          // console.log(data.msg)
          this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
        }
      })
    },
    getfile () {
      this.axios({
        url: this.$store.state.url.common.info,
        headers: {},
        params: {
          fileName: this.file
        },
        method: 'post'
      }).then((data) => {
        if (data.code === '0') {
          this.helpCon = data.data
          this.helpCon.ctimeLong = this._P.formatTime(data.data.ctimeLong)
        } else {
          console.log(data.msg)
          // this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
        }
      })
    }

  }
}
</script>