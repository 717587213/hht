<template>

  <section class="agent">
      <div class="agent-list">
          <div class="agent-head clearfix">
              <div class="agent-tag">
                <span @click="agentag('summary')" :class="{agentive: agentList === 'summary'}">{{$t('user.economic_man.summaryList')}}</span>
                <span @click="agentag('detailed')" :class="{agentive: agentList === 'detailed'}">{{$t('user.economic_man.detailedList')}}</span>
              </div>
              <div class="head-right clearfix">
                   <div class="start">
                     <span>{{$t('user.economic_man.startDate')}}</span>
                      <v-date-picker
                          mode='single'
                          v-model='selectedDate'
                          :max-date='new Date()'
                          >
                          <div :type='inputState.type' slot-scope='props'>
                            <input
                              type='text'
                              :value='props.inputValue'
                              :placeholder='inputState.message'
                              @change.native='props.updateValue($event.target.value)'
                              expanded>
                          </div>
                        </v-date-picker>
                   </div>
                  <div class="ent">
                    <span>{{$t('user.economic_man.endDate')}}</span>
                    <v-date-picker
                          mode='single'
                          v-model='selecteDate'
                          >
                          <div :type='inputState.type' slot-scope='props'>
                            <input
                              type='text'
                              :value='props.inputValue'
                              :placeholder='inputState.message'
                              @change.native='props.updateValue($event.target.value)'
                              expanded>
                          </div>
                        </v-date-picker>
                  </div>
                  <div class="select">
                      <inline-input :property = "currentList" v-model = "currentList.value" v-on:onevents="setsymbol"></inline-input>
                  </div>
                  <button type="submit" class="search" @click="search">{{$t('user.economic_man.search')}}</button>
              </div>
          </div>
          <div class="agent-content">
            <!-- 汇总表 -->
            <div class="summaryList" :class="{exhibition: agentList === 'summary' }">
               <div class="loading" v-if="loading_entrust">
                         <loading></loading>
                </div>
            <div v-else>
              <div v-if="collecData.length>0">
              <table>
                <thead>
                   <tr>
                    <th>{{$t('user.economic_man.statisticsDate')}}</th>
                    <th>{{$t('user.economic_man.currencyName')}}</th>
                    <th>{{$t('user.economic_man.sums')}}</th>
                    <th>{{$t('user.economic_man.divide')}}</th>
                    <th>{{$t('user.economic_man.establish')}}</th>
                   </tr>
                 </thead>
                 <tbody>
                   <tr v-for="(item,index) in collecData" :key="index">
                     <td>{{item.ctimeStr}}</td>
                     <td>{{item.symbol}}</td>
                     <td>{{item.collectAmount}}</td>
                     <td>{{item.divideAmount}}</td>
                     <td>{{item.statDateStr}}</td>
                   </tr>
                 </tbody>
              </table>
              <Vpagination v-if="(colle.count/colle.pageSize) > 1"
                              :total="colle.count"
                              :current-page='colle.page'
                              :display='colle.pageSize'
                              @pagechange="collechange($event)" class="page">
              </Vpagination>
               </div>
               <div v-if="collecData.length <= 0">
             <table class="no_record">
                <tbody>
                    <tr>
                      <td class="record">{{this.$t('otc.personal.nodata')}}</td>
                    </tr>
                </tbody>
             </table>
           </div>
                 </div>
            </div>
            <!-- 详细表 -->
            <div class="detailedList" :class="{exhibition: agentList === 'detailed' }">
              <div class="loading" v-if="loading_agent">
                         <loading></loading>
                </div>
              <div v-else>
                <div v-if="agentData.length > 0">
                <table>
                 <thead>
                   <tr>
                    <th>{{$t('user.economic_man.statisticsDate')}}</th>
                    <th>{{$t('user.economic_man.inviter')}}</th>
                    <th>{{$t('user.economic_man.currencyName')}}</th>
                    <th>{{$t('user.economic_man.sums')}}</th>
                    <th>{{$t('user.economic_man.divide')}}</th>
                    <th>{{$t('user.economic_man.establish')}}</th>
                   </tr>
                 </thead>
                 <tbody>
                   <tr v-for="(item,index) in agentData" :key="index">
                     <td>{{item.ctimeStr}}</td>
                     <td>{{item.chiId}}</td>
                     <td>{{item.symbol}}</td>
                     <td>{{item.collectAmount}}</td>
                     <td>{{item.divideAmount}}</td>
                     <td>{{item.statDateStr}}</td>
                   </tr>
                 </tbody>
              </table>
               <Vpagination v-if="(agent.count/agent.pageSize) > 1"
                              :total="agent.count"
                              :current-page='agent.page'
                              :display='agent.pageSize'
                              @pagechange="agentchange($event)" class="page">
              </Vpagination>
              </div>
               <div v-if="agentData.length <= 0">
             <table class="no_record">
                <tbody>
                    <tr>
                      <td class="record">{{this.$t('otc.personal.nodata')}}</td>
                    </tr>
                </tbody>
             </table>
           </div>
              </div>
            </div>
          </div>
          <i v-if="coinList"></i>
      </div>
  </section>

