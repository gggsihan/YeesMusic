<template>
  <transition name="trans">
    <div class="ui-search" ref="seContent">
      <!-- 搜索框 -->
      <div class="search-input" ref="seInput">
        <input v-model="searchVal" @input="onInput()" :placeholder="defaultSearch.showKeyword"/>
        <span class="highlight" @click="goSearch(searchVal)">搜索</span>
        <span @click="goCancle()">取消</span>
      </div>
      <scroll class="search-cont" ref="seScroll">
        <div>
          <div v-if="!searchVal">
            <!-- 搜索历史 -->
            <div class="search-history" v-if="historyList.length!==0">
              <div class="his-title">
                <span>搜索历史</span>
                <i class="icon-clear" @click="deleteStorage()"></i>
              </div>
              <div class="his-content">
                <span @click="goSearch(item)" v-for="(item, index) in historyList" :key="index">{{item}}</span>
              </div>
            </div>
            <!-- 热搜榜 -->
            <div class="search-hot">
              <div class="hot-title">热搜榜</div>
              <div class="hot-list">
                <div class="hot-item" @click="goSearch(item.searchWord)" v-for="(item, index) in hotList" :key="index">
                  <span class="hot-num" :class="index < 4 ? 'highlight' : ''">{{index + 1}}</span>
                  <div>
                    <div>{{item.searchWord}}</div>
                    <div class="hot-detail">{{item.content}}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 搜素关联词 -->
          <div v-if="searchVal">
            <div class="search-item" @click="goSearch(item.keyword)" v-for="(item, index) in suggestList" :key="index">
              <i class="icon-search"></i><span>{{item.keyword}}</span>
            </div>
          </div>
        </div>
      </scroll>
    </div>
  </transition>
</template>

<script>
import searchApi from 'api/search'
import Scroll from '@/components/base/scroll/scroll'

export default {
  data () {
    return {
      defaultSearch: {},
      searchVal: '',
      historyList: [],
      hotList: [],
      suggestList: []
    }
  },
  components: {
    Scroll
  },
  created () {
    searchApi.getDefaultSearch().then(data => {
      this.defaultSearch = data.data
    })
    searchApi.getHotSearch().then(data => {
      this.hotList = data.data
    })
    this.getStorage()
  },
  mounted () {
    // 计算滑动区域高度
    this.$refs.seScroll.$el.style.height = `${this.$refs.seContent.clientHeight - this.$refs.seInput.clientHeight}px`
  },
  methods: {
    goCancle () {
      this.clearSearch()
      this.$router.go(-1)
    },
    onInput () {
      if (this.searchVal) {
        searchApi.searchSuggest(this.searchVal).then(data => {
          this.suggestList = data.result.allMatch
        })
      } else {
        this.suggestList = []
      }
    },
    goSearch (keyword) {
      if (keyword) {
        this.searchVal = keyword
      } else {
        this.searchVal = this.defaultSearch.realkeyword
      }
      this.setStorage()
    },
    clearSearch () {
      this.searchVal = ''
      this.suggestList = ''
    },
    setStorage () {
      if (!window.localStorage) {
        return false
      } else {
        if (this.historyList.indexOf(this.searchVal) === -1) {
          this.historyList.push(this.searchVal)
          window.localStorage.setItem('historyList', JSON.stringify(this.historyList))
        }
      }
    },
    getStorage () {
      if (!window.localStorage) {
        return false
      } else {
        if (window.localStorage.getItem('historyList')) {
          this.historyList = JSON.parse(window.localStorage.getItem('historyList'))
        }
      }
    },
    deleteStorage () {
      if (!window.localStorage) {
        return false
      } else {
        window.localStorage.removeItem('historyList')
        this.historyList = []
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'
.trans-enter-active, .trans-leave-active
  transition: transform 0.5s
.trans-enter, .trans-leave-to
  transform: translate3d(100%, 0, 0)
.highlight
  color: $color-theme !important
.ui-search
  position: fixed
  top: 0
  left: 0
  right: 0
  bottom: 64px
  background: $color-background
  .search-input
    height: 44px
    padding: 0 16px
    display: flex
    justify-content: space-around
    align-items: center
    color: $color-text-l
    input
      flex: 1
      height: 30px
      background: $color-background-l
      border-radius 30px
      padding: 0 10px
      color: $color-text
    input::placeholder
      font-size: font-size-small-s !important
      color: $color-text-d
    span
      margin-left: 10px
  .search-cont
    top: 44px
    overflow: hidden
  .search-history
    padding: 0 16px
    .his-title
      height: 44px
      display: flex
      justify-content: space-between
      align-items: center
      color: $color-theme
      font-size: $font-size-medium
    .his-content
      height: 44px;
      white-space: nowrap;
      overflow-y: auto;
      display: flex;
      align-items: center;
      &.his-content::-webkit-scrollbar
        display: none;
      span
        font-size: $font-size-small-s
        background: $color-background-l
        padding: 5px 10px
        border-radius: 10px
        margin-right: 10px
  .search-hot
    padding: 0 16px
    font-size: $font-size-medium
    padding-bottom: 20px
    .hot-title
      height: 44px
      color: $color-theme
      padding: 15px 0
      box-sizing: border-box
    .hot-list
      display:flex
      flex-wrap: wrap
      .hot-item
        width: 50%
        height: 44px
        display: flex
        align-items: center
        color: $color-text
        .hot-num
          color: $color-text-l
          margin-right: 5px
        .hot-detail
          color: $color-text-l
          font-size: $font-size-small-s
          margin-top: 5px
  .search-item
    padding: 15px 16px 15px 0
    margin-left: 16px
    font-size: $font-size-medium
    border-bottom: 0.5px solid $color-background-l
    i
      color: $color-text-l
      margin-right: 5px
</style>
