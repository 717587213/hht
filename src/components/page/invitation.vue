<template>
  <div id="personal" class="invi-content">
     <!-- 账户信息-->
     <div class="main-block">
        <div class="block-header">
          {{$t('invitation.inviting_details')}}
        </div>
        <table class="table-content">
          <tbody>
            <tr>
              <td width="145" class="tr-left"> {{$t('invitation.Number_invitations')}}:</td>
              <td class="tr-center" colspan="2">
                {{invidata.invite_number}}
              </td>
               <td class="tr-right">
              </td> 
            </tr>
            <tr>
             <td width="145" class="tr-left">{{$t('invitation.obtained')}}:</td>
            
              <td class="tr-center" colspan="2">
                {{invidata.invite_return_number}}<b>{{invidata.coin}}</b>
              </td>
              <td class="tr-right">
              </td>
            </tr>
            <tr>
             <td width="145" class="tr-left">{{$t('personal.invitedCode')}}:</td>
              <td class="tr-center">
                {{invidata.inviteCode}}
              </td>
              <td>
                <p class="yqm-url">
                  {{invidata.inviteUrl}}
                  <input class="inviteUrl_inp" type="text" name="url" ref="inviteUrl" :value="inviteUrl" />
                  &nbsp; &nbsp;
                    <a @click="copyUrl" href="javascript:void(0)">{{$t('personal.copyCode')}}</a>
                </p>
              </td>
              <td class="tr-right">
                <span @click="ercode">{{$t('personal.Qecode')}}</span>
                <!-- <a @click="copyUrl" href="javascript:void(0)">{{$t('personal.copyCode')}}</a> -->
              </td>
            </tr>
          </tbody>
        </table>
     </div>
     <div class="main-block">
        <div class="block-header">
           {{$t('invitation.invitation_record')}}
        </div>
        <div class="history-table-box">
          <table class="table-content history-table" v-if="invidata.invite_list.length>0">
            <tbody >
              <template>
                <tr class="title">
                  <th width="145">{{$t('invitation.Account')}}</th>
                  <th>{{$t('invitation.Registration_time')}}</th>
                </tr>
                <template v-for="(item, index) in invidata.invite_list">
                  <tr :class="{oddback: index % 2 === 0}">
                    <td width="145">{{item.invitee}}</td>
                    <td >{{item.register_time}}</td>
                  </tr>
                </template>
              </template>
            </tbody>
          </table>
          <p v-else class="table_no_data">
            <span>{{$t('personal.notData')}}</span>
          </p>
        </div>
        <v-pagination v-if="(pagination.count/pagination.display) > 1"
                    :total="pagination.count"
                    :current-page='pagination.page'
                    :display='pagination.display'
                    @pagechange="pagechange($event)">
      </v-pagination>
     </div>
       <el-dialog 
      :title='tiptlText' 
      :flag='isVerifyDialog'
      name= 'isVerifyDialog'
      :width='450'
      :dialogClose='closeDialog'>
      <div slot="options">
        <div class="content">
           <img :src="invidata.inviteQECode" alt=""> <br>
        </div>
      
        <button @click="submit">{{$t('fund.confirm')}}</button>
      </div>
    </el-dialog >
  </div>
</template>

<script lang="js">
import { mapState } from 'vuex'
import elDialog from '@/components/common/dialog'
import VPagination from '@/components/common/pagination'

export default {
  name: 'personal',
  props: [],
  components: {elDialog, VPagination},
  data () {
    return {
      editNickNameStatus: false,
      closeMobileVerifyDialog: false,
      isVerifyDialog: false,
      useFeeCoinOpen: 0,
      historyTabClass: 'login',
      historyData: [],
      nickName: null,
      pagination: {
        count: 30,
        page: 1,
        display: 10
      },
      invidata: ''

    }
  },
  mounted () {
    // this.getHistoryData(1)
    this.$store.dispatch('getCommonUser_info')
    this.getdata()
  },
  computed: {
    ...mapState({
      userinfo ({baseData: {_user}}) {
        if (_user) {
          this.nickName = _user.nickName
          this.useFeeCoinOpen = _user.useFeeCoinOpen
        }
        return _user || false
      }
    }),
    // 邀请链接
    inviteUrl () {
      return location.origin + '/register?inviteCode=' + this.userinfo.inviteCode
    },
    tiptlText () {
      return this.$t('personal.tiptl')
    },
    text () {
      return {
        editNameBtn: this.$t('personal.edit')
      }
    }
  },
  methods: {
    closeDialog (e) {
      this[e] = false
    },
    // 复制链接
    copyUrl () {
      this.$refs.inviteUrl.select()
      document.execCommand('copy')
      this.$store.dispatch('setTipState', this.$t('personal.copeSuccess'))
    },

    // 翻页点击事件
    pagechange (page) {
      this.pagination.page = page
      this.getdata()
    },
    getdata () {
      this.axios({
        url: this.$store.state.url.return.invitation,
        headers: {},
        params: {
          page: this.pagination.page,
          pageSize: this.pagination.display
        },
        method: 'post'
      }).then((data) => {
        if (data.code === '0') {
          let invite = data.data
          // 处理时间搓
          for (let item in invite.invite_list) {
            invite.invite_list[item].register_time = this._P.formatTime(invite.invite_list[item].register_time)
          }
          this.invidata = invite
          this.pagination.count = invite.invite_number
        } else {
          this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
        }
      })
    },
    ercode () {
      this.isVerifyDialog = true
    },
    submit () {
      this.isVerifyDialog = false
    }
  }
}
</script>
<style>
  .inviteUrl_inp {
    position: absolute;
    top: -9999px;
    left: -9999px;
    opacity: 0;
  }
  .mobileverify-text {
    text-align: center;
    padding-top: 10px;
    font-size: 16px;
  }
</style>