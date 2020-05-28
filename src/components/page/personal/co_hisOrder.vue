<template>
  <div class="venue-box">
    <!-- 头部 -->
    <div class="venue-title">
      <span>当前委托</span>
      <!-- <i @click="curren(state)"> {{state}} &gt;</i> -->
    </div>
    <!-- loading -->
    <div class="loading"><loading></loading></div>
    <!-- 正常内容 -->
    <div>
      <!-- 有数据 -->
      <div> 
        <table>
          <thead>
            <tr>
              <th class="thead-color">订单号</th>
              <th class="thead-color">合约</th>
              <th class="thead-color">杠杆</th>
              <th class="thead-color">时间</th>
              <th class="thead-color">类型</th>
              <th class="thead-color">数量</th>
              <th class="thead-color">价格</th>
              <th class="thead-color">已成交</th>
              <th class="thead-color">成交均价</th>
              <th class="thead-color">冻结保证金</th>
              <th class="thead-color">状态</th>
              <th class="status_msg">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>123123</td>
              <td>12312312</td>
              <td>123123</td>
              <td>12312312</td>
              <td>123123</td>
              <td>12312312</td>
              <td>123123</td>
              <td>12312312</td>
              <td>123123</td>
              <td>12312312</td>
              <td>123123</td>
              <td></td>
            </tr>
          </tbody>         
        </table>
        <!-- 当前委托分页 -->
        <!-- <Vpagination v-if="(currtion.count/currtion.pageSize) > 1"
          :total="currtion.count"
          :current-page='currtion.page'
          :display='currtion.pageSize'
          @pagechange="currchange($event)" class="page">
        </Vpagination> -->
      </div>
    </div>            
  </div>
</template>
