<script setup>
// load json file from server
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useDailyVolumeStore as useTimeVolumeStore } from '@/stores/index.js'
import { storeToRefs } from 'pinia'
import * as echarts from 'echarts'
import styles from '@/assets/styles.js'

const route = useRoute()

const inteval = route.params.interval
// convert inteval from seconds to mininutes, remaining 2 decimal places
const title = 'Packets over Each ' + parseInt(route.params.interval) + ' mins'
const store = useTimeVolumeStore()
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
    orient: 'horizontal',
    itemStyle: styles.myItemStyle.itemStyle,
  },
  // color: styles.themeColor,
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
  thisChart.setOption({
    xAxis: {
      type: 'category',
      data: store.Timeline,
    },
    yAxis: {},
    series: [
      {
        name: 'UDP output',
        type: 'bar',
        stack: 'out',
        data: store.UDPOutVolume,
        large: true,
        itemSteyle: {
          color: '#e67e22',
        },
        emphasis: {
          focus: 'series'
        },
      },
      {
        name: 'UDP income',
        type: 'bar',
        stack: 'in',
        data: store.UDPInVolume,
        large: true,
        itemSteyle: {
          color: '#d35400',
        },
        emphasis: {
          focus: 'series'
        },
      },
      {
        name: 'TCP output',
        type: 'bar',
        stack: 'out',
        data: store.TCPOutVolume,
        large: true,
        itemSteyle: {
          color: '#3498db',
        },
        emphasis: {
          focus: 'series'
        },
      },
      {
        name: 'TCP income',
        type: 'bar',
        stack: 'in',
        data: store.TCPInVolume,
        large: true,
        itemSteyle: {
          color: '#2980b9',
        },
        emphasis: {
          focus: 'series'
        },
      },
    ]
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

<style scoped></style>
