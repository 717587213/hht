<template >
  <section >
    <div class="ques-main">
           <div class="ques-main-content">
                <ul class="ques-tag clearfix">
                  <li @click="questab('LaunchQues')" :class="{tab_switch:current === 'LaunchQues' }">{{$t('user.questions.ask')}}</li>
                  <li @click="questab('ListQues')" :class="{tab_switch:current === 'ListQues'}">{{$t('user.questions.questionList')}}</li>
                </ul>
           <template>
             <!-- 发起提问 -->
              <div class="ques"  :class="{exhibition: current === 'LaunchQues' }">
                 <el-dialog :flag='hints'
                            :title='quesprompt'
                            :width='450'
                            :dialogClose='determine'>
          <div slot="content">{{hintsContent}}</div>
          <div slot="options"><button @click="determine('hints')">{{$t('user.api.determine')}}</button></div>
        </el-dialog>
                <ul>
                  <li class="chios"> 
                      <template >
                          <inline-input :property = "quetlaun" v-model = "quetlaun.value"></inline-input>
                      </template>
                  </li>
                  <li>
                      <div class="warrel">
                      <textarea name="" id="" cols="30" rows="10" ref="textInp" v-model="content"></textarea>
                      </div>
                  </li>
                  <li>
                       <div class="upfile clearfix">
                        <span>{{$t('user.questions.upload')}}<input type="file"  @change="fileChange($event)"
                              accept="image/png, image/jpeg, image/jpg"
                              name="file" 
                              ref="fileInp"></span>
                        <i>{{mation}}</i>
                        <br>
                        <br>
                        <img :src="imgSrc" alt="" style="max-width:300px;max-height:300px">
                        </div>
                  </li>
                </ul>
                <button :class='{readOnly: uploading}' @click="submit" >{{$t('user.questions.button')}}</button>
         </div>
         <!-- 问题列表 -->
            <div class="ques-list" :class="{exhibition: current === 'ListQues' }">
              <div class="loading" v-if="loadingShow">
                  <loading></loading>
              </div>
                  <div class="list" v-else>
                      <table class="list-table">
                          <thead>
                            <tr>
                              <th v-for="(item,index) in internList" :key="index">{{item}}</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(item,index) in rqInfoList " :key="index" v-if="rqInfoList.length > 0">
                              <td>{{item.id}}</td>
                              <td >{{item.rqTypeText}}</td>
                              <td class="content" width='450'>{{item.rqDescribe}}</td>
                              <td>{{item.ctime}}</td>
                              <td>{{item.rqStatusText}}</td>
                              <td class="state state-color"><span @click="see(item.id)">{{$t('user.questions.see')}}</span> <span  @click="dele(index,item.id)">{{$t('user.questions.delete')}}</span></td>
                            </tr>
                          </tbody>
                      </table>
                      <Vpagination v-if="(pagination.count/pagination.pageSize) > 1"
                                              :total="pagination.count"
                                              :current-page='pagination.page'
                                              :display='pagination.pageSize'
                                              @pagechange="prochage($event)">
                                        </Vpagination>
                                      
                          <p v-if="rqInfoList.length < 1" class="record">{{$t('user.questions.no_data')}}</p>
                      </div>
                                          
                </div>
           </template>
           </div>
    </div>
   </section>

</template>

