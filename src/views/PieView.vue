<script setup>
// load json file from server
import { ref, watch, onMounted } from 'vue'
import { useIPCountStore } from '@/stores/index.js'
import { storeToRefs } from 'pinia'
import * as echarts from 'echarts'
import styles from '@/assets/styles.js'

const title = 'IP Count of Access to Honeypot'
const store = useIPCountStore()
store.getIPCount()
const { IPCount } = storeToRefs(store)

const IPPieChart = ref(null)

const options = {
  title: {
    textStyle: styles.titleStyle.textStyle,
    bottom: '5%',
    left: 'center',
  },
  // legend: {
  //   textStyle: styles.labelStyle.textStyle,
  //   right: '10%',
  //   top: '10%',
  //   orient: 'vertical',
  //   itemStyle: styles.myItemStyle.itemStyle,
  // },
  color: styles.themeColor,
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)'
  },
  series: [
    {
      name: 'IP count',
      type: 'pie',
      radius: ['50%', '70%'],
      avoidLabelOverlap: false,
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '30',
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: true
      },
      data: [
        { value: 335, name: '直接访问' },
        { value: 310, name: '邮件营销' },
        { value: 234, name: '联盟广告' },
        { value: 135, name: '视频广告' },
        { value: 1548, name: '搜索引擎' }
      ]
    },
  ],
}

var thisChart = null

const reRender = function (store) {
  console.log('rerender...')
  // console.log('rerender volumeData.valueX', store.volumeDataX)
  // console.log('rerender volumeData.valueY', store.volumeDataY)
  // thisChart.showLoading()
  thisChart.setOption({
    series: [{
      data: store.pieChartData,
    }]
  })
  thisChart.hideLoading()
}

watch(IPCount, (newValue, oldValue) => {
  console.log('watch IPCount', newValue, oldValue)
  reRender(store)
})

onMounted(() => {
  thisChart = echarts.init(IPPieChart.value)

  thisChart.showLoading()
  thisChart.resize()
  thisChart.setOption(options)
  console.log('options', options)
  // thisChart.hideLoading()

  window.addEventListener('resize', function () {
    thisChart.resize()
  })
})

</script>

<template>
  <h1>{{ title }}</h1>
  <div class="chart" ref="IPPieChart">
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
