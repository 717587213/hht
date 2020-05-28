<template>
      <div id="infoAttestation" class="personal-content">
         <!-- 账户信息-->
         <div class="main-block">
            <div class="block-header">
               {{$t('personal.baseInfo')}}
               <span class="remarks">{{$t('personal.infoText_1')}}</span>
            </div>
            <div class="content-block clearfix">
              <div class="from" v-if="formList.countryCode">
                <div class="left-box">
                  <inline-input 
                    :property = "formList.countryCode"
                    v-model="formList.countryCode.value"
                    v-on:onevents="somethings" > 
                  </inline-input>
                  <inline-input 
                    :property = "formList.certificateType"
                    v-model="formList.certificateType.value"
                    v-on:onevents="somethings" > 
                  </inline-input>
                  <p class="countryerrtext" v-if="countryerrtext">{{$t('personal.placeholder_19')}}</p>
                </div>
                <div class="right-box">
                  <div class="name-surname clearfix">
                    <inline-input 
                      :property = "formList.familyName"
                      v-model="formList.familyName.value"
                      v-on:onevents="somethings" > 
                    </inline-input>
                      <span class="line">——</span>
                    <inline-input 
                        :property = "formList.name"
                        v-model="formList.name.value"
                        v-on:onevents="somethings" > 
                      </inline-input>
                  </div>
                  <inline-input 
                    :property = "formList.certificateNumber"
                    v-model="formList.certificateNumber.value"
                    v-on:onevents="somethings" > 
                  </inline-input>
                </div>
              </div>
            </div>

            <div class="block-header">
               <h4>{{$t('personal.uploadPhoto')}}</h4>
            </div>
            <div class="content-block clearfix">
              <template v-for="(item, key, index) in upload_form">
                <upload-file 
                  :title='item.title'
                  :name = 'item.name'
                  :remarks="item.remarks"
                  :errorInfo = "item.errorInfo"
                  :caseImg='item.caseImg'
                  :defaultImg='item.imagesUrl'
                  type = 'infoAttestation'
                  v-on:onevents="uploadImg" />
                  </upload-file>

              </template>
              <div class="button-inline">
                  <button @click="submit">{{buttonText}}</button>
                </div>
            </div>
         </div>
         <p v-if="userinfo"></p>
      </div>
</template>

<script lang="js">
import InlineInput from '@/components/common/inlineInput'
import UploadFile from '@/components/common/upload'

import caseImgPasscard1 from '../../../assets/img/passcard1.jpg'
import caseImgPasscard2 from '../../../assets/img/passcard2.jpg'
import caseImgPasscard3 from '../../../assets/img/passcard3.jpg'

import caseImgIdcard1 from '../../../assets/img/idcard1.jpg'
import caseImgIdcard2 from '../../../assets/img/idcard2.jpg'
import caseImgIdcard3 from '../../../assets/img/idcard3.jpg'
import { mapState } from 'vuex'

