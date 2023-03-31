<template>
  <div ref="mapChart" class="chart"></div>
</template>

<script setup>
import * as echarts from 'echarts';
import { useMapStore } from '@/stores/index.js';
import MapData from "@/assets/map/worldMap.json";
import { storeToRefs } from 'pinia';
import { ref, onMounted, watch } from 'vue';

const mapChart = ref(null)
const store = useMapStore()
const { ipGeoDistData } = storeToRefs(store)
var thisChart = null

watch(ipGeoDistData, (newValue, oldValue) => {
  console.log('watch ipGeoDistData', newValue, oldValue)
  reRender()
})

const reRender = function () {
  console.log('rerender...')
  thisChart.setOption({
    visualMap: {
      min: 1,
      max: (store.maxVolume * 0.6).toFixed(0)
    },
    series: [
      {
        data: store.ipGeoDistData,
      },
    ]
  })
  thisChart.hideLoading()
  console.log('rerender done.')
}

onMounted(() => {
  thisChart = echarts.init(mapChart.value);
  var option;

  store.getData();
  thisChart.showLoading();

  const worldJson = MapData;
  echarts.registerMap('worldMap', worldJson);
  option = {
    title: {
      text: 'Accessed IP Geolocation Distribution',
      left: 'right'
    },
    tooltip: {
      trigger: 'item',
      showDelay: 0,
      transitionDuration: 0.2
    },
    visualMap: {
      type: 'continuous',
      left: 'right',
      min: 1,
      inRange: {
        color: [
          '#ffffbf',
          // '#fee090',
          '#fdae61',
          '#f46d43',
          '#d73027',
          '#a50026'
        ]
      },
      text: ['High', 'Low'],
      calculable: true
    },
    toolbox: {
      show: true,
      left: 'left',
      top: 'top',
      feature: {
        dataView: { readOnly: false },
        restore: {},
        saveAsImage: {}
      }
    },
    series: [
      {
        name: 'Access Amount',
        type: 'map',
        map: 'worldMap',
        emphasis: {
          label: {
            show: true
          }
        },
        data: [
          { name: 'United States', value: 98239 },
          { name: 'China', value: 31449 },
          { name: 'Singapore', value: 3255 },
          { name: 'Japan', value: 9131 },
          { name: 'Russia', value: 41430 },
        ]
      }
    ]
  };
  thisChart.setOption(option);
});


</script>

<style></style>