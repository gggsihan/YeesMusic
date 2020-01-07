import Vue from 'vue'
import VueRouter from 'vue-router'
import Recommend from '@/views/recommend/recommend'
import Rank from '@/views/rank/rank'
import Search from '@/views/search/search'
import Singer from '@/views/singer/singer'
import SingerDetail from '@/views/singer-detail/singer-detail'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/recommend'
  },
  {
    path: '/recommend',
    component: Recommend
  },
  {
    path: '/rank',
    component: Rank
  },
  {
    path: '/search',
    component: Search
  },
  {
    path: '/singer',
    component: Singer,
    children: [{
      path: ':id',
      component: SingerDetail
    }]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
