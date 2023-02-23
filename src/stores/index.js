import { defineStore } from 'pinia'
import axios from 'axios'

export const useDailyVolumeStore = defineStore('dailyVolume', {
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
      axios.get(url).then(
        (res) => {
          if (res.status == 200) {
            // console.log('res',res);
            this.volumeData = res.data
            console.log('volumeData', [this.volumeData])
          } else {
            console.error('request fails:', res)
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
