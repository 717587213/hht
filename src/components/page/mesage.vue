<template>

  <section class="mesage">
     <div class="mes-main clearfix">
        <div class="mes-slide">
           <ul>
             <li v-for="(item,index) in sideData" :key="index"  @click="slideClick(item)" :class="item.tid==silderType?'active':''">{{item.title}}</li>
           </ul>
        </div>
        <div class="mes-content">
            <div class="con-head">
                <h6>{{$t('message.my_message')}}</h6>
            </div>
            <div class="mode-he">
              <label>
                <input type="checkbox" class="checkAll" v-model="selection"> {{$t('message.select')}}
              </label>
              <span class="reade" @click="delAll"><i>{{$t('message.delete')}}</i></span>
              <span class="reade" @click="readAll">{{$t('message.read')}}</span>
            </div>
             <div class="loading" v-if="loading">
                          <loading></loading>
                        </div>
            <div v-else>
                <ul class="mes-body" v-if="mesgData.length > 0">
              <li v-for="(item,index) in mesgData" :key="index" class="clearfix">
                 <label>
                   <input type="checkbox" class="checkbox" v-model="checkboxArr" :value="item.id" @click="checkBox(item)">
                  <!-- <span :class="{tiveRad: item.status === 2}">{{messages[item.messageType-1]}}</span> -->
              </label>
              <!-- 消息内容 -->
              <span :class="{mess:item.show, tiveRad: item.status === 2}" class="mesag" v-html="item.messageContent" @click="read(item.id)">
              </span>
              <!-- <em v-if="item.messageContent.length > 70" @click="more(item)">{{item.state}}</em> -->
              <div class="option">
                <i class="time">{{item.ctime}}</i>
                <i class="delete" @click="deleon(item.id)"> {{$t('message.delete')}}</i>
              </div>
              </li>
            </ul>
                        <div class="record" v-if="mesgData.length <= 0">{{$t('message.no_message')}}</div>

            <Vpagination v-if="(message.count/message.pageSize) > 1"
                              :total="message.count"
                              :current-page='message.page'
                              :display='message.pageSize'
                              @pagechange="meschage($event)">
            </Vpagination>
            </div>
          
        </div>

     </div>
    
  </section> 

</template>

<script lang="js">
import Vpagination from '@/components/common/pagination'
import { mapState } from 'vuex'
import loading from '@/components/common/loadingModel'

export default {
  name: 'mesage',
  props: [],
  data () {
    return {
      sideData: '',
      mesgData: '',
      silderType: 0,
      loading: false,
      // 多选
      selection: false,
      single: false,
      checkboxArr: [],
      redId: [],
      message: {
        count: '',
        pageSize: 10,
        page: 1
      }
    }
  },
  mounted () {
    this.getData()
  },
  components: {
    Vpagination,
    loading
  },
  watch: {
    '$store.state.baseData._lan' (val) {
      this.getData()
    },
    'selection' (val) {
      this.checkboxAll(val)
    }
  },
  computed: {
    ...mapState({
      public_info ({baseData}) {
        if (baseData.isReady) {
          return baseData
        } else {
          return false
        }
      }
    })
  },
  methods: {
    slideClick (i) {
      this.loading = true
      if (i.tid) {
        this.silderType = i.tid
      } else {
        this.silderType = 0
      }
      let _this = this
      setTimeout(function () {
        _this.getData()
      }, 500)
    },
    // 全选
    checkboxAll (val) {
      if (!val) {
        this.checkboxArr = []
      } else {
        this.checkboxArr = []
        this.mesgData.forEach(element => {
          this.checkboxArr.push(element.id)
        })
      }
    },
    checkBox (v) {
      let mid = v.id
      if (this.checkboxArr.indexOf(mid) > -1) {
        this.checkboxArr = this.checkboxArr.filter(function (item, index, array) {
          return item !== mid
        })
      } else {
        this.checkboxArr.push(mid)
      }
    },
    read (i) {
      for (let index in this.mesgData) {
        // this.mesgData[index].show = true
        if (this.mesgData[index].id === i) {
          this.mesgData[index].show = !this.mesgData[index].show
          if (this.mesgData[index].status === 1) {
            this.readData(i)
            this.mesgData[index].status = 2
          }
        }
      }
    },
    getData () {
      this.axios({
        url: this.$store.state.url.common.message,
        headers: {},
        params: {
          pageSize: this.message.pageSize,
          messageType: this.silderType,
          page: this.message.page
        },
        method: 'post'
      }).then((data) => {
        if (data.code === '0') {
          this.loading = false
          this.message.count = data.data.count
          this.sideData = data.data.typeList
          let mess = data.data.userMessageList
          for (let i = 0; i < mess.length; i++) {
            mess[i].ctime = this._P.formatTime(mess[i].ctime)
            mess[i].show = true
            mess[i].state = this.$t('message.more')
          }
          this.mesgData = data.data.userMessageList
        } else {
          this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
        }
      })
    },
    deleData (ids) {
      this.axios({
        url: this.$store.state.url.common.message_del,
        headers: {},
        params: {
          ids: ids
        },
        method: 'post'
      }).then((data) => {
        if (data.code === '0') {
          this.$store.dispatch('setTipState', this.$t('user.questions.delete_succ'))
          this.checkboxArr = []
          this.getData()
          this.selection = false
        } else {
          this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
        }
      })
    },
      // 全部已读
    readAll () {
      this.readData(0)
    },
      // 删除-一条数据
    deleon (id) {
      this.deleData(id)
    },
      // 批量删除
    delAll () {
      if (this.checkboxArr.length !== 0) {
        this.deleData(this.checkboxArr.join(','))
      } else {
        this.$store.dispatch('setTipState', {text: this.$t('message.all_dele'), type: 'error'})
      }
    },
    meschage (page) {
      this.loading = true
      let _this = this
      setTimeout(function () {
        _this.getData()
      }, 500)
      this.message.page = page
      this.selection = false
    },
    readData (id) {
      this.$store.commit('MEAGEID', id)
      this.axios({
        url: this.$store.state.url.common.message_status,
        headers: {},
        params: {
          id: id
        },
        method: 'post'
      }).then((data) => {
        if (data.code === '0') {
          this.getData()
        } else {
          this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
        }
      })
    }
    // more (i) {
    //   // this.readData(i.id)
    //   for (let index in this.mesgData) {
    //     if (this.mesgData[index].id === i.id) {
    //       if (this.mesgData[index].show === false) {
    //         this.mesgData[index].show = true
    //         this.mesgData[index].state = this.$t('message.more')
    //       } else {
    //         this.mesgData[index].show = false
    //         this.mesgData[index].state = this.$t('message.Take')
    //       }
    //     }
    //   }
    // },

  }
}
</script>
