<template>
  <div id="payment" class="personal-content">
     <!-- 支付方式-->
     <div class="form-box">
        <h3 class="page-title">{{pageTitle}}</h3>
        <div class="content-block" v-if="formList_obj">
          <template v-for="(item,key,index) in formList">
            <inline-input 
              :property = "item"
              v-model="item.value"
              v-on:onevents="somethings" > 
            </inline-input>
          </template>
          <template v-if="isifcurrent('key_01')">
            <upload-file 
              type = 'payment'
              :title='qrcodeImg.title'
              :name = 'qrcodeImg.name'
              :buttonText = 'qrcodeImg.buttonText'
              :remarks="qrcodeImg.remarks"
              :errorInfo = "qrcodeImg.errorInfo"
              :defaultImg='qrcodeImg.imagesUrl'
              :uploadUrl='qrcodeImg.uploadUrl'
              v-on:onevents="uploadImg" />
            </upload-file>
          </template>
          <div class="button-inline">
            <button @click='submit'>{{buttonText}}</button>
          </div>
        </div>
     </div>
  </div>
</template>

<script lang="js">
import InlineInput from '@/components/common/inlineInput'
import { mapState } from 'vuex'
import UploadFile from '@/components/common/upload'
export default {
  name: 'payment',
  props: [],
  components: {
    InlineInput,
    UploadFile
  },
  data () {
    return {
      formList: {},
      qrcodeImg: {},
      flas: true, // 防止二次点击
      paymentLIst: [], // 已添加了的支付方式数据
      routetQuery: this.$route.query.key, // 获取路由中的query属性 如果有表示编辑状态
      isExistPayment: false, // 是否已经添加过此方式
      editpaymentData: {}, // 修改的是方式数据
      selectedCurrentPayment: null, // 选择的支付方式
      keyListArr: {
        // 第一种支付方式
        key_01: ['otc.payment.alipay', 'otc.payment.wxpay', 'otc.payment.paytm', 'otc.payment.upi'],
        // 第二种支付方式
        key_02: ['otc.payment.domestic.bank.transfer'],
        // 第三种支付方式
        key_03: ['otc.payment.paypal', 'otc.payment.paynow', 'otc.payment.qiwi', 'otc.payment.interac', 'otc.payment.e-Transfer'],
        // 第四种支付方式
        key_04: ['otc.payment.swift'],
        // 第五种支付方式
        key_05: ['otc.payment.imps'],
        // 第六种支付方式
        key_06: ['otc.payment.western.union'],
        // 已经添加了的支付方式
        key_exist: [],
        // 是否开启OTC
        isotcOpen: this.$store.state.baseData.otcOpen
      }
    }
  },
  mounted () {
    this.formList = this.formList_obj
    this.qrcodeImg = this.qrcodeImg_obj
    this.getPaymentLIst()
  },
  watch: {
    'formList_obj' (val) {
      this.formList = val
    },
    'qrcodeImg_obj' (val) {
      this.qrcodeImg = val
    },
    'currentPayment' (val) {
      if (!this.keyListArr['key_exist'].length || this.routetQuery) return
      if (this.isifcurrent('key_exist')) {
        this.isExistPayment = true
        this.$store.dispatch('setTipState', {text: this.LANGUAG_ETEVT.verify_text5, type: 'error'})
      } else {
        this.isExistPayment = false
      }
    },
    '$store.state.baseData.otcOpen' (value) {
      this.isotcOpen = value
      if (value === '1') {
        this.$store.dispatch('otcPublic_info')
        this.getPaymentLIst()
      }
    }
  },
  computed: {
    ...mapState({
      paymentsData ({otcData: {payments}}) {
        console.log(payments)
        return payments || false
      },
      userinfo ({baseData: {_user}}) {
        // 如果是 已认证 或者 待审核状态 直接跳转至个人中心页面
        if (_user) {
          if (_user.authLevel !== 1) {
            this.$store.dispatch('setTipState', {text: this.LANGUAG_ETEVT.verify_text2, type: 'error'})
            this.$router.push('/personal')
          }
          if (_user.isOpenMobileCheck !== 1 && _user.googleStatus !== 1) {
            this.$store.dispatch('setTipState', {text: this.LANGUAG_ETEVT.verify_text1, type: 'error'})
            this.$router.push('/personal')
          }
        }
        return _user || false
      }
    }),
    LANGUAG_ETEVT () {
      return {
        verify_text1: this.$t('payments.verify_text1'), //  请先开启手机验证或者谷歌验证
        verify_text2: this.$t('payments.verify_text2'), //  请先实名认证通过后才可添加收款方式
        verify_text5: this.$t('payments.verify_text5'), //  同一个支付方式只能添加一个账号
        verify_text6: this.$t('payments.verify_text6'), //  请选择一种收款方式
        payments: this.$t('payments.payments'),         //  收款方式
        add_payments: this.$t('payments.add_payments'),     //  添加收款方式
        eidt_payments: this.$t('payments.eidt_payments'),   //  修改收款方式
        qecode: this.$t('payments.qecode'),                 //  二维码
        q_upload_your: this.$t('payments.q_upload_your'),   //  请上传您的
        pay_qecode_img: this.$t('payments.pay_qecode_img'), //  收款二维码图片
        name: this.$t('payments.name'),                     //  姓名
        bankName: this.$t('payments.bankName'),             //  开户银行
        bankNames: this.$t('payments.bankNames'),           //  银行名称
        bankOfDeposit: this.$t('payments.bankOfDeposit'),   //  开户支行
        bank_account: this.$t('payments.bank_account'),     //  银行账户
        inputInter: this.$t('payments.inputInter'),         //  信息
        ifsc_code: this.$t('payments.ifsc_code'),           //  IFSC码
        select_input: this.$t('payments.select_input')      //  （选填)
      }
    },
    pageTitle () {
      return this.routetQuery ? this.LANGUAG_ETEVT.eidt_payments : this.LANGUAG_ETEVT.add_payments
    },
    buttonText () {
      return this.$t('personal.confirmSubmit') // 确认修改
    },
    // 全部 支付方式 选项
    paymentTypeLIst () {
      let arr = []
      if (!this.paymentsData) return []
      for (let item in this.paymentsData) {
        this.paymentsData[item].value = this.paymentsData[item].title
        this.paymentsData[item].code = this.paymentsData[item].key
        arr.push(this.paymentsData[item])
      }
      return arr
    },
    // 上传二维码
    qrcodeImg_obj () {
      if (!this.currentPayment) return {}
      return {
        title: '',
        buttonText: '上传二维码图片',
        name: 'qrcodeImg',
        remarks: this.LANGUAG_ETEVT.q_upload_your + this.currentPayment.title + this.LANGUAG_ETEVT.pay_qecode_img + '(jpg/png/jpeg)',
        errorInfo: '',
        imagesUrl: this.editpaymentData.qrcodeImg || null,
        value: this.editpaymentData.qrcodeImg || null,
        uploadUrl: this.$store.state.otcUrl.payment.upload_qrcode
      }
    },
    // 设置默认选中的收款方式
    currentPayment () {
      let obj = {code: null, value: null}
      // 如果是添加状态并且有可选收款方式
      if (this.paymentTypeLIst && !this.routetQuery) {
        obj = this.paymentTypeLIst[0] // 默认选中第一个
        let yiAddKeyArr = []
        let breaks = false
        for (let y = 0; y < this.paymentLIst.length; y++) {
          yiAddKeyArr.push(this.paymentLIst[y].payment)
        }
        // 循环全部收款方式
        for (let item = 0; item < this.paymentTypeLIst.length; item++) {
          // 循环已添加了的收款方式
          // 默认选中 没有被添加过的收款方式
          if (yiAddKeyArr.indexOf(this.paymentTypeLIst[item].key) === -1) {
            obj = this.paymentTypeLIst[item]
            breaks = true
            break
          }
          if (breaks) break
        }
      }
      // 如果是编辑状态
      if (this.editpaymentData.title) {
        this.paymentTypeLIst.map(item => {
          if (item.key === this.editpaymentData.payment) {
            obj = item
          }
        })
      }
      if (this.selectedCurrentPayment) {
        obj = this.selectedCurrentPayment
      }
      return obj
    },
    // 姓名 需要自动填充
    userName () {
      // 如果是编辑状态
      if (this.editpaymentData.title) {
        return this.editpaymentData.userName
      }
      // 除了第一种 支付方式 其他的都需要需要自动填充
      if (!this.isifcurrent('key_01') && this.userinfo) {
        return this.userinfo.realName
      }
      return null
    },
    // 处理 姓名 是否可以输入
    userNameReadOnly () {
      // if (this.editpaymentData.title) {
      //   return false
      // }
      // 除了第一种 支付方式 其他的都不可以输入
      if (!this.isifcurrent('key_01') && this.userinfo) {
        return true
      }
      return false
    },
    formList_obj () {
      if (!this.paymentTypeLIst || !this.currentPayment) return false
      let obj = {}
      // 收款方式
      obj.payment = {
        title: this.LANGUAG_ETEVT.payments,
        formType: 'select',
        placeholder: this.LANGUAG_ETEVT.verify_text6,
        name: 'payment',
        readOnly: this.routetQuery ? 'true' : false,
        value: this.currentPayment.code,
        optionList: this.paymentTypeLIst
      }
      // 姓名
      obj.userName = {
        title: this.LANGUAG_ETEVT.name,
        formType: 'text',
        type: null,
        placeholder: this.$t('personal.text_7') + this.LANGUAG_ETEVT.name,
        name: 'userName',
        // readOnly: this.userNameReadOnly,
        // value: this.userName
        value: ''
      }
      // 收款方式 ：支付宝、微信、Paytm、UPI 或者 PayPal、PayNow、QIWI、Interac e-Transfer
      if (this.isifcurrent('key_01') || this.isifcurrent('key_03')) {
        obj.account = {
          title: this.currentPayment.title + this.$t('personal.accountNumber'),
          formType: 'text',
          type: null,
          name: 'account',
          value: this.editpaymentData.account || ''
        }
      }
      // 收款方式 ：银行卡
      if (this.isifcurrent('key_02')) {
        obj.bankName = {
          title: this.LANGUAG_ETEVT.bankName,
          formType: 'text',
          placeholder: this.$t('personal.text_7') + this.LANGUAG_ETEVT.bankName,
          type: null,
          name: 'bankName',
          value: this.editpaymentData.bankName || ''
        }
        // 开户支行
        obj.bankOfDeposit = {
          title: this.LANGUAG_ETEVT.bankOfDeposit + this.LANGUAG_ETEVT.select_input,
          formType: 'text',
          placeholder: this.$t('personal.text_7') + this.LANGUAG_ETEVT.bankOfDeposit,
          type: null,
          name: 'bankOfDeposit',
          noRequisite: true,
          value: this.editpaymentData.bankOfDeposit || ''
        }
        // 银行卡账号
        obj.account = {
          title: this.LANGUAG_ETEVT.bank_account,
          formType: 'text',
          type: null,
          placeholder: this.$t('personal.text_7') + this.LANGUAG_ETEVT.bank_account,
          name: 'account',
          value: this.editpaymentData.account || ''
        }
      }
      // 收款方式 ：SWIFT
      if (this.isifcurrent('key_04')) {
        obj.account = {
          title: this.currentPayment.title + this.LANGUAG_ETEVT.inputInter,
          formType: 'textarea',
          type: null,
          name: 'account',
          value: this.editpaymentData.account || ''
        }
      }
      // 收款方式 ：西联汇款
      if (this.isifcurrent('key_06')) {
        obj.remittanceInformation = {
          title: this.currentPayment.title + this.LANGUAG_ETEVT.inputInter,
          formType: 'textarea',
          type: null,
          name: 'remittanceInformation',
          value: this.editpaymentData.remittanceInformation || ''
        }
      }
      // 收款方式 IMPS
      if (this.isifcurrent('key_05')) {
        // 银行名称
        obj.bankName = {
          title: this.LANGUAG_ETEVT.bankName,
          formType: 'text',
          placeholder: this.$t('personal.text_7') + this.LANGUAG_ETEVT.bankName,
          type: null,
          name: 'bankName',
          value: this.editpaymentData.bankName || ''
        }
        // 银行账户
        obj.account = {
          title: this.LANGUAG_ETEVT.bank_account,
          formType: 'text',
          type: null,
          placeholder: this.$t('personal.text_7') + this.LANGUAG_ETEVT.bank_account,
          name: 'account',
          value: this.editpaymentData.account || ''
        }
        // IFSC码
        obj.ifscCode = {
          title: this.LANGUAG_ETEVT.ifsc_code,
          formType: 'text',
          placeholder: this.$t('personal.text_7') + this.LANGUAG_ETEVT.ifsc_code,
          type: null,
          name: 'ifscCode',
          value: this.editpaymentData.ifscCode || ''
        }
      }
      // 短信验证码
      if (this.userinfo.isOpenMobileCheck === 1) {
        obj.smsAuthCode = {
          title: this.$t('personal.smsAuthCode'),
          formType: 'verifiCode',
          name: 'smsAuthCode',
          operationType: 28,
          placeholder: this.$t('personal.text_7') + this.$t('personal.smsAuthCode'),
          startTime: false,
          data: [],
          value: null
        }
      }
      // google 验证码
      if (this.userinfo.googleStatus === 1) {
        obj.googleCode = {
          title: this.$t('personal.googleCode'),
          placeholder: this.$t('personal.text_7') + this.$t('personal.googleCode'),
          formType: 'number',
          type: null,
          name: 'googleCode',
          value: null
        }
      }
      return obj
    }
  },
  methods: {
    somethings (data) {
      if (data.handleType === 'sendCode') {
        this.sendCode(data)
      }
      if (data.handleType === 'selected' && data.name === 'payment') {
        this.selectedCurrentPayment = data.value
      }
    },
    // 二维码上传成功赋值
    uploadImg (data) {
      this.qrcodeImg_obj.imagesUrl = data.value.base_image_url + data.value.filename // 负责显示图片URL
      this.qrcodeImg_obj.value = data.value.base_image_url + data.value.filename // 负责传给服务端的图片URL
      this.qrcodeImg_obj.errorInfo = '' // 清除错误提示
    },
    // 判断当前是什么类型
    isifcurrent (text) {
      if (!this.currentPayment) return false
      if (this.keyListArr[text].indexOf(this.currentPayment.code) !== -1) {
        return true
      } else {
        return false
      }
    },
    // 获取已经添加过的支付方式数据
    getPaymentLIst () {
      this.axios({
        url: this.$store.state.otcUrl.payment.payment_find,
        headers: {},
        hostType: 'otc',
        params: {isOpen: ''},
        method: 'post'
      }).then((data) => {
        this.paymentLIst = []
        if (data.code.toString() === '0') {
          this.paymentLIst = data.data
          this.keyListArr['key_exist'] = []
          this.paymentLIst.map(item => {
            this.keyListArr['key_exist'].push(item.payment)
            // 获取当前需要编辑的对象数据
            if (this.routetQuery && item.payment === this.routetQuery) {
              this.editpaymentData = item
            }
          })
          if (this.routetQuery && !this.editpaymentData) {
            console.log('No Correspondence Data!')
            this.routetQuery = null
          }
        }
      })
    },
    // 发送验证码
    sendCode (item) {
      let data = {}
      let fla = true
      let arr = this.formList_obj[item.name].data || []
      if (this.formList_obj[item.name].startTime) return false
      if (arr.length > 0) {
        arr.map((item) => {
          if (item === 'aliyunCapcha') {
            if (!this.formList_obj[item].alicapcha.token) {
              fla = false
              this.$set(this.formList_obj[item], 'errorInfo', this.$t('personal.text_6'))
            }
            data = Object.assign({}, this.formList_obj[item].alicapcha, data)
            this.formList_obj[item].alicapcha = {}
          }
        })
      }
      if (!fla) return false
      data.operationType = this.formList_obj[item.name].operationType
      this.formList_obj[item.name].startTime = true // 开启倒计时
      data.nc && data.nc.reset() // 重置滑动验证
      data.nc = null
      this.commonHttp.smsValidCode(data).then((data) => {
        if (data.code === '0') {
          this.$store.dispatch('setTipState', this.$t('personal.text_8'))
        } else {
          this.formList_obj[item.name].startTime = false // 关闭倒计时
          this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
        }
      })
    },
    submit () {
      let data = {}
      let ajaxUrl
      let fla = true
      if (!this.flas) return false
      if (this.isExistPayment) {
        this.$store.dispatch('setTipState', {text: this.LANGUAG_ETEVT.verify_text5, type: 'error'})
        return false
      }
      // 验证必填项
      for (let item in this.formList_obj) {
        if (this.formList_obj[item].value !== undefined && !this.formList_obj[item].value && !this.formList_obj[item].noRequisite) {
          this.$set(this.formList_obj[item], 'errorInfo', this.$t('personal.text_7') + this.formList_obj[item].title)
          fla = false
        } else if (!this.formList_obj[item].noRequisite && !this.formList_obj[item].value.replace(/(^\s*)|(\s*$)/g, '')) {
          this.$set(this.formList_obj[item], 'errorInfo', this.$t('personal.text_7') + this.formList_obj[item].title)
          fla = false
        } else {
          data[item] = this.formList_obj[item].value.replace(/(^\s*)|(\s*$)/g, '')
        }
      }
      // 判断是否有上传收款二维码
      if (this.isifcurrent('key_01')) {
        if (this.qrcodeImg.value !== undefined && !this.qrcodeImg.value) {
          this.qrcodeImg.errorInfo = this.$t('personal.q_upload') + this.qrcodeImg.title
          this.qrcodeImg = this.qrcodeImg_obj
          fla = false
        } else {
          data[this.qrcodeImg.name] = this.qrcodeImg.value
        }
      }
      if (!fla) return false
      this.flas = false
      if (!this.routetQuery) {
        ajaxUrl = this.$store.state.otcUrl.payment.payment_add
      } else {
        ajaxUrl = this.$store.state.otcUrl.payment.payment_update
        data.id = this.editpaymentData.id
      }
      this.axios({
        url: ajaxUrl,
        headers: {},
        params: data,
        hostType: 'otc',
        method: 'post'
      }).then((data) => {
        if (data.code.toString() === '0') {
          this.$router.push('/personal')
          this.$store.dispatch('setTipState', this.$t('personal.submitCuccess'))
        } else {
          this.flas = true
          this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
        }
      }).catch(() => {
        this.flas = true
      })
    }
  }
}
</script>






