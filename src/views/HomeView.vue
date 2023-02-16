<script setup>
// load json file from server
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts';
import styles from '../assets/styles.js'

// import { useStore } from 'vuex'

// const store = useStore()
const title = ref('Count of Access to Honeypot')

const options = ref({
  title: {
    text: this.title,
    textStyle: styles.titleStyle.textStyle,
    bottom: '5%',
    left: 'center',
  },
  tooltip: {
    trigger: 'axis',
  },
  legend: {
    textStyle: styles.labelStyle.textStyle,
    right: '10%',
    top: '10%',
    orient: 'vertical',
    itemStyle: styles.myItemStyle.itemStyle,
  },
  color: styles.themeColor,
  grid: {
    top: '10%',
    left: '10%',
    right: '10%',
    bottom: '20%',
    containLabel: true,
    borderColor: '#012f4a',
  },
  xAxis: {
    type: 'category',
    boundaryGap: true,
    data: ['60-69', '70-79', '80-89', '90以上'],
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
    axisLabel: {
      color: '#fff',
      fontSize: '1rem',
    },
  },
  yAxis: {
    type: 'value',
    axisTick: {
      show: false,
    },
    axisLabel: {
      color: '#fff',
      fontSize: '1rem',
      showMinLabel: false,
      formatter: '{value} 人',
    },
    splitLine: styles.splitLineStyle,
  },
  series: [
    {
      name: '男',
      type: 'bar',
      // smooth: true,
      barWidth: '30%',
      stack: 'Total',
      data: this.$store.state.ageCount['mGender'],
      label: {
        show: true,
        formatter: '{c}',
        color: '#eee',
        fontWight: 'bold',
        position: 'right'
      },
      itemStyle: styles.myItemStyle.itemStyle,
    },
    {
      name: '女',
      type: 'bar',
      // smooth: true,
      barWidth: '30%',
      stack: 'Total',
      data: this.$store.state.ageCount['wGender'],
      label: {
        show: true,
        formatter: '{c}',
        color: '#eee',
        fontWight: 'bold',
        position: 'right',
        offset: [0, -8]
      },
      itemStyle: styles.myItemStyle.itemStyle,
    },
  ],
})

</script>

<template>
  <main>
    <h1>{{ title }}</h1>
    <div ref="dailyVolumeChart" class="chart"></div>
  </main>
</template>
