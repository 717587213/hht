<template>
  <transition name="bounce">
    <div id="bottomTip" class="bottomTip" :class="'bottomTip_' + tipState.type" v-if='tipState.flag'>
      <div class="tipItem" v-for="item in tipState">
        {{item.content}}
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'com-tip',
  computed: {
    ...mapState({
      tipState ({options: {tipState}}) {
        return tipState
      }
    })
  }
}
</script>
<style scope>
.bounce-enter-active {
  animation: bounce-in .5s;
}
.bounce-leave-active {
  animation: bounce-in .5s reverse;
}
@keyframes bounce-in {
  0% {
    top: 0px;
    opacity: 0
  }
  100% {
    top: 10%;
    opacity: 1;
  }
}
</style>
