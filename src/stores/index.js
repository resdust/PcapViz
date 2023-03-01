import { defineStore } from 'pinia'
import axios from 'axios'

const useDailyVolumeStore = defineStore('dailyVolume', {
  state: () => ({
    volumeData: [['1','2'],['3','4']]
  }),
  getters: {
    volumeDataX: (state) => {
      // console.log('getter volumeDataX', state.volumeData[0])
      return state.volumeData[0]
    },
    volumeDataY: (state) => {
      // console.log('getter volumeDataY', state.volumeData[1])
      return state.volumeData[1]
    }
  },
  actions: {
    getVolumeData(interval='10') {
      const url = 'http://127.0.0.1:5000/data' + '?interval=' + interval 
      // + '&date=' + '20230114'
      axios.get(url).then(
        (res) => {
          if (res.status == 200) {
            // console.log('res',res);
            this.volumeData = res.data
            console.log('volumeData', [this.volumeData])
          } else {
            console.error('data request fails:', res)
            console.error('error code:', res.status)
          }
        },
    
        (error) => {
          console.log('request fails', error)
        },
      )
    },
  },
})

const useIPCountStore = defineStore('ipCount', {
  state: () => ({
    IPCount: []
  }),
  getters: {
    pieChartData: (state) => {
      return state.IPCount
    }
  },
  actions: {
    getIPCount() {
      const url = 'http://127.0.0.1:5000/data' + '?type=' + 'ip'
      axios.get(url).then(
        (res) => {
          if (res.status == 200) {
            // console.log('res',res);
            this.IPCount = res.data
            console.log('IPCount', [this.IPCount])
          } else {
            console.error('IPCount request fails:', res)
            console.error('error code:', res.status)
          }
        }
      )
    },
  },
})
export {useDailyVolumeStore, useIPCountStore}