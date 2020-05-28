<template>
  <div id="com-g">
    <!-- <div class="text">溢价:</div> -->
    <div class="scrollBox">
      <div class="minPage">-99%</div>
      <div class="scroll" ref='scroll' @mousemove.prevent="pageMove">
        <div class="scroll_startPage scroll_page" ref='startPage'></div>
        <div class="scroll_centerPage scroll_page"></div>
        <div class="scroll_endPage scroll_page"></div>
        <div class="scrollPage" @mousedown.prevent="pageStart" @mouseout.prevent="pageOut" :style="{left: left + '%'}"></div>
      </div>
      <div class="maxPage">99%</div>
    </div>
    <div class="inpBox"><input class="inpText" type="number" v-model="num"/>%</div>
  </div>
</template>

<script>
export default {
  name: 'com-g',
  data () {
    return {
      flag: false,
      left: 50,
      num: 0,
      min_p: 0
      // startPageL: 0 // page 最小值
      // scrollW:
    }
  },
  props: {
    cn: {
      default: () => {},
      type: Function
    }
  },
  watch: {
    'num' (newV, old) {
      if (String(newV).indexOf('.') !== -1) {
        this.num = newV.split('.')[0] || '0'
      }
      if (Number(newV) > 99) {
        this.num = 99 + ''
      } else if (Number(newV) < -99) {
        this.num = -99 + ''
      }
      // this.num = Number(this.num) + ''
      if (Number(newV) === 0) {
        this.left = 50
      } else if (Number(newV) < 0) {
        this.left = 49.5 - (newV.split('-')[1] / 2)
      } else if (Number(newV) > 0) {
        this.left = 50.5 + Number(newV) / 2
      }
      this.cn(newV)
    }
  },
  methods: {
    init () {
      this.left = 50
      this.num = 0
    },
    pageStart (e) {
      let scrollLeft = this.$refs.scroll.offsetLeft
      // let nowClientX = e.clientX
      this.min_p = scrollLeft
      document.onmousemove = e => {
        let scrollWidth = this.$refs.scroll.offsetWidth
        let nowClientX = e.clientX - this.min_p
        if (nowClientX < 0) {
          nowClientX = 0
        } else if (nowClientX > scrollWidth) {
          nowClientX = scrollWidth
        }
        this.left = nowClientX / scrollWidth * 100
        let _num = Math.ceil(this.left * 2)
        if (_num === 100 || _num === 101) {
          this.num = 0
        } else if (_num >= 0 && _num < 100) {
          this.num = '-' + (100 - _num)
        } else if (_num > 101) {
          this.num = _num - 101
        }
      }
      document.onmouseup = () => {
        document.onmousemove = null
      }
    },
    pageMove (e) {
      // console.log(e)
      if (this.flag) {
      }
    },
    pageOut () {
      // this.flag = false
    }
  }
}
</script>

<style>

</style>


