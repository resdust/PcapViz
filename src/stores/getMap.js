import { defineStore } from 'pinia'
import axios from 'axios'

const useMapStore = defineStore('ipGeoDist', {
  state: () => ({
    data: {}
  }),
  getters: {
    ipGeoDistData: (state) => {
      return state.data.ipGeoDist
    },
    maxVolume: (state) => {
      return state.data.maxVolume
    }
  },
  actions: {
    getData() {
      const url = 'http://127.0.0.1:5000/data' + '?type=ipDist'
      axios.get(url).then(
        (res) => {
          if (res.status == 200) {
            // console.log('res',res);
            this.data = res.data
            console.log('ip geo distribution data', this.data)
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

export {useMapStore}