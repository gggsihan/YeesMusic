import { get } from './http'

const playlistApi = {
  getPlaylistDetail (id) {
    return get('/api/playlist/detail', { id })
  }
}

export default playlistApi
