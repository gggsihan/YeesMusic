import { get } from './http'

// 获取推荐歌单
const recommendApi = {
  // 获取轮播图
  getBanner () {
    return get('/api/banner?_=1234')
  },
  // 获取推荐歌单
  recomList () {
    return get('/api/personalized', { limit: 6 })
  },
  // 获取推荐MV
  recomMvList () {
    return get('/api/personalized/mv')
  },
  // 获取新歌列表
  newSongList () {
    return get('/api/top/song')
  },
  // 获取新碟列表
  newAlbumList () {
    return get('/api/top/album?limit=3')
  }
}

export default recommendApi