<script lang="js">
import InlineInput from '@/components/common/inlineInput'
import elDialog from './../../common/dialog'
import loading from '../../common/loadingModel'
import Vpagination from '@/components/common/pagination'
import { mapState } from 'vuex'
export default {
  name: 'questions',
  props: [],
  components: {
    InlineInput,
    elDialog,
    Vpagination,
    loading
  },
  data () {
    return {
      current: 'LaunchQues',  // 默认显示发起提问
      hints: false,           // 弹框-默认隐藏
      hintsContent: '',       // 弹框显示内容
      mation: this.$t('user.questions.Prompt'),  // 图片错误提示
      content: '',            // 内容
      elInput: null,
      imgSrc: null,
      quesprompt: this.$t('user.questions.ques_prompt'),
      questions: '',
      codes: '',
      ladObj: {
        rqType: null,
        rqDescribe: null,
        imageDataStr: null
      },
      loadingShow: false,
      quetlaun: {
      },
      // 问题列表分页
      pagination: {
        count: '',
        pageSize: 10,
        page: 1
      },
      // 列表数据
      rqInfoList: [],
      uploading: false,
      flag: true
    }
  },
  watch: {
    'quetlaun_obj' (val) {
      this.quetlaun = val
    },
    '$store.state.baseData._lan' (val) {
      this.tip_list()
      this.questData()
      this.mation = this.$t('user.questions.Prompt')
    }
  },
  mounted () {
    this._P.fixUrl('code') && (this.codes = this._P.fixUrl('code'))
    this.quetlaun = this.quetlaun_obj
    if (this.codes) {
      this.quetlaun.value = 7
    }
    this.tip_list()
    if (this.$store.state.mesage.probleReturn) {
      this.questab(this.$store.state.mesage.probleReturn)
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
    }),
    internList () {
      return [
        this.$t('user.questions.pronum'),
        this.$t('user.questions.proType'),
        this.$t('user.questions.prodesc'),
        this.$t('user.questions.subTime'),
        this.$t('user.questions.prostate')
      ]
    },
    typeArr () {
      return [
        this.$t('user.questions.display.value_1'),
        this.$t('user.questions.display.value_2'),
        this.$t('user.questions.display.value_3'),
        this.$t('user.questions.display.value_4'),
        this.$t('user.questions.display.value_5'),
        this.$t('user.questions.display.value_6'),
        this.$t('user.questions.display.value_7')
      ]
    },
    rqstate () {
      return [
        this.$t('user.questions.rqstatus.value1'),
        this.$t('user.questions.rqstatus.value2'),
        this.$t('user.questions.rqstatus.value3')
      ]
    },
    quetlaun_obj () {
      return {
        formType: 'select',
        name: 'select',
        value: '',
        placeholder: this.$t('user.questions.pro_type'),
        optionList: ''
      }
    }
  },
  methods: {
    questab (tag) {
      let _this = this
      this.current = tag
      this.loadingShow = true
      setTimeout(function () {
        _this.questData()
      }, 500)
      if (tag === 'LaunchQues') {
        this.tip_list()
      }
    },
    // 上传图片
    fileChange (e) {
      let fileSize = e.target.files[0].size / 1024 / 1024
      if (fileSize <= 5) {
        const reader = new FileReader()
        reader.readAsDataURL(this.$refs.fileInp.files[0])
        reader.onload = (e) => {
          this.uploading = true
          this.$store.dispatch('setTipState', this.$t('personal.uploadIn'))
          this.upload(reader)
          this.imgSrc = reader.result
        }
      } else {
        this.mation = this.$t('user.questions.Prompt')
      }
    },
    upload (file) {
      if (file) {
        let _from = new FormData()
        _from.append('file', this.$refs.fileInp.files[0], this.$refs.fileInp.files[0].name)
        let isOpenUploadImg = this.$store.state.baseData._data.is_open_upload_img || '0'
        this.axios({
          url: this.$store.state.url.common.upload_img,
          hostType: (isOpenUploadImg === '1') ? 'upload' : null,
          headers: {'Content-Type': 'multipart/form-data'},
          params: _from,
          method: 'post'
        }).then(res => {
          this.uploading = false
          if (res.code === '0') {
            this.ladObj.imageDataStr = res.data.filename
            this.$store.dispatch('setTipState', this.$t('user.questions.upload_success'))
          } else {
            this.$store.dispatch('setTipState', {text: this.$t('error.' + res.code), type: 'error'})
          }
        })
      }
    },
    // 提交
    submit () {
      // 问题描述
      if (this.uploading) {
        return false
      }
      let val = this.$refs.textInp.value
      if (val === '') {
        this.hints = true
        this.hintsContent = this.$t('user.questions.pro_describe')
        this.ladObj.rqDescribe = null
      } else {
        this.ladObj.rqDescribe = val
      }
      // 问题类型
      var res = this.quetlaun.value
      if (res === null) {
        this.hints = true
        this.hintsContent = this.$t('user.questions.pro_type')
      } else {
        this.ladObj.rqType = res
      }
      if (val !== '' && res !== null) {
        if (!this.flag) return false
        this.flag = false
        this.axios({
          url: this.$store.state.url.personal.create_problem,
          headers: {},
          params: this.ladObj,
          method: 'post'
        }).then((data) => {
          if (data.code === '0') {
            this.$store.dispatch('setTipState', this.$t('user.questions.submission'))
            this.content = ''
            this.$nextTick(() => {
              this.quetlaun.value = null
            })
            this.imgSrc = ''
            this.mation = this.$t('user.questions.Prompt')
            this.$refs.fileInp.value = ''
          } else {
            this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
          }
          this.flag = true
        }).catch(() => {
          this.flag = true
        })
      }
    },
       // 查看
    see (v) {
      localStorage.setItem('promId', v)
      this.$store.commit('PROBLEM', v)
      this.$router.push({ name: 'detail' })
    },
    ievent (data) {
      this.list = data
    },
    // 获取列表数据
    questData () {
      this.axios({
        url: this.$store.state.url.personal.quest_list,
        headers: {},
        params: {
          page: this.pagination.page,
          pageSize: this.pagination.pageSize
        },
        method: 'post'
      }).then((data) => {
        if (data.code === '0') {
          this.loadingShow = false
          var res = data.data.rqInfoList
          // 处理时间戳
          for (let i = 0; i < res.length; i++) {
            res[i].ctime = this._P.formatTime(res[i].ctime)
          }
          this.rqInfoList = data.data.rqInfoList
          this.pagination.count = data.data.count
        } else {
          this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
        }
      })
    },
    prochage (page) {
      this.loadingShow = true
      let _this = this
      this.pagination.page = page
      setTimeout(function () {
        _this.questData()
      }, 500)
    },
    // 删除
    dele (v, id) {
      this.rqInfoList.splice(v, 1)
      this.axios({
        url: this.$store.state.url.personal.quest_delete,
        headers: {},
        params: {
          id: id
        },
        method: 'post'
      }).then((data) => {
        if (data.code === '0') {
          this.$store.dispatch('setTipState', this.$t('user.questions.delete_succ'))
          this.questData()
        } else {
          this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
        }
      })
    },
    // 问题类型
    tip_list () {
      this.axios({
        url: this.$store.state.url.personal.problem_tip_list,
        headers: {},
        params: {
        },
        method: 'post'
      }).then((data) => {
        if (data.code === '0') {
          this.quetlaun.optionList = data.data.rqTypeList
        }
      })
    },
    // 控制弹框
    determine () {
      this.hints = false
    }
  },
  created () {}
}
</script>

<style lang="stylus" scoped>

</style>
