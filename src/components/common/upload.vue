<template>
   <div class="upload-img-block clearfix" :class="type">
    <div class="tit">{{title}}</div>
    <div class="upload-main">
      <div class="upload-btn">
        <button class="select">
          <template v-if="isloading">
            {{$t('personal.uploadIn')}}...
          </template>
          <template v-else>
            {{button_text}}
          </template>
        </button>
        <input v-show="!isloading" class="select_file_input" type="file" @change="change($event)" accept="image/jpeg,image/jpg,image/png" name='file' ref='file'>
      </div>
      <p class="remarks" v-html="remarks"></p>
      <div class="select-fileBtn">
        <i></i>
        <input v-show="!isloading" class="select_file_input" type="file" @change="change($event)" accept="image/jpeg,image/jpg,image/png" name='file' ref='file'>
        <!-- <img v-show="defaultImgState" class="img" :src="defaultImgState"> -->
        <div class="upload_img" v-show="defaultImgState" :style="{backgroundImage:'url('+defaultImgState+')'}"></div>
        <div v-show="isloading" class="isloading">{{$t('personal.uploadIn')}}...</div>
      </div>
      <div v-if="type === 'infoAttestation'" class="case">
        <p>{{$t('personal.example')}}</p>
        <img :src="caseImg" />
      </div>
      <p v-show="error_info" class="error-info">{{error_info}}</p>
     </div>
  </div>
</template>
<script>
export default {
  name: 'upload',
  props: {
    title: {
      type: String,
      default: ''
    },
    remarks: {
      type: String,
      default: ''
    },
    caseImg: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    errorInfo: {
      type: String,
      default: ''
    },
    data: {
      Object,
      default: () => {
        return {}
      }
    },
    defaultImg: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    },
    uploadUrl: {
      type: String,
      default: null
    },
    buttonText: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      files: null,
      url: null,
      defaultImgState: null,
      error_info: '',
      isloading: false
    }
  },
  mounted () {
    if (this.defaultImg) {
      this.defaultImgState = this.defaultImg
    }
  },
  computed: {
    button_text () {
      if (this.buttonText) {
        return this.buttonText
      } else {
        return this.$t('personal.selectPhone')
      }
    }
  },
  watch: {
    'defaultImg' (value) {
      this.defaultImgState = value
    },
    'errorInfo' (value) {
      this.error_info = value
    }
  },
  methods: {
  // 选择文件
    change (e) {
      let self = this
      self.files = e.target.files[0] || e.dataTransfer.files[0]
      if (this.files && this.files.size <= 10 * 1024 * 1024) { // 判断大小
        let reader = new FileReader()
        reader.readAsDataURL(self.files)
        reader.onload = function (e) {
          self.upload(this.result)
          self.isloading = true
          self.$store.dispatch('setTipState', self.$t('personal.uploadIn'))
        }
      } else {
        this.$store.dispatch('setTipState', {text: this.$t('personal.placeholder_12'), type: 'error'})
      }
    },
    upload (file) {
      let self = this
      if (file) {
        let formData = new FormData()
        formData.append(this.name, this.files)
        if (this.data !== undefined) {
          for (let key in this.data)formData.append(key, this.data[key])
        }
        // 实名认证页面的手持证件照要加水印
        if (this.name === 'thirdPhoto') {
          formData.append('isWaterMark', 1)
        }
        let isOpenUploadImg = this.$store.state.baseData._data.is_open_upload_img || '0'
        this.axios({
          headers: {
            'Content-Type': 'multipart/form-data' // application/json
          },
          method: 'post',
          url: this.uploadUrl || this.$store.state.url.common.upload_img,
          hostType: (isOpenUploadImg === '1') ? 'upload' : null,
          params: formData
        }).then((result) => {
          if (result.code === '0') {
            this.isloading = false
            this.$emit('onevents', {name: self.name, value: result.data})
            this.$store.dispatch('setTipState', this.$t('personal.uploadCuccess'))
          } else {
            this.isloading = false
            this.$store.dispatch('setTipState', {text: this.$t('error.' + result.msg), type: 'error'})
          }
        }).catch(() => {
          this.isloading = false
        })
      }
    }
  }
}
</script>