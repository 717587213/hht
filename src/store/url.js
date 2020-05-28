export default {
  state: {
    common: {
      punlic_info: 'common/public_info',
      user_info: 'common/user_info',
      index_data: 'common/index',  // 首页
      footer: 'cms/footer/list', // 底部
      message: 'message/user_message',
      message_del: 'message/message_del', // 删除
      upload_img: 'common/upload_img', // 上传图片
      message_status: 'message/message_update_status',
      info: 'cms/info',
      helpList: 'cms/list ',
      optional_symbol: 'common/update_optional_symbol', // 更新保存自选币对
      rate: 'common/rate', // 查询汇率
      language: 'common/change_language', // 切换语言
      tartCaptcha: 'common/tartCaptcha', // 极验滑动验证码初始化请求数据
      download: 'common/app_download', // app下载
      trade: 'home/mining_trade_info',
      footerAndHeader: 'common/footer_and_header' // header 和 footer 自定义模板
    },
    // 消息中心
    mesage: {
      message_count: 'message/get_no_read_message_count' // 未读
    },
    notice: {
      notice_list: 'notice/notice_info_list', // 公告列表
      notice_info: 'notice/notice_info'
    },
    personal: {
      nickname_update: 'user/nickname_update', // 修改用户昵称
      password_update: 'user/password_update', // 修改用户密码
      mobile_bind_save: 'user/mobile_bind_save', // 用户绑定手机
      mobile_update: 'user/mobile_update', // 用户修改手机
      close_mobile_verify: 'user/close_mobile_verify', // 用户关闭手机验证
      open_mobile_verify: 'user/open_mobile_verify', // 用户开启手机验证
      email_bind_save: 'user/email_bind_save', // 用户绑定邮箱
      email_update: 'user/email_update', // 用户修改邮箱
      finance_password_update: 'user/finance_password/update', // 用户修改资金密码
      exchange_verify: 'user/exchange_verify', // 设置资金密码输入频次
      google_verify: 'user/google_verify', // 用户绑定谷歌验证
      close_google_verify: 'user/close_google_verify', // 用户关闭谷歌验证
      toopen_google_authenticator: 'user/toopen_google_authenticator', // 获取谷歌验证参数
      auth_realname: 'user/auth_realname', // 实名认证
      // 订单管理
      entrust_current: 'order/list/new',  // 当前委托
      entrust_history: 'order/entrust_history',   // 历史委托
      otc_order_complete: 'order/otc/complete ',     // 场外订单-已完成
      otc_order_unfinished: 'order/otc/unfinished', // 场外订单-未完成
      trade_list: 'trade/list',  // 获取委托订单成交
      // 我的api
      my_api_list: 'openapi/my_api_list', // 我的api
      open_api_on: 'openapi/open_api_one', // 展示单个api
      api_file: '/openapi/api_file', // api文档
      create_open_api: '/openapi/create_open_api', // 添加api
      delete_open_api: '/openapi/delete_open_api', // 删除api
      update_api: '/openapi/update_open_api',
      list_by_order: '/trade/list_by_order',
      // 资讯
      quest_list: 'question/list_problem', // 提问列表
      quest_get: 'question/details_problem', // 问题详情
      reply_create: 'question/reply_create', // 追加提问
      quest_delete: 'question/delete_problem', // 删除提问
      create_problem: 'question/create_problem', // 发起提问
      problem_tip_list: 'question/problem_tip_list', // 发起提问标题列表
      // 我的经济
      collec_list: 'agent_collect_list',
      agent_list: 'agent_list'

    },
    question: {
      auth_submit: 'user/auth/submit', // 实名认证
      login_history: 'security/login_history', // 登录历史记录
      setting_history: 'security/setting_history', // 安全设置历史
      update_fee_coin_open: 'user/update_fee_coin_open' // 手续费设置
    },
    fund: {
      account_balance: 'finance/account_balance', // 交易账户信息列表
      otc_account_list: 'finance/otc_account_list', // 场外账户信息列表
      doWithdraw: 'finance/do_withdraw', // 提现信息
      get_charge_address: 'finance/get_charge_address', // 充值信息
      otc_transfer: 'finance/otc_transfer', // 场外资金划转
      deposit_list: 'record/deposit_list', // 充值记录
      withdraw_list: 'record/withdraw_list', // 提现记录
      otc_transfer_list: 'record/otc_transfer_list', // 划转记录
      other_transfer_list: 'record/other_transfer_list', // 其他记录
      address_list: 'addr/address_list', // 钱包地址列表
      add_withdraw_addr: 'addr/add_withdraw_addr', // 新增钱包地址
      delete_withdraw_addr: 'addr/delete_withdraw_addr', // 删除钱包地址
      other_transfer_scene: 'record/other_transfer_scene', // 资金流水类型选项
      deposit_account: 'finance/deposit_account', // 币宝账户信息列表
      deposit_transfer: 'finance/deposit_transfer ', // 储值资金划转
      deposit_detail: 'record/deposit_detail ', // 储值资金划转
      cancel_withdraw: 'finance/cancel_withdraw ' // 撤销提现
    },
    cointran: {
      account_balance: 'finance/account_balance', // 币币交易 交易账户
      order_create: 'order/create', // 币币交易 买卖下单
      order_list_my: 'order/list/new', // 我的挂单 当前委托
      order_list_new: 'order/list/all', // 全部委托订单
      order_list_all: 'trade/list', // 历史委托 ，历史成交列表
      order_cancel: 'order/cancel', // 撤销委托订单
      trade_export: 'trade/export', // 导出成交历史
      list_by_order: 'trade/list_by_order' // 成交记录详情
    },
    user: {
      login: 'user/login_in', // 用户登录
      confirm_login: 'user/confirm_login', // 用户二次登录
      login_out: 'user/login_out', // 用户退出登录
      reg_mobile: 'user/reg_mobile', // 用户手机注册
      reg_email: 'user/reg_email', // 用户邮箱注册
      reset_password_one: 'user/reset_password_step_one', // 用户找回密码第一步
      reset_password_two: 'user/reset_password_step_two', // 用户找回密码第一步
      reset_password_three: 'user/reset_password_step_three', // 用户找回密码第一步
      capital: 'capital_password/set'   // 资金密码

    },
    return: {
      mining: '/return/return_info_list', // 交易挖矿
      invitation: '/return/invite_info_list' // 邀请明细
    },
    bonus: {
      calendar_bonus: 'agent/get_calendar_bonus', // 经纪人管理页面数据
      bonus_record: 'agent/branch_bonus_record',
      export: 'agent/agent_branch_bonus_export'
    }
  }
}
