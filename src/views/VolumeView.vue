<script setup>
// load json file from server
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useTimeVolumeStore } from '@/stores/index.js'
import { storeToRefs } from 'pinia'
import formItem from '@/components/formItem.vue'
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
    bottom: 90,
    left: 100,
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
  yAxis: [
    {
      type: 'value',
      name: 'Packets',
      axisLabel: {
        formatter: '{value} packets'
      },
      alignTicks: true,
      max(val) {
        if (val.min >= 0 && val.max >= 0) return val.max;
        if (Math.abs(val.max) > Math.abs(val.min)) {
          return (Math.abs(val.max) * 1.2).toFixed(0);
        }
        return (Math.abs(val.min) * 1.2).toFixed(0);
      },
      min(val) {
        if (val.min >= 0 && val.max >= 0) return val.min;
        if (Math.abs(val.max) > Math.abs(val.min)) {
          return (-Math.abs(val.max) * 1.2).toFixed(0);
        }
        return (-Math.abs(val.min) * 1.2).toFixed(0);
      },
    },
    {
      type: 'value',
      name: 'Volume',
      axisLabel: {
        formatter: function (value, index) {
          return (value / 1000).toFixed(2) + ' KB';
        }
      },
      alignTicks: true,
      max(val) {
        if (val.min >= 0 && val.max >= 0) return val.max;
        if (Math.abs(val.max) > Math.abs(val.min)) {
          return (Math.abs(val.max) * 1.2).toFixed(0);
        }
        return (Math.abs(val.min) * 1.2).toFixed(0);
      },
      min(val) {
        if (val.min >= 0 && val.max >= 0) return val.min;
        if (Math.abs(val.max) > Math.abs(val.min)) {
          return (-Math.abs(val.max) * 1.2).toFixed(0);
        }
        return (-Math.abs(val.min) * 1.2).toFixed(0);
      },
    }
  ],
  series: [

  ],
}

var thisChart = null

const reRender = function (store) {
  console.log('rerender...')
  console.log(store)
  thisChart.setOption({
    xAxis: {
      type: 'category',
      data: store.Timeline,
    },
    yAxis: {},
    series: [
      {
        name: 'Outgoing Packets',
        type: 'bar',
        data: store.OutPackets,
        large: true,
        tooltip: {
          valueFormatter: function (value) {
            return value + ' Packets';
          }
        },
        itemSteyle: {
          color: '#e67e22',
        },
        emphasis: {
          focus: 'series'
        },
      },
      {
        name: 'Incoming Packets',
        type: 'bar',
        data: store.InPackets,
        large: true,
        tooltip: {
          valueFormatter: function (value) {
            return value + ' Packets';
          }
        },
        itemSteyle: {
          color: '#d35400',
        },
        emphasis: {
          focus: 'series'
        },
      },
      {
        name: 'Outgoing Bytes',
        type: 'line',
        stack: 'total',
        yAxisIndex: 1,
        data: store.OutBytes,
        large: true,
        tooltip: {
          valueFormatter: function (value) {
            return (value / 1000).toFixed(2) + ' KB';
          }
        },
        itemSteyle: {
          color: '#3498db',
        },
        emphasis: {
          focus: 'series'
        },
      },
      {
        name: 'Incoming Bytes',
        type: 'line',
        stack: 'total',
        yAxisIndex: 1,
        data: store.InBytes,
        large: true,
        tooltip: {
          valueFormatter: function (value) {
            return (value / 1000).toFixed(2) + ' KB';
          }
        },
        itemSteyle: {
          color: '#2980b9',
        },
        emphasis: {
          focus: 'series'
        },
      },
    ]
  })
  handleRangeChange()
  thisChart.hideLoading()
  console.log('rerender done.')
}

const changeChartTitle = function (title) {
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
