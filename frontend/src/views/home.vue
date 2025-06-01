<template>
  <div class="dashboard">
    <div class="summary-section">
      <div class="summary-item">
        <div class="item-content">
          <p>用户人数</p>
          <p>{{ homeCount.totalNum }}人</p>
        </div>
      </div>
      <div class="summary-item">
        <div class="item-content">
          <p>冻结用户人数</p>
          <p>{{ homeCount.frozenNum }}人</p>
        </div>
      </div>
    </div>
    <div class="chart-section">
      <h3>用户性别比列</h3>
      <div id="gender-chart" style="width: 300px; height: 300px;"></div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import * as echarts from 'echarts';
import {ref} from 'vue';
import api from '../utils/axios'
import { useRouter } from 'vue-router';

// 模拟数据
const homeCount = ref({})
let genderData = [];

const getCount= async()=>{
  const res = await api.get('/home/getCount');
  if(res.data.flag===true){
    homeCount.value = res.data.result;
    console.log(homeCount.value.girlNum);
    console.log(homeCount.value.boyNum)
    console.log(homeCount.value.unknownNum)
    genderData = [
  { value: homeCount.value.girlNum, name: '女' },
  { value: homeCount.value.boyNum, name: '男' },
  { value: homeCount.value.unknownNum, name: '未知' }
  ];
    console.log(genderData);
    initChart();
  }
}
getCount();

const initChart=() => {
  const chartDom = document.getElementById('gender-chart');
  const myChart = echarts.init(chartDom);
  const option = {
    title: {
      text: '用户性别比例',
      subtext: '统计信息',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '用户性别',
        type: 'pie',
        radius: '50%',
        data: genderData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };
  myChart.setOption(option);
};
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.summary-section {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.summary-item {
  background-color: #82b1ff;
  padding: 20px;
  border-radius: 5px;
  color: white;
}

.item-content p {
  margin: 0;
  display: flex;
  justify-content: center;
}

.chart-section {
  margin-top: 20px;
}
</style>