export default {
  name: 'infoAttestation',
  props: [],
  components: {
    InlineInput,
    UploadFile
  },
  data () {
    return {
      certificateType: '1',
      formList: {},
      flas: true,
      countryCode: '6',
      countryerrtext: null,
      upload_form: {}

    }
  },
  mounted () {
    this.formList = this.formList_obj
    this.upload_form = this._upload_form
  },
  watch: {
    'formList_obj' (val) {
      this.formList = val
    },
    '_upload_form' (val) {
      this.upload_form = val
    }
  },
  computed: {
    ...mapState({
      userinfo ({baseData: {_user}}) {
        // 如果是 已认证 或者 待审核状态 直接跳转至个人中心页面
        if (_user) {
          if (_user.authLevel === 1 || _user.authLevel === 0) {
            this.$router.push('/personal')
          }
        }
        return _user || false
      }
    }),
    buttonText () {
      return this.$t('personal.confirmSubmit')
    },
    formList_obj () {
      return {
        countryCode: {
          title: this.$t('personal.nationality'),
          formType: 'countryCode',
          name: 'countryCode',
          placeholder: this.$t('personal.placeholder_1'),
          value: this.$store.state.baseData.default_code
        },
        certificateType: {
          title: this.$t('personal.certificateType'),
          formType: 'select',
          placeholder: this.$t('personal.placeholder_2'),
          name: 'certificateType',
          value: '1',
          optionList: [
            {value: this.$t('personal.China_id'), code: '1'},
            {value: this.$t('personal.passport'), code: '2'}
          ]
        },
        familyName: {
          title: this.$t('personal.Surname'),
          placeholder: this.$t('personal.Surname'),
          formType: 'text',
          name: 'familyName',
          value: ''
        },
        name: {
          title: this.$t('personal.name'),
          placeholder: this.$t('personal.name'),
          formType: 'text',
          name: 'name',
          value: ''
        },
        certificateNumber: {
          title: this.$t('personal.Certificate'),
          formType: 'text',
          placeholder: this.$t('personal.Certificate'),
          name: 'certificateNumber',
          value: ''
        }
      }
    },
    _upload_form () {
      if (this.certificateType === '1') {
        return {
          firstPhoto: {
            title: this.$t('personal.placeholder_3'),
            remarks: this.$t('personal.placeholder_4'),
            caseImg: caseImgIdcard1,
            name: 'firstPhoto',
            errorInfo: '',
            imagesUrl: null,
            value: null
          },
          secondPhoto: {
            title: this.$t('personal.placeholder_5'),
            remarks: this.$t('personal.placeholder_4'),
            caseImg: caseImgIdcard2,
            name: 'secondPhoto',
            errorInfo: '',
            imagesUrl: null,
            value: null
          },
          thirdPhoto: {
            title: this.$t('personal.placeholder_7'),
            remarks: this.$t('personal.placeholder_8') + '<br />' + this.$t('personal.placeholder_9'),
            caseImg: caseImgIdcard3,
            name: 'thirdPhoto',
            errorInfo: '',
            imagesUrl: null,
            value: null
          }
        }
      } else {
        return {
          firstPhoto: {
            title: this.$t('personal.passportCover'),
            remarks: this.$t('personal.placeholder_4'),
            caseImg: caseImgPasscard1,
            name: 'firstPhoto',
            errorInfo: '',
            imagesUrl: null,
            value: null
          },
          secondPhoto: {
            title: this.$t('personal.placeholder_6'),
            remarks: this.$t('personal.placeholder_4'),
            caseImg: caseImgPasscard2,
            name: 'secondPhoto',
            errorInfo: '',
            imagesUrl: null,
            value: null
          },
          thirdPhoto: {
            title: this.$t('personal.placeholder_7'),
            remarks: this.$t('personal.placeholder_8') + '<br />' + this.$t('personal.placeholder_9'),
            caseImg: caseImgPasscard3,
            name: 'thirdPhoto',
            errorInfo: '',
            imagesUrl: null,
            value: null
          }
        }
      }
    }
  },
  methods: {
    somethings (data) {
      if (data.handleType === 'selected' && data.name === 'certificateType') {
        this.selected(data)
      }
      if (data.handleType === 'selectedCountryCode' && data.name === 'countryCode') {
        this.countryCode = data.value.code
        if (data.value.code !== '86' && data.value.code !== '886') {
          this.$nextTick(() => {
            this.certificateType = '2'
            this.formList['certificateType'].value = '2'
            this.formList['certificateType'].optionList = [
              {value: this.$t('personal.passport'), code: '2'},
              {value: this.$t('personal.China_id'), code: '1'}
            ]
            this.countryerrtext = true
          })
        } else {
          this.certificateType = '1'
          this.$nextTick(() => {
            this.formList['certificateType'].value = '1'
            this.formList['certificateType'].optionList = [
              {value: this.$t('personal.China_id'), code: '1'},
              {value: this.$t('personal.passport'), code: '2'}
            ]
          })
          this.countryerrtext = false
        }
      }
    },
    selected (data) {
      if (data.name === 'certificateType' && data.value.code !== this.certificateType) {
        this.certificateType = data.value.code
        this.upload_form = this._upload_form
        if (data.value.code === '1') {
          if (this.countryCode !== '86' && this.countryCode !== '886') {
            this.countryerrtext = true
          } else {
            this.countryerrtext = false
          }
        } else {
          this.countryerrtext = false
        }
      }
    },
    uploadImg (data) {
      this._upload_form[data.name].imagesUrl = data.value.base_image_url + data.value.filename
      this._upload_form[data.name].value = data.value.filenameStr || data.value.filename
      this._upload_form[data.name].errorInfo = ''
    },
    submit () {
      let data = {}
      let fla = true
      for (let item in this.formList) {
        if (this.formList[item].value !== undefined && !this.formList[item].value) {
          this.$set(this.formList[item], 'errorInfo', this.$t('personal.text_7') + this.formList[item].title)
          // this.$store.dispatch('setTipState', {text: this.$t('personal.error_002'), type: 'error'})
          fla = false
        } else {
          data[item] = this.formList[item].value
        }
      }
      for (let item in this._upload_form) {
        if (this._upload_form[item].value !== undefined && !this._upload_form[item].value) {
          // this.$set(this._upload_form[item], 'errorInfo', )
          this._upload_form[item].errorInfo = this.$t('personal.q_upload') + this._upload_form[item].title
          this.upload_form = this._upload_form
          fla = false
        } else {
          data[item] = this._upload_form[item].value
        }
      }
      if (!fla) return false
      if (!this.flas) return false
      this.flas = false

      this.axios({
        url: this.$store.state.url.personal.auth_realname,
        headers: {},
        params: data,
        method: 'post'
      }).then((data) => {
        if (data.code === '0') {
          this.$router.push('/personal')
          this.$store.dispatch('setTipState', this.$t('personal.submitCuccess'))
        } else {
          this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
        }
        this.flas = true
      }).catch(() => {
        this.flas = true
      })
    }
  }
}
</script>

























