<template>
  <div class="funds-aside">
		 		  <div class="funds-aside-list">
		 				<router-link to="/funds/funds_manage"><i class="icon-account " ></i>{{Internationalization.funds_manage}}</router-link>
		 				<router-link to="/funds/finance_manage"><i class="icon-trade "></i>{{Internationalization.finance_manage}}</router-link>
		 				<router-link to="/funds/address_manage" ><i class="icon-address" active-class='router-link-exact-active'></i>{{Internationalization.address_manage}}</router-link>
						 <router-link v-if="isDepositOpen === '1'" to="/funds/funds_detail" active-class='router-link-exact-active'><i class="icon-detail"></i>{{ $t('fund.detail') }}</router-link>
		 			</div>
	 		 </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'fundsAside',
  data () {
    return {
    }
  },
  computed: {
    Internationalization () {
      return {
        funds_manage: this.$t('fund.funds_manage'), // 资金管理
        finance_manage: this.$t('fund.finance_manage'), // 资金流水
        address_manage: this.$t('fund.address_manage') // 地址管理
      }
    },
    ...mapState({
      isDepositOpen ({baseData: {isDepositOpen}}) { // 是否开启币宝
        return isDepositOpen || false
      }
    })
  }
}
</script>
