d<template>
    <div class="apimanage"> 
     <div class="api-main ">
      <div class="api-main-content " >
          <ul class="api-tab ">
            <li :class="{selected:myapi}" @click="apiTag('Myapi')">{{$t('user.api.myapi')}}</li>
            <li @click="apiTag('apidoc')" :class="{selected:apidoc}">{{$t('user.api.apidocd')}}</li>
          </ul>
        <myapi :is='current' keep-alive></myapi>
      </div>
     </div>
  </div>
</template>
<script lang="js">
// 我的APi组建
import Myapi from '@/components/page/apimanage/myapi'
// Api文档
import Apidoc from '@/components/page/apimanage/apidoc'
export default {
  name: 'apimanage',
  components: {
    Myapi,
    Apidoc
  },
  mounted () {

  },
  data () {
    return {
      mainHeight: 0,
      myapi: true,
      apidoc: false,
      current: 'Myapi'
    }
  },
  methods: {
    apiTag: function (tag) {
      this.current = tag
      if (tag === 'Myapi') {
        this.myapi = true
        this.apidoc = false
      } else {
        this.myapi = false
        this.apidoc = true
      }
    }
  },
  computed: {}

}
</script>

<style lang="stylus" scoped>

</style>
