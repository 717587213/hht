export default {
  state: {
    public_info: 'contract_public_info', // 公共接口
    init_take_order: 'init_take_order', // 下单初始化接口
    take_order: 'take_order', // 下单买卖
    change_level: 'change_level', // 修改杠杆倍数
    user_position: 'user_position', // 合约订单列表
    transfer_margin: 'transfer_margin', // 追加保证金接口
    order_list: 'order_list', // 订单列表接口
    cancel_order: 'cancel_order', // 撤单
    get_liquidation_rate: 'get_liquidation_rate', // 减仓风险排名
    create_all_account: 'create_all_account'
  }
}
