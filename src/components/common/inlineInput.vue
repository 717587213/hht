 <template>
<div class ="wgt-inlineInput" :class="property.readOnly">
      <div class="inlint-title" :class="property.name" v-if="property.title">{{property.title}}</div>
      <!-- 文本 密码 -->
      <template v-if='property.formType === "text" || property.formType === "password"'>
    		<input
          :type = 'property.formType || "text"'
          :name = "property.name"
          :class = "property.name"
          :readOnly = "property.readOnly"
          :placeholder = 'property.placeholder || ""'
    		  v-bind:value ="value"
          ref = "property.name"
          autocomplete = "off"
          v-focus
          @keyup.enter="keyupEnter"
    		  @input="handle('input',$event.target.value)"
          @focus="handle('focus',$event.target.value)"
          @blur="handle('blur', $event.target.value)"/>
          <p v-show="errorInfo" class="error-info">{{errorInfo}}</p>
      </template>
      <template v-if='property.formType === "textarea"'>
        <textarea
          :type = 'property.formType || "text"'
          :name = "property.name"
          class= "textarea"
          :class = "property.name"
          :readOnly = "property.readOnly"
          :placeholder = 'property.placeholder || ""'
          v-bind:value ="value"
          ref = "property.name"
          autocomplete = "off"
          v-focus
          @keyup.enter="keyupEnter"
          @input="handle('input',$event.target.value)"
          @focus="handle('focus',$event.target.value)"
          @blur="handle('blur', $event.target.value)">
        </textarea>
          <p v-show="errorInfo" class="error-info">{{errorInfo}}</p>
      </template>
      <!-- 数字 -->
      <template v-if='property.formType === "number"'>
        <input
          type = 'number'
          :name = "property.name"
          :class = "property.name"
          :readOnly = "property.readOnly"
          :placeholder = 'property.placeholder || ""'
          v-bind:value ="value"
          ref = "property.name"
          autocomplete = "off"
          @mousewheel.prevent
          @DOMMouseScroll = "MouseWheel"

          @keyup.enter="keyupEnter"
          @input="handle('input',$event.target.value)"
          @focus="handle('focus',$event.target.value)"
          @blur="handle('blur', $event.target.value)"/>
          <p v-show="errorInfo" class="error-info">{{errorInfo}}</p>
      </template>
      <!-- 验证码 -->
      <template v-if='property.formType === "verifiCode"'>
        <div class="inline">
          <input
            type = 'text'
            :name = "property.name"
            :class = 'property.name'
            :placeholder = 'property.placeholder || ""'
            :value="value"
            autocomplete = "off"
            v-focus
            :ref = "property.name"
            @keyup.enter="keyupEnter"
            @input="handle('input', $event.target.value)"
            @focus="handle('focus', $event.target.value)"
            @blur="handle('blur', $event.target.value)"/>
            <p v-show="errorInfo" class="error-info">{{errorInfo}}</p>
            <span class='get-verifi-btn' @click='sendCodeHandle("sendCode", "")' > {{vText}} </span>
          </div>
      </template>
      <template v-if='property.formType === "aliyunCapcha"'>
        <template v-if="verificationType === '1'">
          <aliyun-capcha style="width:100%" :scene='property.scene'
          v-on:callback='onCaptcha'></aliyun-capcha>
        </template>
        <template v-else>
          <div :id="captchaId" ref="captchaBox" class="captchaBox">
             <div id="wait" v-show="waitShow">
              <div class="loading">
                  <div class="loading-dot"></div>
                  <div class="loading-dot"></div>
                  <div class="loading-dot"></div>
                  <div class="loading-dot"></div>
                </div>
             </div>
          </div>
        </template>
        <p v-show="errorInfo" class="error-info">{{errorInfo}}</p>
      </template>

      <!-- 手机号码 -->
      <template v-if='property.formType === "phone"'>
        <div class="inline phone-input" :class = 'property.name' ref="countryCode">
          <template v-if="property.readOnly || property.readOnly_two">
            <span class="area-code">
              {{property.countryCode}}
              <i v-if="!property.readOnly_two" class="icon-down"></i>
            </span>
          </template>
          <template v-else>
            <span class="area-code" @click="togglePanel">
              {{property.countryCode}}
              <i class="icon-down"></i>
            </span>
          </template>
          <input
            type = 'text'
            autocomplete = "off"
            :name = "property.name"
            :class = 'property.name'
            :readOnly = 'property.readOnly'
            :placeholder = 'property.placeholder || ""'
            :value="value"
            @input="handle('input', $event.target.value)"
            @focus="handle('focus', $event.target.value)"
            @blur="handle('blur', $event.target.value)"/>
            <p v-show="errorInfo" class="error-info">{{errorInfo}}</p>
            <div
              class="select-option-box pop-mobile-box"
              v-if="selectOptionIsShow">
              <input type="text" v-model="searchCode" :placeholder="searchText" ref="search" class="borderbox">
              <div class="country-code-box">
                <happy-scroll color="#1c2b49" size="0" resize smaller-move-v='start' smaller-move-h='start' bigger-move-h='start'bigger-move-v='start' >
                  <ul class="country-code-list">
                      <li
                        v-for="(item,index) in mobileCodes"
                        @click="selectedCode(item)">
                          {{item.value}}
                      </li>
                  </ul>
                </happy-scroll>
              </div>
            </div>
          </div>
      </template>

      <!-- 国家编号 -->
      <template v-if='property.formType === "countryCode"'>
        <div id="countryCode" class="inline phone-input" :class = 'property.name' ref="countryCode">
            <input
            type = 'text'
            autocomplete = "off"
            readOnly ="property.readOnly"
            :class = 'property.name'
            :name = "property.name"
            :placeholder = 'property.placeholder || ""'
            :value="countryCode_02"
            @input="handle('input',$event.target.value)"
            @click="togglePanel">
            <i class="icon-down" @click="togglePanel"></i>
            <p v-show="errorInfo" class="error-info">{{errorInfo}}</p>
            <div
              class="select-option-box pop-mobile-box"
              v-if="selectOptionIsShow" >
              <input type="text" v-model="searchCode" :placeholder="searchText" ref="search" class="borderbox">
              <div class="country-code-box">
                <happy-scroll color="#1c2b49" size="0" resize smaller-move-v='start' smaller-move-h='start' bigger-move-h='start'bigger-move-v='start' >
                  <ul class="country-code-list">
                      <li
                        v-for="(item,index) in mobileCodes"
                        :class="{current: item.value === countryCode_02}"
                        @click="selectedCountryCode(item)">
                          {{item.value}}
                      </li>
                  </ul>
                </happy-scroll>
              </div>
            </div>
          </div>
      </template>


      <!-- 下拉菜单 -->
      <template v-if='property.formType === "select"'>
        <div class="inline select-input" ref="select">
          <input
            type = 'text'
            autocomplete = "off"
            readOnly ="property.readOnly"
            :class = 'property.name'
            :name = "property.name"
            :placeholder = 'property.placeholder || ""'
            :value="selectValue"
            @input="handle('input',$event.target.value)"
            @click="togglePanel">
            <i class="icon-down" @click="togglePanel"></i>
            <p v-show="errorInfo" class="error-info">{{errorInfo}}</p>

            <div v-if="selectOptionIsShow" class="optionBox" :class="{scrollBox:  property.optionList.length > 7}">
              <template v-if="property.optionList.length > 7">
                <happy-scroll color="#1c2b49" size="0" resize smaller-move-v='start' smaller-move-h='start' bigger-move-h='start'bigger-move-v='start' >
                <ul class="select-option-box">
                    <li
                      v-for="(item,index) in property.optionList"
                      class="option"
                      :class="{current: item.value === selectValue}"
                      @click="selectHandle(item)">
                        {{item.value}}
                    </li>
                </ul>
              </happy-scroll>
            </template>
            <template v-else>
              <ul class="select-option-box">
                  <li
                    v-for="(item,index) in property.optionList"
                    class="option"
                    :class="{current: item.value === selectValue}"
                    @click="selectHandle(item)">
                      {{item.value}}
                  </li>
              </ul>
            </template>
            </div>
          </div>
      </template>
  </div>

