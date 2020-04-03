<template>
  <div class="music-list" ref="musicList">
    <div class="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-img" ref="bgImg" :style="bgStyle">
      <div></div>
    </div>
    <scroll class="song-cont" ref="songScroll">
      <song-list :songList="songs"></song-list>
    </scroll>
  </div>
</template>

<script>
import Scroll from '@/components/base/scroll/scroll'
import SongList from '@/components/base/song-list/song-list'
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
    SongList
  },
  data () {
    return {
    }
  },
  created () {},
  mounted () {
    this.countScrollHeight()
  },
  methods: {
    countScrollHeight () {
      this.$refs.songScroll.$el.style.height = `${this.$refs.musicList.clientHeight - this.$refs.bgImg.clientHeight}px`
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
    line-height: 40px
    font-size: $font-size-large
    color: $color-theme
  .bg-img
    position: relative
    width: 100%
    height: 0
    padding-top: 70%
    transform-origin: top
    background-size: cover
  .song-cont
    overflow: hidden

</style>
