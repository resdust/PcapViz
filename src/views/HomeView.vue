<script setup>
// load json file from server
import { ref, watch, onMounted } from 'vue'
import { useDailyVolumeStore } from '@/stores/index.js'
import { storeToRefs } from 'pinia'
import * as echarts from 'echarts'
import styles from '@/assets/styles.js'

var inteval = '600'
const title = 'Volume of Access over Time'
const store = useDailyVolumeStore()
store.getVolumeData(inteval)
const { volumeData } = storeToRefs(store)

const dailyVolumeChart = ref(null)

const options = {
  title: {
    textStyle: styles.titleStyle.textStyle,
    bottom: '5%',
    left: 'center',
  },
  legend: {
    textStyle: styles.labelStyle.textStyle,
    right: '10%',
    top: '10%',
    orient: 'vertical',
    itemStyle: styles.myItemStyle.itemStyle,
  },
  color: styles.themeColor,
  // visualMap: {
  //   top: 50,
  //   right: 10,
  //   pieces: [
  //     {
  //       gt: 0,
  //       lte: 10,
  //       color: styles.themeColor[0]
  //     },
  //     {
  //       gt: 10,
  //       lte: 100,
  //       color: '#FC7D02'
  //     },
  //     {
  //       gt: 100,
  //       lte: 1000,
  //       color: '#FD0100'
  //     },
  //     {
  //       gt: 1000,
  //       color: '#AA069F'
  //     },
  //   ]
  // },
  toolbox: {
    feature: {
      dataZoom: {
        yAxisIndex: false
      },
      saveAsImage: {
        pixelRatio: 2
      }
    }
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  grid: {
    bottom: 90
  },
  dataZoom: [{
    type: 'inside'
  }, {
    type: 'slider'
  }],
  xAxis: {
    data: ['1', '2'],
    silent: false,
    splitLine: {
      show: false
    },
    splitArea: {
      show: false
    }
  },
  yAxis: {
    splitArea: {
      show: false
    }
  },
  series: [
    {
      name: 'volume',
      type: 'bar',
      large: true,
      data: ['3', '4'],
      // label: {
      //   show: true,
      //   formatter: '{c}',
      //   color: '#eee',
      //   fontWight: 'bold',
      //   position: 'right'
      // },
      // itemStyle: styles.myItemStyle.itemStyle,
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
    xAxis: {
      data: store.volumeDataX,
    },
    yAxis: {},
    series: [{
      data: store.volumeDataY,
    }]
  })
  thisChart.hideLoading()
}

watch(volumeData, (newValue, oldValue) => {
  console.log('watch volumeData', newValue, oldValue)
  reRender(store)
})

onMounted(() => {
  thisChart = echarts.init(dailyVolumeChart.value)

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
  <div ref="dailyVolumeChart" class="chart"></div>
</template>

<style scoped>
div .chart {
  width: 100%;
  height: 60vh;
}
</style>
