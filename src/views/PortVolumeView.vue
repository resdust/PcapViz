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
const title = 'Packets for Functional Ports over Each ' + parseInt(route.params.interval) + ' mins'
const store = usePortVolumeStore()
const { volumeData } = storeToRefs(store)

const dailyVolumeChart = ref(null)
store.getVolumeData(inteval)

const options = {
  title: {
    textStyle: styles.titleStyle.textStyle,
    top: '2%',
    left: 'center',
    text: title,
  },
  legend: {
    textStyle: styles.labelStyle.textStyle,
    right: '10%',
    top: '10%',
    orient: 'horizontal',
    itemStyle: styles.myItemStyle.itemStyle,
  },
  // color: styles.themeColor,
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
  var datas = store.portVolume
  var seriesData = []

  var colorMap = {}
  for (let i = 0; i < datas.length / 2 + 1; i++) {
    colorMap[datas[i].port] = styles.themeColor[i]
  }

  for (let i = 0; i < datas.length; i++) {
    seriesData.push({
      name: datas[i].port,
      type: 'bar',
      stack: 'total',
      data: datas[i].volume,
      itemSteyle: {
        color: colorMap[datas[i].port],
      },
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

function selectRangeEvent() {
  console.log('selectRangeEvent')
  thisChart.dispatchAction({
    type: 'dataZoom',
    start: 10,
    end: 20
  })
}
</script>

<template>
  <!-- <h1>{{ title }}</h1> -->
  <div ref="dailyVolumeChart" class="chart"></div>
  <button @click="selectRangeEvent">click me</button>
</template>

<style scoped></style>
