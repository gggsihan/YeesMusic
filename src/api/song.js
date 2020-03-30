import { get } from './http'

const songApi = {
  getSongUrl (id) {
    return get('/api/song/url', { id })
  }
}
export default songApi
