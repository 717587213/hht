  <template>
  <section class="agents">
    <div class="agent-conten">
        <div class="invitations">
          <div class="title">{{$t('agent.invitations')}}</div>
           <div class="content">
             <div class="con-title">
               <span class="effective">{{$t('agent.Effective')}}</span>
               <span>{{$t('agent.total_number')}}</span>
             </div>
             <div class="con-data">
               <span class="effec-number">{{bonus.trueChild}}</span>
               <b class="oblique">/</b>
               <span class="total-number">{{bonus.totalChild}}</span>
             </div>
           </div>
        </div>
        <div class="maid">
             <div class="title">{{$t('agent.Details')}}</div>
             <div class="cale">
               <div class="income clearfix">
                 <div class="income-con">
                   {{$t('agent.Revenue')}}{{bonus.totalBonus}}&nbsp;{{bonus.agentRoleSymbol}}
                 </div>
                 <div class="button" >
                   <button>
                      <a :href="Url">{{$t('agent.export')}}</a>
                   </button>

                 </div>
               </div>
               <div class="calendar">
                 <div class="title">
                  <b class="last-year" @click="lastYear"> &lt;&lt;</b> <i class="last-month" @click="preMonth">&lt;</i> {{year}}{{$t('agent.year')}}{{month + 1}}{{$t('agent.month')}} <i class="next-month" @click="nextMonth">&gt;</i> <b class="next-year" @click="nextYear">&gt;&gt;</b>
                 </div>
                 <div class="date">
                      <div class="week">
                        <b>{{$t('agent.sun')}}</b>
                        <b>{{$t('agent.mon')}}</b>
                        <b>{{$t('agent.tue')}}</b>
                        <b>{{$t('agent.wed')}}</b>
                        <b>{{$t('agent.thu')}}</b>
                        <b>{{$t('agent.fri')}}</b>
                        <b>{{$t('agent.sat')}}</b>
                      </div>
                      <div class="dail clearfix">
                          <span v-for="(item,index) in list" :key="index" class="day">
                               <b class="date" :class="{days:item.num === '&nbsp'}"  @click="getbonus(year,month,item.num,bonus.agentRoleSymbol)">{{item.num}}</b>
                               <b class="data" :class="{days:item.num === '&nbsp'}" v-for="i in bonus.calendarBonusList" v-if="item.date === i.day" @click="getbonus(year,month,item.num,bonus.agentRoleSymbol)">{{i.amount}}</b>
                            </span>
                      </div>

                 </div>
               </div>
             </div>
        </div>
    </div>
    <div class="projectile" v-if="project">
      <div class="expor-list">
         <table>
                <thead>
                   <tr class="title">
                    <th>UID</th>
                    <th>{{$t('agent.mailbox')}}</th>
                    <th>{{$t('agent.Telephone')}}</th>
                    <th>{{$t('agent.time')}}</th>
                    <th>{{$t('agent.Remaid')}}</th>
                    <th>{{$t('agent.Amount')}}</th>
                   </tr>
                  <span class="cols" @click="cols">╳</span>
                 </thead>

                 <tbody>
                   <tr v-for="(item,index) in mapList" :key="index" :class="{interlacing: index % 2 === 1}">
                     <td>{{item.uid}}</td>
                     <td>{{item.email}}</td>
                     <td>{{item.mobileNumber}}</td>
                     <td>{{item.ctime}}</td>
                     <td>{{item.scale}}%</td>
                     <td>{{item.amount}}</td>
                   </tr>
                 </tbody>

              </table>
              <div v-if="mapList <=0" class="no_data">
                       {{$t('agent.nodata')}}
              </div>
              <div class="page">
                 <Vpagination v-if="(apition.count/apition.pageSize) > 1"
                              :total="apition.count"
                              :current-page='apition.page'
                              :display='apition.pageSize'
                              @pagechange="apitionechage($event)" class="page">
                        </Vpagination>
              </div>
      </div>

    </div>
    <p v-if="public_info"></p>
  </section>

</template>

<script lang="js">
import { mapState } from 'vuex'
import Vpagination from '@/components/common/pagination'

