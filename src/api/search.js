import { get } from './http'

const searchApi = {
  // 默认搜索关键词
  getDefaultSearch () {
    return get('/api/search/default')
  },
  // 获取热门搜索
  getHotSearch () {
    return get('/api/search/hot/detail')
  },
  // 搜索关键词
  searchKeyword (keywords, offset) {
    return get('/api/search', { keywords, limit: 10, offset })
  },
  // 搜索建议
  searchSuggest (keywords) {
    return get('/api/search/suggest', { keywords, type: 'mobile' })
  },
  // 搜索多重匹配
  searchMultimatch (keywords) {
    return get('/api/search/multimatch', { keywords })
  }
}
export default searchApi
