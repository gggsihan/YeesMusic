import Vue from 'vue'
import VueRouter from 'vue-router'
import Recommend from '@/views/recommend/recommend'
import Rank from '@/views/rank/rank'
import Search from '@/views/search/search'
import Singer from '@/views/singer/singer'
import SingerDetail from '@/views/singer-detail/singer-detail'
import RankDetail from '@/views/rank-detail/rank-detail'
import PlaylistDetail from '@/views/playlist-detail/playlist-detail'

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
    component: Rank,
    children: [{
      path: ':idx',
      component: RankDetail
    }]
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
  },
  {
    path: '/playlist-detail/:id',
    component: PlaylistDetail
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
