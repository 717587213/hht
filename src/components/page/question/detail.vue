<template>

  <section class="detail ">
    <!-- 提问列表-详情页 -->
   <div class="info-details">
     <ul class="ques-tag clearfix">
                  <li @click="questab()" >{{$t('user.questions.ask')}}</li>
                  <li class="tab_switch">{{$t('user.questions.questionList')}}</li>
                </ul>
     <div class="details-box ">
             <button class="back " @click="goback()"><b></b>{{$t('user.questions.detail.return_list')}} </button>
                <!-- 问题信息列表 -->
                <div class="problem-list clearfix">
                  <ul>
                    <li>
                      <span>{{ this.$t('user.questions.pronum')}}:</span>
                      <p>{{proInfor.id}}</p>
                    </li>
                      <li>
                      <span>{{this.$t('user.questions.prostate')}}:</span>
                      <p>{{proInfor.rqStatusName}}</p>
                    </li>
                      <li>
                      <span>{{this.$t('user.questions.proType')}}:</span>
                      <p>{{proInfor.rqTypeName}}</p>
                    </li>
                      <li>
                      <span>{{ this.$t('user.questions.subTime')}}:</span>
                      <p>{{proInfor.ctime}}</p>
                    </li>
                      <li class="problem-pic">
                      <span>{{this.$t('user.questions.prodesc')}}:</span>
                      <p>{{proInfor.rqDescribe}}</p>
                    </li>
                     <li class="problem-pic">
                      <span>{{$t('user.questions.detail.annex')}}:</span>
                      <p><img :src="proInfor.imageDataStr" alt=""></p>
                    </li>
                  </ul>
              </div>
 
                <!-- 问题追加  -->
         <div class="questions-list" v-if="proInfor.rqStatus!== 3">
              <!-- 问题信息 -->
              <div class="dispose-list-box">
                    <div class="dispose-list" v-for="item in additional">
                      <span>{{rqstate[item.userType -1]}}:</span>
                      <p>{{item.replayContent}}</p>
                      <p class="time time-color">{{item.ctime}}</p>
                    </div>
                  
              </div>
              <div class="additional">
                     <span>{{this.$t('user.questions.detail.append')}}:</span>
                     <div class="chart">
                     <textarea name="" id="" v-model="putques"   @keyup="key()"></textarea>
                      <p v-show="addpro" class="prom">{{this.$t('user.questions.add_message_content')}}</p>
                     <p class="prompt">{{$t('user.questions.detail.prompt')}}{{1000-putques.length}}{{$t('user.questions.detail.prompts')}}</p>
                     </div>           
                     <button id="btn" @click="submit()">{{$t('user.questions.detail.submission')}}</button>
              </div>
          </div>
       </div>   
   </div>

  </section>

</template>

<script lang="js">
import { mapState } from 'vuex'
export default {
  name: 'detail',
  data () {
    return {
      fass: false,
      list: true,
      proInfor: '', // 问题列表
      additional: '', // 追加数据
      number: 1000,  // 字数
      putques: '',
      addpro: '',
      current: 'ListQues'
    }
  },
  computed: {
    ...mapState({
      problem ({mesage}) {
        return mesage
      }
    }),
    rqstate () {
      return [
        this.$t('user.questions.rqstatus.value1'),
        this.$t('user.questions.rqstatus.value2')
      ]
    }
  },
  mounted () {
    this.getData()
  },
  watch: {
    '$store.state.baseData._lan' (val) {
      this.getData()
    }
  },
  methods: {
    goback () {
      this.$router.push({ name: 'questions' })
      this.$store.commit('RETURN', 'ListQues')
    },
      // 阻止输入
    key () {
      this.addpro = false
      if (this.putques.length >= 1000) {
        this.putques = this.putques.substr(0, 1000)
      }
    },
    getData () {
      this.axios({
        url: this.$store.state.url.personal.quest_get,
        headers: {},
        params: {
          id: this.problem.problemId || localStorage.getItem('promId')
        },
        method: 'post'
      }).then((data) => {
        if (data.code === '0') {
          let problem = data.data.rqInfo
          problem.ctime = this._P.formatTime(problem.ctime)
          this.proInfor = problem
            // 处理提问列表时间
          let res = data.data.rqReplyList
          for (let i = 0; i < res.length; i++) {
            res[i].ctime = this._P.formatTime(res[i].ctime)
          }
          this.additional = data.data.rqReplyList
        } else {
          this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
        }
      })
    },
    submit () {
      if (this.putques === '') {
        this.addpro = true
      } else {
        this.addpro = false
        this.axios({
          url: this.$store.state.url.personal.reply_create,
          headers: {},
          params: {
            rqId: this.problem.problemId || localStorage.getItem('promId'),
            rqReplyContent: this.putques,
            contentType: 1
          },
          method: 'post'
        }).then((data) => {
          if (data.code === '0') {
            this.putques = ''
            this.getData()
            this.$store.dispatch('setTipState', this.$t('user.questions.submission'))
          } else {
            this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
          }
        })
      }
    },
    questab () {
      this.$router.push({ name: 'questions' })
      this.$store.commit('RETURN', 'LaunchQues')
    }
  }
}
</script>

<style scoped lang="stylus">

</style>