export default {
  name: 'agents',
  props: [],
  mounted () {
    let nstr = new Date()
    let year = nstr.getFullYear()
    this.year = year
    let month = nstr.getMonth()
    let day = nstr.getDate()
    this.day = day
    this.month = month
    this.calendar(this.year, this.month)
  },
  data () {
    return {
      year: '',   // 当前年份
      month: '',   // 当前月份
      day: '',
      list: [],
      bonus: '',
      project: false,
      firstFlag: true,
      baseData: [],
      mapList: '',
      mones: '',
      apition: {
        count: '',
        pageSize: 10,
        page: 1
      },
      days: '',
      id: ''

    }
  },
  components: {
    Vpagination
  },
  computed: {
    ...mapState({
      public_info ({baseData}) {
        if (baseData.isReady && this.firstFlag) {
          this.baseData = baseData
          this.id = baseData._user.exportExcelAuth
          let nstr = new Date()
          let year = nstr.getFullYear()
          let month = nstr.getMonth()
          let day = nstr.getDate()
          this.getData(year, month, day)
          this.firstFlag = false
          return baseData
        } else {
          return true
        }
      }
    }),
    Url () {
      return 'https://' + window.HOST_API.ex_api + '/agent/agent_branch_bonus_export' + '?timeStr=' + this.year + '_1_' + this.id
      // return 'http://192.168.1.241:8082/agent/agent_branch_bonus_export?timeStr=2018_1_AQTDDDVZU'
    }
  },
  methods: {
    calendar (year, month) {
      let lastday = new Date(year, month, 1)   // 当前月第一天
      let firstday = lastday.getDay()              // 当前月第一天周几
      let mdays = [31, 28 + this.leap(year), 31, 30, 31, 31, 30, 31, 30, 31, 30, 31]
      let trstr = Math.ceil((mdays[month] + firstday) / 7)
      for (let i = 0; i < trstr; i++) {
        for (let k = 0; k < 7; k++) {
          let idx = i * 7 + k
          let datestr = idx - firstday + 1 // 计算日期
          let datestrs = {}
          if (datestr <= 0 || datestr > mdays[month]) {
            datestrs.num = '&nbsp'
          } else {
            let num = idx - firstday + 1
            datestrs.num = num
            datestrs.date = this.year + '-' + this.s(this.month + 1) + '-' + this.s(num)
          }
          this.list.push(datestrs)
        }
      }
    },
      // 上一年
    lastYear () {
      this.year = this.year - 1
      this.list = []
      this.getData(this.year, this.month, this.day)
      this.calendar(this.year, this.month)
    },
      // 下一年
    nextYear () {
      this.year = this.year + 1
      this.list = []
      this.getData(this.year, this.month, this.day)
      this.calendar(this.year, this.month)
    },
      // 上一个月
    preMonth () {
      if (this.month <= 0) {
        this.year = this.year - 1
        this.month = 11
        this.list = []
        this.getData(this.year, this.month, this.day)
        this.calendar(this.year, this.month)
      } else {
        this.month --
        this.list = []
        this.getData(this.year, this.month, this.day)
        this.calendar(this.year, this.month)
      }
    },
      // 下一个月
    nextMonth () {
      if (this.month >= 11) {
        this.year = this.year + 1
        this.month = 0
        this.list = []
        this.getData(this.year, this.month, this.day)
        this.calendar(this.year, this.month)
      } else {
        this.month ++
        this.list = []
        this.getData(this.year, this.month, this.day)
        this.calendar(this.year, this.month)
      }
    },
    leap (year) {  // 判断是否为闰年
      return (((year % 4 === 0) && ((year % 100) !== 0)) || (year % 400 === 0))
    },
    getData (y, m, d) {
      let date = y + '-' + this.s(m + 1) + '-' + this.s(d)
      this.axios({
        url: this.$store.state.url.bonus.calendar_bonus,
        headers: {},
        params: {
          currentMonthStr: date
        },
        method: 'post'
      }).then((data) => {
        if (data.code === '0') {
          let boun = data.data
          boun.totalBonus = this._P.fixD(boun.totalBonus, this.baseData._coinList[boun.agentRoleSymbol].showPrecision)
          for (let i in boun.calendarBonusList) {
            boun.calendarBonusList[i].amount = this._P.fixD(boun.calendarBonusList[i].amount, this.baseData._coinList[boun.agentRoleSymbol].showPrecision)
            boun.calendarBonusList[i].day = this.Time(boun.calendarBonusList[i].ctime)
          }
          this.symbol = boun.agentRoleSymbol
          this.bonus = boun
        } else {
          this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
        }
      })
    },
    getbonus (year, month, day, symbol) {
      this.days = day
      let date = year + '-' + this.s(month + 1) + '-' + this.s(day)
      this.axios({
        url: this.$store.state.url.bonus.bonus_record,
        headers: {},
        params: {
          currentDateStr: date,
          pageNumber: this.apition.page,
          pageSize: this.apition.pageSize

        },
        method: 'post'
      }).then((data) => {
        if (data.code === '0') {
          this.project = true
          let mapList = data.data.mapList
          for (let item in mapList) {
            mapList[item].ctime = this._P.formatTime(mapList[item].ctime)
            mapList[item].amount = this._P.fixD(mapList[item].amount, this.baseData._coinList[symbol].showPrecision)
          }
          this.apition.count = data.data.count
          this.mapList = mapList
        } else {
          this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
        }
      })
    },
    Time: function (dateTime) {
      let date = new Date(dateTime)
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let day = date.getDate()

      return year + '-' + this.s(month) + '-' + this.s(day)
    },
    s (t) {
      return t < 10 ? '0' + t : t
    },
      // 关闭弹框
    cols () {
      this.project = false
      this.apition.page = 1
    },
    apitionechage (i) {
      this.apition.page = i
      this.getbonus(this.year, this.month, this.days, this.symbol)
    }
  }

}
</script>

<style scoped>

</style>