</template>

<script>
/* eslint-disable */
import AliyunCaptcha from './aliyunCaptcha'
import gt from '../../assets/js/gt.js'

export default {
  name: 'InlineInput',
  components: {
    'aliyun-capcha': AliyunCaptcha
  },
  props: {
    value: {
      default: 0
    },
    property: {
      type: Object,
      default: {}
    }
  },
  data () {
    return {
      isTimeOut: false,
      time: 90,
      interval: null, // 倒计时
      searchCode: null, // 国家区号搜索字段
      mobileCodes: [], // 国家区号列表
      selectOptionIsShow: false,
      isSendCode: true,
      countryCode_02: null,
      selectValue: '',
      errorInfo: '',
      lan: this.$store.state.baseData._lan,
      verificationType: this.$store.state.baseData.verificationType,
      vText: this.$t('personal.getCode'),
      waitShow: true,
      numberValue: null
    }
  },
  mounted () {
    // 国家区号列表 赋值
    this.mobileCodes = this.countryCodes
    if (this.property.formType === 'countryCode') {
      this.countryCode_02 = this.defaultCountryCode
    }
    // 如果 下拉框中有选择项  设置默认选中项
    if (this.property.optionList) {
      this.selectValue = this.selectDefaultValue
    }
    if (this.property.formType === 'aliyunCapcha' && this.verificationType === '2') {
      this.initCaptchaGeetest()
    }
  },
  updated () {
    // 每次组件更新 都要重新设置 下拉框的默认选中项
    if (this.property.optionList) {
      this.selectValue = this.selectDefaultValue
    }
  },
  directives: {
    // 设置input 光标选中
    focus: {
      inserted (el, binding, vnode) {
        if (vnode.context._props.property.focus) {
          el.focus()
        }
      }
    },
    // 设置 number 只能输入数字
    numberOnly: {
      bind: function(el) {
        el.handler = function() {
          el.value = el.value.replace(/\D+/, this.numberValue)
        }
        el.addEventListener('input', el.handler)
      },
      unbind: function(el) {
        el.removeEventListener('input', el.handler)
      }
    }
  },
  computed: {
    captchaId () {
      return 'captcha' + Math.floor(Math.random() * 10000)
    },
    // 搜索文本框 placeholder 文本
    searchText () {
      return this.$t('personal.search')
    },
    // 发送验证码 文字
    vTexts () {
      this.vText = this.$t('personal.getCode')
    },
    // 国家区号列表数据
    countryCodes () {
      let arr = []
      let Code = this.$t('public.countryCodes')
      Code.forEach(item => {
        let obj = {}
        obj.code = '+' + item.split('+')[1]
        if (this.property.name === 'numberCode') {
          obj.value = item.split('+')[0]
        } else {
          obj.value = item.split('+')[0] + ' +' + item.split('+')[1]
        }
        obj.numberCode = item.split('+')[2]
        arr.push(obj)
      })
      return arr
    },
    // 计算下拉框 默认值
    selectDefaultValue () {
      let value = null
      if (this.property.optionList) {
        this.property.optionList.map(item => {
          if (item.code === this.property.value) {
            value = item.value
          }
        })
      }
      return value
    },
    defaultCountryCode () {
      let value = null
      if (this.mobileCodes && this.property.value) {
        this.mobileCodes.map(item => {
          if (item.code === '+' + this.property.value.split('+')[1]) {
            value = item.value
          }
        })
      }
      return value
    },
    captchaLan () {
      let val = ''
      switch (this.lan) {
        case 'zh_CN':
          val = 'zh-cn'
          break
        case 'en_US':
          val = 'en'
          break
        case 'el_GR':
          val = 'zh-tw'
          break
        default :
          val = 'en'
      }
      return val
    }
  },
  watch: {
    'property.value' (val) {
      // 处理国家编号
      if (this.property.formType === 'countryCode') {
        this.countryCode_02 = this.defaultCountryCode
      }
      // 如果是下拉框
      if (this.property.formType === 'select') {
        this.selectValue = this.selectDefaultValue
      }
    },
    vTexts (val) {
      this.vText = val
    },
    // 监听 搜索国家区号
    searchCode (val) {
      if (val) {
        if (/^[A-Za-z]+$/.test(val)) {
          val = val.toUpperCase()
        }
        this.mobileCodes = []
        this.countryCodes.forEach((ele, index, array) => {
          if (ele.value.indexOf(val) >= 0) {
            this.mobileCodes.push(ele)
          }
        })
      } else {
        this.mobileCodes = this.countryCodes
      }
    },
    // 监听 国家区号的变化
    countryCodes (val) {
      this.mobileCodes = val
    },

    // 发送验证码开始倒计时
    'property.startTime' (val) {
      if (val) {
        this.timeInterval()
      } else {
        clearInterval(this.interval)
        this.vText = this.$t('personal.getCode')
        this.isSendCode = true
      }
    },
    // 验证错误提示
    'property.errorInfo' (val) {
      this.errorInfo = val
    },
    '$store.state.baseData.verificationType' (val) {
      this.verificationType = val
      if (val === '2' && this.property.formType === 'aliyunCapcha') {
        setTimeout(() => { this.initCaptchaGeetest() }, 0)
      }
    },
    '$store.state.baseData._lan' (val, old) {
      this.lan = val
      if (old && this.property.formType === 'aliyunCapcha') {
        setTimeout(() => { this.initCaptchaGeetest() }, 0)
      }
    }
  },
  methods: {
    // 极验 验证码 初始化
    initCaptchaGeetest () {
      let self = this
      let captchaBox = this.$refs.captchaBox
      let geetest = $('.geetest_holder')
      this.axios({
        url: this.$store.state.url.common.tartCaptcha,
        headers: {},
        params: {},
        method: 'post'
      }).then((data) => {
        if (geetest.length > 0) {
          $('.geetest_holder').remove()
        }
        window.initGeetest({
         // 以下 4 个配置参数为必须，不能缺少
          gt: data.data.captcha.gt,
          challenge: data.data.captcha.challenge,
          offline: !data.data.captcha.success, // 表示用户后台检测极验服务器是否宕机
          new_captcha: true, // 用于宕机时表示是新验证码的宕机
          width: '100%',
          lang: this.captchaLan
        }, function (captchaObj) {
          let thisCaptcha = captchaObj
          captchaObj.appendTo(captchaBox)
          captchaObj.onReady(function (e) {
            self.waitShow = false
          })
          captchaObj.onError(function (e) {
            console.log('error:', e)
          })
          captchaObj.onSuccess(() => {
            let result = captchaObj.getValidate()
            self.property.alicapcha = {
              geetest_challenge: result.geetest_challenge,
              geetest_seccode: result.geetest_seccode,
              geetest_validate: result.geetest_validate,
              verificationType: '2',
              nc: thisCaptcha,
              token: true
            }
            if (self.errorInfo.length > 0) {
              self.property.errorInfo = ''
              self.errorInfo = ''
            }
          })
        })
      })
    },
    // 禁止火狐浏览器的鼠标滚轮事件
    MouseWheel (e) {
      e.preventDefault()
      return false
    },

    // 向父组件派发input的各种事件
    handle (type, data) {
  //     if (this.property.formType === "number") {

  //     }
  //     if (!String.fromCharCode(e.keyCode).match(/[0-9.]/)) {
  // 　　　　return false; numberValue
  // 　　}
      let obj = {
        handleType: type,
        name: this.property.name,
        value: data
      }
      if (type === 'input') {
        this.clearErrorInfo(data)
      }
      this.$emit('input', data)
      this.$emit('onevents', obj)
    },
    // 发送验证码事件派发
    sendCodeHandle (type, data) {
      let obj = {
        handleType: type,
        name: this.property.name,
        value: data
      }
      if (!this.isSendCode) return false
      this.$emit('onevents', obj)
    },
    // 清除错误提示
    clearErrorInfo (value) {
      if (!value || !this.errorInfo) return false
      if (value.length !== 0 && this.errorInfo.length) {
        this.errorInfo = ''
        this.property.errorInfo = ''
      }
    },
    // 点击下拉菜单选择项
    selectHandle (item) {
      let obj = {
        handleType: 'selected',
        name: this.property.name,
        value: item
      }
      this.selectValue = item.value
      this.property.value = item.code
      this.selectOptionIsShow = false
      this.clearErrorInfo(item.value)
      // 向父组件派发
      this.$emit('onevents', obj)
    },
    // 选择国家区号
    selectedCode (item) {
      this.property.countryCode = item.code
      this.selectOptionIsShow = false
    },
    // 单选国家区号
    selectedCountryCode (item) {
      this.selectOptionIsShow = false
      let obj = {
        handleType: 'selectedCountryCode',
        name: this.property.name,
        value: item
      }
      this.property.value = item.code
      this.countryCode_02 = item.value
      this.clearErrorInfo(item.value)
      this.$emit('onevents', obj)
    },
    // 倒计时
    timeInterval () {
      if (this.$refs[this.property.name]) {
        this.$refs[this.property.name].focus()
      }
      let num = 90
      this.isSendCode = false
      this.vText = num + this.$t('personal.placeholder_11')
      clearInterval(this.interval)
      this.interval = setInterval(() => {
        num--
        this.vText = num + this.$t('personal.placeholder_11')
        if (num <= 0) {
          clearInterval(this.interval)
          this.vText = this.$t('personal.getCode')
          this.property.startTime = false
          this.isSendCode = true
        }
      }, 1000)
    },
    onCaptcha (data) {
      this.property.alicapcha = {
        token: data.token,
        sig: data.sig,
        csessionid: data.csessionid,
        scene: data.scene,
        verificationType: '1',
        nc: data.nc
      }
      if (this.errorInfo.length > 0) {
        this.property.errorInfo = ''
        this.errorInfo = ''
      }
    },
    keyupEnter (e) {
      this.property.keyupEnter && this.property.keyupEnter()
    },
    // 显示隐藏 下拉菜单
    togglePanel () {
      if (this.property.readOnly) return false
      this.selectOptionIsShow ? this.hide() : this.show()
    },
    // 下拉菜单显示
    show () {
      if (this.property.formType === 'select' && this.property.optionList.length < 1) {
        return false
      }
      this.selectOptionIsShow = true
      document.addEventListener('click', this.hidePanel, false)
    },
    // 下拉菜单隐藏
    hide () {
      this.selectOptionIsShow = false
      document.removeEventListener('click', this.hidePanel, false)
    },
    // 判断点击的是否是当前元素
    hidePanel (e) {
      if (this.$refs.countryCode) {
        if (!this.$refs.countryCode.contains(e.target) && !this.$refs.search.contains(e.target)) {
          this.hide()
        }
      }
      if (this.$refs.select) {
        if (!this.$refs.select.contains(e.target)) {
          this.hide()
        }
      }
    }
  },
  beforeDestroy () {
    clearInterval(this.interval)
    document.removeEventListener('click', this.hidePanel, false)
  }
}
</script>
