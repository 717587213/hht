<template>
  <div name="m-index" class="container">
    <header-top></header-top>
    <transition name="tran">
      <router-view></router-view>
    </transition>
    <footer-bottom></footer-bottom>
  </div>
</template>
<script>
import HeaderTop from './module/header'
import FooterBottom from './module/footer'
export default {
  name: 'm-index',
  components: {
    HeaderTop,
    FooterBottom
  },
  data () {
    return {
      isMain: false
    }
  },
  watch: {
    '$route': 'mainTop'
  },
  beforeMount () {
    this.mainTop()
  },
  methods: {
    mainTop () {
      if (location.hash.indexOf('#/main') > -1) {
        this.isMain = true
      } else {
        this.isMain = false
      }
    }
  }
}
</script>

<style lang="stylus">
.opacity
  background rgba(38, 46, 69, 0.2)
.tran-enter-active
  transition all 0.2s 0.2s
.tran-leave-active
  transition all 0.2s 0s
.tran-enter, .tran-leave-to
  opacity 0
</style>
