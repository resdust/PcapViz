import { createRouter, createWebHistory } from 'vue-router'
import VolumeView from '@/views/VolumeView.vue'
import PieView from '@/views/PieView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/600',
    },
    {
      path: '/:interval',
      name: 'volume',
      component: VolumeView
    },
    {
      path: '/ipcount',
      name: 'IPcount',
      component: PieView
    }
  ]
})

export default router
