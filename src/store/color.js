export default {
  state: {
    // TradingView 皮肤颜色
    KlineColor: {
      // 默认版
      theme_default: {
        background: '#0a152d', // 图表区域 背景色
        toolbar_bg: '#0a152d',  // 工具栏底色
        textColor: '#b7c2ce', // 图标区域xy轴 文字颜色
        lineColor: '#172d47', // 图表区域xy轴 线颜色
        vertGridProperties: '#13263f', // 图表区域 表格纵轴颜色
        horzGridProperties: '#13263f', // 图表区域 表格橫轴颜色
        crossHairProperties: '#fafafa', // 图表区域 鼠标十字线颜色
        borderColor: '#ff3933',
        wickColor: '#737375',
        panel_background: '#2b89e1',
        svg_fill: '#b7c2ce',
        svg_color: '#b7c2ce',
        textColor_fill: '#2b89e1',
        textColor_color: '#2b89e1',
        fall: '#cb4848',
        rise: '#01bd8b',
        line1: 'rgba(0,5,15,0.3)', // 分时背景色
        line2: 'rgba(0,5,15,0.3)', // 分时背景色
        line: '#2b89e1' // 分时线颜色
      },
      // 浅色版
      theme_white: {
        background: '#fff', // 图表区域 背景色
        toolbar_bg: '#fff',  // 工具栏底色
        textColor: '#5f7bba', // 图标区域xy轴 文字颜色
        lineColor: '#e3eaee', // 图表区域xy轴 线颜色
        vertGridProperties: '#e3eaee', // 图表区域 表格纵轴颜色
        horzGridProperties: '#e3eaee', // 图表区域 表格橫轴颜色
        crossHairProperties: '#5f7bba', // 图表区域 鼠标十字线颜色
        borderColor: '#ff3933',
        wickColor: '#737375',
        panel_background: '#2b89e1',
        svg_fill: '#b7c2ce',
        svg_color: '#b7c2ce',
        textColor_fill: '#2b89e1',
        textColor_color: '#2b89e1',
        fall: '#cb4848',
        rise: '#01bd8b',
        line1: 'rgba(0,5,15,0.3)', // 分时背景色
        line2: 'rgba(0,5,15,0.3)', // 分时背景色
        line: '#2b89e1' // 分时线颜色
      },
      // 黑色版
      theme_black: {
        background: '#181818', // 图表区域 背景色
        toolbar_bg: '#181818',  // 工具栏底色
        textColor: '#9fabb7', // 图标区域xy轴 文字颜色
        lineColor: '#292929', // 图表区域xy轴 线颜色
        vertGridProperties: '#292929', // 图表区域 表格纵轴颜色
        horzGridProperties: '#292929', // 图表区域 表格橫轴颜色
        crossHairProperties: '#9fabb7', // 图表区域 鼠标十字线颜色
        borderColor: '#ff3933',
        wickColor: '#737375',
        panel_background: '#d29400',
        svg_fill: '#9fabb7',
        svg_color: '#9fabb7',
        textColor_fill: '#d29400',
        textColor_color: '#d29400',
        fall: '#cb4848', // 跌 红
        rise: '#0baaa1', // 涨 绿
        line1: 'rgba(19, 19, 19, 0.9)', // 分时背景色
        line2: 'rgba(19, 19, 19, 0.9)', // 分时背景色
        line: '#2e2e2e' // 分时线颜色
      }
    },
    // 币币交易页面的五个推荐板块的Chart折线图的颜色
    HomeChartColor: {
      // 默认版
      theme_default: {
        lineStyle: '#053973', // 边框颜色
        areaStyle: 'rgba(14,26,54, 0)' // 背景颜色
      },
      // 浅色版
      theme_white: {
        lineStyle: '#5f7bba', // 边框颜色
        areaStyle: 'rgba(238, 243, 248, 0)' // 背景颜色
      },
      // 黑色版
      theme_black: {
        lineStyle: '#2e2e2e', // 边框颜色
        areaStyle: 'rgba(19, 19, 19, 0)' // 背景颜色
      }
    }
  },
  mutations: {}
}
