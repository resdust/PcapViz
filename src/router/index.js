import { createRouter, createWebHistory } from 'vue-router'
import VolumeView from '@/views/VolumeView.vue'
import PortVolumeView from '@/views/PortVolumeView.vue'
import PieView from '@/views/PieView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/60',
    },
    {
      path: '/:interval',
      name: 'volume',
      component: VolumeView
    },
    {
      path: '/port/:interval',
      name: 'portVolume',
      component: PortVolumeView
    },
    {
      path: '/ipcount',
      name: 'IPcount',
      component: PieView
    }
  ]
})

export default router
