<template lang="html">

  <section class="apidoc">
      <div class="api-box">
        <p class="doctop">
          <span class="api-tation">{{$t('user.api.quotation_api')}}</span>
          <span class="api-new">{{$t('user.api.quotation_describe')}}</span>
          <span>（ {{openApiUrl}} ）</span>
					<a href="https://chainup-oss.oss-cn-beijing.aliyuncs.com/download/openapi.pdf" class="api-down">{{$t('user.api.down_load')}}</a>
        </p>
        <p class="doclist">
          <span>{{$t('user.api.interface')}}</span>
         <span>{{$t('user.api.describe')}}</span>
        </p>
        <p class="doclist" v-for="(item,index) in apidata.quotation" :key="index">
          <span>{{openApiUrl}}{{item.interface}}</span>
          <span>{{item.describe}}</span>
        </p>
      </div>
      <div class="api-box">
        <p class="doctop">
          <span class="api-tation">{{$t('user.api.transaction_api')}}</span>
          <span class="api-new">{{$t('user.api.transaction_describe')}}</span>
          <a href="https://chainup-oss.oss-cn-beijing.aliyuncs.com/download/openapi.pdf" class="api-down">{{$t('user.api.down_load')}}</a>
        </p>
        <p class="doclist">
         <span>{{$t('user.api.interface')}}</span>
         <span>{{$t('user.api.describe')}}</span>
        </p>
        <p class="doclist" v-for="(item,index) in apidata.transaction" :key="index">
         <span>{{openApiUrl}}{{item.interface}}</span>
         <span>{{item.describe}}</span>
        </p>
      </div>
  </section>

</template>

<script lang="js">
  export default {
    name: 'apidoc',
    props: [],
    data () {
      return {
        apidata: {},
        openApiUrl: this.$store.state.baseData.openApiUrl
      }
    },
    mounted () {
      this.apidata = this.apidata_obj
      if (!this.$store.state.baseData.openApiUrl) {
        let m = location.host.split('.')
        let h = m.splice(0, 1, 'openapi')
        let newhost = h.join('.')
        this.openApiUrl = location.protocol + '//' + newhost
      }
    },
    watch: {
      'apidata_obj' (val) {
        this.apidata = val
      },
      '$store.state.baseData.openApiUrl' (val) {
        if (val) {
          this.openApiUrl = val
        }
      }
    },
    computed: {
      apidata_obj () {
        return {
          quotation: [
            {
              'interface': '/open/api/get_records',
              'describe': this.$t('user.api.apidoc.K_line')
            },
            {
              'interface': '/open/api/get_ticker',
              'describe': this.$t('user.api.apidoc.transaction')
            },
            {
              'interface': '/open/api/get_trades',
              'describe': this.$t('user.api.apidoc.depth')
            },
            {
              'interface': '/open/api/market_dept',
              'describe': this.$t('user.api.apidoc.delegate')
            }
          ],
          transaction: [
            {
              'interface': '/open/api/all_order',
              'describe': this.$t('user.api.apidoc.delegate')
            },
            {
              'interface': '/open/api/all_trade',
              'describe': this.$t('user.api.apidoc.records')
            },
            {
              'interface': '/open/api/cancel_order',
              'describe': this.$t('user.api.apidoc.entrustment')
            },
            {
              'interface': '/open/api/common/symbols',
              'describe': this.$t('user.api.apidoc.query')
            },
            {
              'interface': '/open/api/create_order',
              'describe': this.$t('user.api.apidoc.create_order')
            },
            {
              'interface': '/open/api/market',
              'describe': this.$t('user.api.apidoc.latest_transaction_price')
            },
            {
              'interface': '/open/api/new_order',
              'describe': this.$t('user.api.apidoc.current_entrustment')
            },
            {
              'interface': '/open/api/order_info',
              'describe': this.$t('user.api.apidoc.get_details_order')
            },
            {
              'interface': '/open/api/user/account',
              'describe': this.$t('user.api.apidoc.balance')
            }
          ]
        }
      }
    }
}
</script>

<style lang="stylus" scoped >

</style>

