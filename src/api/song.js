import { get } from './http'

const songApi = {
  // 获取音乐播放url
  getSongUrl (id) {
    return get('/api/song/url', { id })
  },
  // 获取歌词
  getSongLyric (id) {
    return get('/api/lyric', { id })
  }
}
export default songApi
