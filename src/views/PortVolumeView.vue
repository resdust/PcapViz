<script setup>
// load json file from server
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { usePortVolumeStore } from '@/stores/index.js'
import { storeToRefs } from 'pinia'
import formItem from '@/components/formItem.vue'
import { selectChartRange } from '@/utils/chartUtils.js'
import * as echarts from 'echarts'
import styles from '@/assets/styles.js'

const route = useRoute()

let interval = route.params.interval
let showSearchBar = ref(false)

const title = (interval) => 'Packets over Each ' + parseInt(interval) + ' mins'
const store = usePortVolumeStore()
const { volumeData } = storeToRefs(store)

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
    },
    axisLabel: {
      formatter: '{value} packets'
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
      tooltip: {
        valueFormatter: function (value) {
          return value + ' Packets';
        }
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
  handleRangeChange()
  thisChart.hideLoading()
  console.log('rerender done')
}

watch(volumeData, (newValue, oldValue) => {
  reRender(store)
  showSearchBar.value = true
})

onMounted(() => {
  thisChart = echarts.init(dailyVolumeChart.value)

  thisChart.showLoading()
  thisChart.resize()
  thisChart.setOption(options)
  // console.log('options', options)
  // thisChart.hideLoading()

  window.addEventListener('resize', function () {
    thisChart.resize()
  })
})

const changeChartTitle = function (title) {
  thisChart.setOption({
    title: {
      text: title
    }
  })
}

let startDate = '2023-02-09'
let duration = 7
function handleRangeChange() {
  console.log('handleDateChange', startDate, duration, 'days')

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
  changeChartTitle(title(interval))
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
          <input v-model="interval" type="text" @change="handleIntervalChange" />
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
