<template>
  <section class="dialog-pop">
    <div class="dialog-mark" ref="mark" v-show="flag"></div>
    <transition name="drop">
      <div v-show="flag" class="dialog-body" :style='{width: width + "px", marginLeft: -width/2 + "px"}'>
        <!-- 标题部分 -->
        <header class="dialog-title">
          {{ title }}
          
        </header>
        <span v-if="isCLose === 'true'" class="dialog-close" @click='close'>╳</span>
        <!-- 内容部分 -->
        <section ref="content" class="dialog-content">
          <slot name="content"/>
        </section>
        <!-- 选项部分 -->
        <footer class="dialog-footer">
          <slot name="options"/>
        </footer>
      </div>
    </transition>
  </section>
</template>
<script>
export default {
  name: 'com-dialog',
  props: {
    flag: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: 'title'
    },
    width: {
      type: Number,
      default: 450
    },
    name: {
      default: null
    },
    dialogClose: {
      type: Function,
      default: () => {}
    },
    isCLose: {
      default: 'true'
    }
  },
  watch: {
    'flag' (value) {
      value && this.shieldScroll(this.$refs.mark, this.$refs.content)
    }
  },
  methods: {
    close () {
      this.dialogClose(this.name)
    },
    shieldScroll (container, selectorScrollable) {
      window.addEventListener('mousewheel', function (e) {
        e = e || window.event
        if (e.target === container) {
          if (e.preventDefault) {
            e.preventDefault()
            e.returnValue = false
          }
        }
        return false
      })
    }
  }
}
</script>

