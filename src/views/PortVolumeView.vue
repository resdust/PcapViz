<script setup>
// load json file from server
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { usePortVolumeStore } from '@/stores/index.js'
import { storeToRefs } from 'pinia'
import * as echarts from 'echarts'
import styles from '@/assets/styles.js'

const route = useRoute()

const inteval = route.params.interval
// convert inteval from seconds to mininutes, remaining 2 decimal places
const title = 'Volume of Access over Each ' + parseInt(route.params.interval) + ' mins'
const store = usePortVolumeStore()
const { volumeData } = storeToRefs(store)

const dailyVolumeChart = ref(null)
store.getVolumeData(inteval)

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

  ],
}

var thisChart = null

const reRender = function (store) {
  console.log('rerender...')
  datas = store.portVolume
  seriesData = []

  for (let i = 0; i < datas.length; i++) {
    seriesData.push({
      name: datas[i].port,
      type: 'bar',
      stack: 'total',
      data: datas[i].volume,
      emphasis: {
        focus: 'series'
      },
    })
  }
  thisChart.setOption({
    xAxis: {
      type: 'category',
      data: store.Timeline,
    },
    yAxis: {},
    series: seriesData
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