<template>
  <div class="singer">
    <div class="singer-subtitle">
      <span v-for="type in category" :key="type.code" :class="{'active': cat.code===type.code}" @click="chooseCat(type)">
        {{type.name}}
      </span>
    </div>
    <scroll ref="scroll" class="singer-cont">
      <div>
        <ul class="singer-list">
          <li class="singer-item" v-for="singer in singerList" :key="singer.id" @click="selectSinger(singer)">
            <img v-lazy="singer.picUrl" alt="">
            <span>{{singer.name}}</span>
          </li>
        </ul>
      </div>
      <div v-show="loadStatus"><loading></loading></div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import Scroll from '@/components/base/scroll/scroll'
import Loading from '@/components/base/loading/loading'
import singerApi from 'api/singer'
export default {
  data () {
    return {
      category: [],
      singerList: [],
      cat: {
        type: Object,
        default: {}
      },
      loadStatus: true
    }
  },
  created () {
    this.getSingerType()
  },
  methods: {
    // 获取歌手分类
    getSingerType () {
      singerApi.getSingerType().then(data => {
        this.category = data
        this.cat = this.category[0]
        this.chooseCat(this.cat)
      })
    },
    // 获取歌手列表
    getSingerList () {
      singerApi.getSingerList(this.cat).then(data => {
        this.singerList = data.artists
        this.setLoadStatus(false)
      })
    },
    // 获取热门歌手
    getHotSinger () {
      singerApi.getHotSinger().then(data => {
        this.singerList = data.artists
        this.setLoadStatus(false)
      })
    },
    // 选择歌手种类
    chooseCat (cat) {
      this.cat = cat
      this.setLoadStatus(true)
      this.singerList = []
      if (cat.code === '000') {
        this.getHotSinger()
      } else {
        this.getSingerList()
      }
    },
    // 选择歌手
    selectSinger (singer) {
      this.$router.push({ path: `/singer/${singer.id}` })
    },
    // 设置load状态
    setLoadStatus (status) {
      this.loadStatus = status
    }
  },
  components: {
    Scroll,
    Loading
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable';

.singer
  position: fixed
  top: 44px
  bottom: 64px
  width: 100%
  display: flex
  flex-direction: column

  .singer-subtitle
    height: 44px
    white-space: nowrap
    overflow-y: auto
    display: flex
    align-items: center

    &.singer-subtitle::-webkit-scrollbar
      display: none
    span
      color: $color-text-l
      margin: 0 5px
      padding: 2px
      border: 1px solid $color-text-l
      border-radius: 5px
      display: inline-block
      &.active
        color: $color-theme
        border: 1px solid $color-theme
  .singer-cont
    height: 100%
    overflow: hidden
    .singer-item
      height: 80px
      padding: 0 16px
      display: flex
      align-items: center
      img
        width: 50px
        height: 50px
        border-radius: 100%
        margin-right: 20px
</style>
