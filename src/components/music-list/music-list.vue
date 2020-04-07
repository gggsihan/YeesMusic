<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-img" ref="bgImg" :style="bgStyle">
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll @scroll="scroll" :probe-type="probeType" :listen-scroll="listenScroll" :data="songs" class="song-cont" ref="songScroll">
      <song-list :songList="songs"></song-list>
      <div class="loading-container" v-show="!songs.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script>
import Scroll from '@/components/base/scroll/scroll'
import SongList from '@/components/base/song-list/song-list'
import Loading from '@/components/base/loading/loading'
import { prefixStyle } from 'common/js/dom'

const RESERVED_HEIGHT = 44
const transform = prefixStyle('transform')
const backdrop = prefixStyle('backdrop-filter')

export default {
  props: {
    bgImg: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    desc: {
      type: String,
      default: ''
    },
    songs: {
      type: Array,
      default: () => { return [] }
    }
  },
  computed: {
    bgStyle () {
      return `background-image:url(${this.bgImg})`
    }
  },
  components: {
    Scroll,
    SongList,
    Loading
  },
  data () {
    return {
      scrollY: 0
    }
  },
  watch: {
    scrollY (newY) {
      let translateY = Math.max(this.minTransY, newY)
      let zIndex = 0
      let scale = 1
      let blur = 0
      this.$refs.layer.style[transform] = `translate3d(0,${translateY}px,0)`
      const percent = Math.abs(newY / this.imgHeight)
      if (newY > 0) {
        // 列表下拉图片放大
        scale = 1 + percent
        zIndex = 10
      } else {
        // 上划实现图片高斯模糊
        blur = Math.min(20 * percent, 20)
      }
      this.$refs.filter.style[backdrop] = `blur(${blur}px)`
      // 列表上划
      if (newY < this.minTransY) {
        zIndex = 10
        this.$refs.bgImg.style.paddingTop = 0
        this.$refs.bgImg.style.height = `${RESERVED_HEIGHT}px`
      } else {
        this.$refs.bgImg.style.paddingTop = '70%'
        this.$refs.bgImg.style.height = 0
      }
      this.$refs.bgImg.style.zIndex = zIndex
      this.$refs.bgImg.style[transform] = `scale(${scale})`
    }
  },
  created () {
    this.probeType = 3
    this.listenScroll = true
  },
  mounted () {
    this.countScrollHeight()
  },
  methods: {
    countScrollHeight () {
      this.imgHeight = this.$refs.bgImg.clientHeight
      this.minTransY = -this.imgHeight + RESERVED_HEIGHT
      this.$refs.songScroll.$el.style.top = `${this.imgHeight}px`
    },
    scroll (pos) {
      this.scrollY = pos.y
    },
    back () {
      this.$router.back()
    }
  }
}
</script>
<style lang='stylus' scoped>
@import '~common/stylus/variable'
.music-list
  position: fixed
  z-index: 100
  top: 0
  bottom: 64px
  left: 0
  right: 0
  background: $color-background
  .back
    position: absolute
    top: 0
    left: 6px
    z-index: 50
    .icon-back
      display: block
      padding: 10px
      font-size: $font-size-large-x
      color: $color-theme
  .title
    position: absolute
    top: 0
    left: 10%
    z-index: 40
    width: 80%
    no-wrap()
    text-align: center
    line-height: 44px
    font-size: $font-size-large
    color: $color-theme
  .bg-img
    position: relative
    width: 100%
    height: 0
    padding-top: 70%
    transform-origin: top
    background-size: cover
    .filter
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
      background: rgba(7,17,27,0.4)
  .bg-layer
    position: relative
    height: 100%
    background: $color-background
  .song-cont
    position: fixed
    top: 0
    bottom: 0
    left: 0
    right: 0
    background: $color-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
      display: flex
      justify-content: center
</style>
