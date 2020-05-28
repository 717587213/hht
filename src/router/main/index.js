import mesage from '@/components/page/mesage'
import login from '@/components/page/login'
import cms from '@/components/page/cms'
import register from '@/components/page/register'
import forgetPassword from '@/components/page/resetpwd/forgetPassword'
import personal from '@/components/page/personal/personal'
import revisePassword from '@/components/page/personal/revisePassword'
import bindMobile from '@/components/page/personal/bindMobile'
import closeMobileVerify from '@/components/page/personal/closeMobileVerify'
import bindEmail from '@/components/page/personal/bindEmail'
import googleBind from '@/components/page/personal/googleBind'
import infoAttestation from '@/components/page/personal/infoAttestation'
import funds from '@/components/page/funds/funds_manage'
import finance from '@/components/page/funds/finance_manage'
import address from '@/components/page/funds/address_manage'
import fundsDetail from '@/components/page/funds/funds_detail'
import apimanage from '@/components/page/apimanage/apimanage'
import questions from '@/components/page/question/questions'
import detail from '@/components/page/question/detail'
import order from '@/components/page/personal/order'
import noticeInfo from '@/components/page/noticeInfo'
import helpCenter from '@/components/page/helpCenter'
import home from '@/components/page/home/main'
import agent from '@/components/page/agents'
import mining from '@/components/page/mining'
import invitation from '@/components/page/invitation'
import wallet from '@/components/page/wallet/wallet'
import payment from '@/components/page/personal/payment'
export default [
  {
    // 首页
    path: '/index',
    name: 'index',
    meta: {
      title: 'index'
    },
    component: home
  },
  {
    // 消息中心
    path: '/mesage',
    name: 'mesage',
    meta: {
      title: 'mesage'
    },
    component: mesage
  },
  {
    // 登录
    path: '/login',
    name: 'login',
    meta: {
      title: 'login'
    },
    component: login
  },
  {
    path: '/cms',
    name: 'cms',
    meta: {
      title: 'cms'
    },
    component: cms
  },
  {
    // 注册
    path: '/register',
    name: 'register',
    meta: {
      title: 'register'
    },
    component: register
  },
  {
    // 忘记密码
    path: '/forgetPassword',
    name: 'forgetPassword',
    meta: {
      title: 'forgetPassword'
    },
    component: forgetPassword
  },
  {
    // 个人中心
    path: '/personal',
    name: 'personal',
    meta: {
      title: 'personal'
    },
    component: personal
  },
  {
    // 修改登录密码
    path: '/personal/revisePassword/',
    name: 'revisePassword',
    meta: {
      title: 'revisePassword'
    },
    component: revisePassword
  },
  {
    // 绑定、修改手机号
    path: '/personal/bindMobile/',
    name: 'bindMobile',
    meta: {
      title: 'bindMobile'
    },
    component: bindMobile
  },
  {
    // 关闭手机验证
    path: '/personal/closeMobileVerify/',
    name: 'closeMobileVerify',
    meta: {
      title: 'closeMobileVerify'
    },
    component: closeMobileVerify
  },
  {
    // 绑定、修改邮箱
    path: '/personal/bindEmail/',
    name: 'bindEmail',
    meta: {
      title: 'bindEmail'
    },
    component: bindEmail
  },
  {
    // Google 认证
    path: '/personal/googlebind/',
    name: 'googleBind',
    meta: {
      title: 'googleBind'
    },
    component: googleBind
  },
  {
    // 基础信息认证
    path: '/personal/infoAttestation/',
    name: 'infoAttestation',
    meta: {
      title: 'infoAttestation'
    },
    component: infoAttestation
  },
  {
    // 资金管理
    path: '/funds',
    redirect: '/funds/funds_manage'
  },
  {
    // 资金管理
    path: '/funds/funds_manage',
    name: 'funds',
    meta: {
      title: 'funds'
    },
    component: funds
  },
  {
    // 资金流水
    path: '/funds/finance_manage',
    name: 'finance',
    meta: {
      title: 'finance'
    },
    component: finance
  },
  {
    // 地址管理
    path: 'funds/address_manage',
    name: 'address',
    meta: {
      title: 'address'
    },
    component: address
  },
  {
    // 查看详情
    path: 'funds/funds_detail',
    name: 'fundsDetail',
    meta: {
      title: 'fundsDetail'
    },
    component: fundsDetail
  },
  {
    // api管理
    path: '/api',
    name: 'apimanage',
    meta: {
      title: 'apimanage'
    },
    component: apimanage
  },
  {
    // 提问列表
    path: '/questions',
    name: 'questions',
    meta: {
      title: 'questions'
    },
    component: questions
  },
  {
    path: '/questions/detail',
    name: 'detail',
    meta: {
      title: 'detail'
    },
    component: detail
  },
  // 提问列表-提问详情
  {
    path: '/detail',
    name: 'qadetail',
    meta: {
      title: 'detail'
    },
    component: detail
  },
  // 经济人管理
  {
    path: '/agent',
    name: 'agent',
    meta: {
      title: 'agent'
    },
    component: agent
  },
  {
    // 订单管理
    path: '/order',
    name: 'order',
    meta: {
      title: 'order'
    },
    component: order
  },
  // 公告
  {
    path: '/notice_info',
    name: 'notice_info',
    meta: {
      title: 'notice_info'
    },
    component: noticeInfo
  },
  // 帮助中心
  {
    path: '/help_center',
    name: 'help_center',
    meta: {
      title: 'help_center'
    },
    component: helpCenter
  },
  // 交易挖矿
  {
    path: '/mining',
    name: 'mining',
    meta: {
      title: 'mining'
    },
    component: mining
  },
  // 交易明细
  {
    path: '/invitation',
    name: 'invitation',
    meta: {
      title: 'invitation'
    },
    component: invitation
  },
  {
    path: '/wallet',
    name: 'wallet',
    meta: {
      title: 'wallet'
    },
    component: wallet
  },
  // 支付方式 添加 修改
  {
    path: 'personal/payment',
    name: 'payment',
    meta: {
      title: 'payment'
    },
    component: payment
  }
]
