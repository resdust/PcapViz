<script setup>
// load json file from server
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useDailyVolumeStore as useTimeVolumeStore } from '@/stores/index.js'
import formItem from '@/components/formItem.vue'
import { storeToRefs } from 'pinia'
import { selectChartRange } from '@/utils/chartUtils.js'
import * as echarts from 'echarts'
import styles from '@/assets/styles.js'

const route = useRoute()

let interval = route.params.interval
// convert inteval from seconds to mininutes, remaining 2 decimal places
const title = (interval) => 'Packets over Each ' + parseInt(interval) + ' mins'
const store = useTimeVolumeStore()
const { volumeData } = storeToRefs(store)

let showSearchBar = ref(false)

const dailyVolumeChart = ref(null)
store.getVolumeData(interval)

const options = {
  title: {
    textStyle: styles.titleStyle.textStyle,
    top: '2%',
    left: 'center',
    text: title(interval),
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
        stack: 'total',
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
        stack: 'total',
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
        stack: 'total',
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
        stack: 'total',
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
  console.log('rerender done.')
}

const chageChartTitle = function (title) {
  thisChart.setOption({
    title: {
      text: title
    }
  })
}

watch(volumeData, (newValue, oldValue) => {
  // console.log('watch volumeData', newValue, oldValue)
  reRender(store)
  showSearchBar.value = true
})

onMounted(() => {
  thisChart = echarts.init(dailyVolumeChart.value)

  thisChart.showLoading()
  thisChart.resize()
  thisChart.setOption(options)

  window.addEventListener('resize', function () {
    thisChart.resize()
  })
})

let startDate = '2023-02-12'
let duration = 7
function handleRangeChange() {
  console.log('handleDateChange', startDate)

  const timeseries = volumeData.value.timeseries

  thisChart.showLoading()
  const originStart = timeseries.slice(0, 1)
  const originEnd = timeseries.slice(-1)
  console.log('originStart', originStart)
  console.log('originEnd', originEnd)

  selectChartRange(thisChart, startDate, duration, originStart, originEnd)
  thisChart.hideLoading()
}


function handleIntervalChange() {
  console.log('handleIntervalChange', interval)
  thisChart.showLoading()
  chageChartTitle(title(interval))
  store.getVolumeData(interval)
  thisChart.hideLoading()
}
</script>

<template>
  <div class="wrapper">
    <keep-alive>
      <div class="searchBar" v-if="showSearchBar">
        <formItem label="Start Date">
          <input v-model="startDate" type="date" placeholder="Select date" @change="handleRangeChange" />
        </formItem>
        <formItem label="Interval (Mins)">
          <input v-model="interval" type="text" @change="handleIntervalChange" @keyup.enter="handleIntervalChange" />
        </formItem>
        <formItem label="Durateion (Days)">
          <!-- select 1 week or 3 days -->
          <select v-model="duration" @change="handleRangeChange">
            <option value="7">1 week</option>
            <option value="3">3 days</option>
          </select>
        </formItem>
        <formItem label="Refresh">
          <input type="button" value="Refresh" @click="handleRangeChange" />
        </formItem>
      </div>
    </keep-alive>
    <div ref="dailyVolumeChart" class="chart"></div>
  </div>
</template>

<style scoped>
.wrapper {
  width: 100%;
}

.searchBar {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 10px;
  column-gap: 0.5rem
}
</style>