</template>

<script lang="js">
import { mapState } from 'vuex'
import InlineInput from '@/components/common/inlineInput'
import Vpagination from '@/components/common/pagination'
import loading from '../common/loadingModel'
export default {
  name: 'agent',
  props: [],
  components: {
    InlineInput,
    Vpagination,
    loading
  },
  mounted () {
    this.getagent()
    this.getcollect()
  },
  data () {
    return {
      agentList: 'summary',
      openAjax: false,
      collecData: null,
      agentData: null,
      loading_entrust: true,
      loading_agent: true,
      coin: '', // 币种
      start: {
        formType: 'text',
        name: 'enterust',
        readOnly: 'readOnly',
        value: null,
        placeholder: '',
        optionList: []
      },
      end: {
        formType: 'text',
        name: 'enterust',
        readOnly: 'readOnly',
        value: null,
        placeholder: '',
        optionList: []
      },
      currentList: {
        formType: 'select',
        name: 'currentList',
        value: '',
        placeholder: null,
        optionList: []
      },
      colle: {
        count: '',
        pageSize: 10,
        page: 1
      },
      agent: {
        count: '',
        pageSize: 10,
        page: 1
      },
      selectedDate: new Date(),
      selecteDate: new Date()
    }
  },
  watch: {
    'openAjax' (val) {
      if (val) {
        this.currens()
        this.openAjax = false
      }
    }
  },
  computed: {
    ...mapState({
      coinList ({baseData: {_coinList}}) {
        if (_coinList) {
          let coin = _coinList
          let arr = [{value: this.$t('user.economic_man.wholecoin'), code: ''}]
          for (let i in coin) {
            arr.push({value: coin[i].name, code: coin[i].name})
          }
          this.currentList.optionList = arr
          return true
        } else {
          return false
        }
      }
    }),
    inputState () {
      if (!this.selectedValue) {
        return {
          type: 'is-danger',
          message: 'Date required.'
        }
      }
      return {
        type: 'is-primary',
        message: ''
      }
    }

  },
  methods: {
    agentag (tag) {
      let _this = this
      this.agentList = tag
      this.loading_entrust = true
      this.loading_agent = true
      if (tag === 'summary') {
        setTimeout(() => {
          _this.getcollect()
        }, 500)
      } else {
        setTimeout(() => {
          this.getagent()
        }, 500)
      }
    },
    setsymbol (i) {
      if (i.handleType === 'selected') {
        this.coin = i.value.code
      }
    },
    collechage (page) {
      this.colle.page = page
    },
    agentchange (page) {
      this.agent.page = page
    },
    getcollect () {
      this.axios({
        url: this.$store.state.url.personal.collec_list,
        params: {
          page: this.colle.page,
          pageSize: this.colle.pageSize,
          timeStart: this.selectedDate.getTime(),
          timeEnd: this.selecteDate.getTime(),
          symbol: this.coin
        },
        method: 'post'
      }).then((data) => {
        if (data.code === '0') {
          setTimeout(() => {
            this.loading_entrust = false
          }, 500)
          this.colle.count = data.data.count
          this.collecData = data.data.agentCollectList
        }
      })
    },
    getagent () {
      this.axios({
        url: this.$store.state.url.personal.agent_list,
        params: {
          page: 1,
          pageSize: 10,
          timeStart: this.selectedDate.getTime(),
          timeEnd: this.selecteDate.getTime(),
          symbol: this.coin
        },
        method: 'post'
      }).then((data) => {
        if (data.code === '0') {
          setTimeout(() => {
            this.loading_agent = false
          }, 500)
          this.agent.count = data.count
          this.agentData = data.data.agentList
        }
      })
    },
    search () {
      let _this = this
      this.loading_entrust = true
      this.loading_agent = true
      if (this.agentList === 'summary') {
        setTimeout(() => {
          _this.getcollect()
        }, 500)
      } else {
        setTimeout(() => {
          this.getagent()
        }, 500)
      }
    }
  }
}
</script>
<style scoped >
  .agent {

  }
</style>
