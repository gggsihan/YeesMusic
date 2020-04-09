<template>
  <div class="player" v-show="playlist.length>0">
    <transition name="normal" @enter="enter" @after-enter="afterEnter" @leave="leave" @after-leave="afterLeave">
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="albumImgUrl">
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title">{{currentSong.name}}</h1>
          <h2 class="sub-title">{{authorName}}</h2>
        </div>
        <div class="middle">
          <div class="middle-l">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="playCd">
                <img class="image" :src="albumImgUrl" alt="">
              </div>
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="operators">
            <div class="icon i-left">
              <i class="icon-sequence"></i>
            </div>
            <div class="icon i-left" @click="prev" :class="disabledCls">
              <i class="icon-prev"></i>
            </div>
            <div class="icon i-center" @click="togglePlay" :class="disabledCls">
              <i :class="playIcon"></i>
            </div>
            <div class="icon i-right" @click="next" :class="disabledCls">
              <i class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen">
        <div class="icon" @click="open">
          <img width="40" height="40" :class="playCd" :src="albumImgUrl">
        </div>
      </div>
    </transition>
    <audio ref="audio" :src="musicUrl" @canplay="ready" @error="onError">
    </audio>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import animations from 'create-keyframe-animation'
import { prefixStyle } from 'common/js/dom'
import songApi from 'api/song'

const transform = prefixStyle('transform')

export default {
  data () {
    return {
      musicUrl: '',
      albumImgUrl: '',
      authorName: '',
      songReady: false
    }
  },
  computed: {
    playIcon () {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    playCd () {
      return this.playing ? 'play' : 'play pause'
    },
    disabledCls () {
      return this.songReady ? '' : 'disabled'
    },
    ...mapGetters([
      'playing',
      'fullScreen',
      'playlist',
      'currentSong',
      'currentIndex'
    ])
  },
  watch: {
    currentSong (song) {
      this.albumImgUrl = song.al.picUrl
      const name = []
      song.ar.forEach(ar => {
        name.push(ar.name)
      })
      this.authorName = name.join('/')
      this._getCurrSongUrl(song.id)
    },
    playing (flag) {
      const audio = this.$refs.audio
      // 在获取到url之前不对audio进行操作
      this.$nextTick(() => {
        if (this.musicUrl) {
          flag ? audio.play() : audio.pause()
        }
      })
    }
  },
  methods: {
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlaying: 'SET_PLAYING_STATE',
      setCurrentIndx: 'SET_CURRENT_INDEX'
    }),
    _getCurrSongUrl (id) {
      songApi.getSongUrl(id).then(data => {
        this.musicUrl = data.data[0].url
        this.$nextTick(() => {
          this.$refs.audio.play()
        })
      })
    },
    back () {
      this.setFullScreen(false)
    },
    open () {
      this.setFullScreen(true)
    },
    enter (el, done) {
      const { x, y, scale } = this._getPosAndScale()
      let animation = {
        0: {
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0, 0, 0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0, 0, 0) scale(1)`
        }
      }
      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 400,
          easing: 'linear'
        }
      })
      animations.runAnimation(this.$refs.cdWrapper, 'move', done)
    },
    afterEnter () {
      animations.unregisterAnimation('move')
      this.$refs.cdWrapper.style.animation = ''
    },
    leave (el, done) {
      this.$refs.cdWrapper.style.transition = 'all 0.4s'
      const { x, y, scale } = this._getPosAndScale()
      this.$refs.cdWrapper.style[transform] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
      this.$refs.cdWrapper.addEventListener('transitionend', done)
    },
    afterLeave () {
      this.$refs.cdWrapper.style.transition = ''
      this.$refs.cdWrapper.style[transform] = ''
    },
    // 获取初始位置和缩放
    _getPosAndScale () {
      const targetWidth = 64
      const paddingRight = 48
      const paddingBottom = 106
      const paddingTop = 80
      const width = window.innerWidth * 0.8
      const scale = targetWidth / width
      const x = window.innerWidth / 2 - paddingRight
      const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
      return {
        x,
        y,
        scale
      }
    },
    togglePlay () {
      this.setPlaying(!this.playing)
    },
    prev () {
      if (!this.songReady) return
      let index = this.currentIndex - 1
      if (index === -1) {
        index = this.playlist.length - 1
      }
      this.setCurrentIndx(index)
      this.musicUrl = ''
      if (!this.playing) {
        this.togglePlay()
      }
      this.songReady = false
    },
    next () {
      if (!this.songReady) return
      let index = this.currentIndex + 1
      if (index === this.playlist.length) {
        index = 0
      }
      this.setCurrentIndx(index)
      this.musicUrl = ''
      if (!this.playing) {
        this.togglePlay()
      }
      this.songReady = false
    },
    ready () {
      this.songReady = true
    },
    onError () {
      console.log('error')
      this.songReady = true
    }
  }
}
</script>
<style lang='stylus' scoped>
@import '~common/stylus/variable';

.player
  .normal-player
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    background: $color-background
    z-index: 150
    &.normal-enter-active, &.normal-leave-active
      transition: all 0.4s
      .top, .bottom
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
    &.normal-enter, &.normal-leave-to
      opacity: 0
      .top
        transform: translate3d(0, -100px, 0)
      .bottom
        transform: translate3d(0, 100px, 0)

    .background
      position: absolute
      left: 0
      top: 0
      width: 100%
      height: 100%
      z-index: -1
      opacity: 0.6
      filter: blur(20px)
    .top
      position: relative
      margin-bottom: 14px
      .back
        position: absolute
        top: 0
        left: 6px
        z-index: 50
        .icon-back
          display: block
          padding: 11px
          font-size: $font-size-large-x
          color: $color-theme
          transform: rotate(-90deg)
      .title
        width: 70%
        margin: 0 auto
        line-height: 44px
        text-align: center
        no-wrap()
        font-size: $font-size-large
        color: $color-theme
      .sub-title
        line-height: 20px
        text-align: center
        font-size: $font-size-medium
        color: $color-text
    .middle
      position: fixed
      width: 100%
      top: 80px
      bottom: 170px
      white-space: nowrap
      font-size: 0
      .middle-l
        display: inline-block
        vertical-align: top
        position: relative
        width: 100%
        height: 0
        padding-top: 80%
        .cd-wrapper
          position: absolute
          left: 10%
          top: 0
          width: 80%
          height: 100%
          .cd
            width: 100%
            height: 100%
            box-sizing: border-box
            border: 10px solid rgba(255, 255, 255, 0.1)
            border-radius: 50%
            &.play
              animation: rotate 20s linear infinite
            &.pause
              animation-play-state: paused
            .image
              position: absolute
              left: 0
              top: 0
              width: 100%
              height: 100%
              border-radius: 50%
    .bottom
      position: absolute
      bottom: 50px
      width: 100%
      .operators
        display: flex
        align-items: center
        .icon
          flex: 1
          color: $color-theme
          &.disabled
            color: $color-theme-d
          i
            font-size 30px
        .i-left
          text-align: right
        .i-center
          padding: 0 20px
          text-align: center
          i
            font-size: 40px
        .i-right
          text-align: left
        .icon-favorite
          color: $color-sub-theme
  .mini-player
    position: fixed
    right: 16px
    bottom: 74px
    width: 64px
    height: 64px
    &.mini-enter-active, &.mini-leave-active
      transition: all 0.4s
    &.mini-enter, &.mini-leave-to
      opacity: 0
    .icon
      width: 100%
      height: 100%
      border: 3px solid rgba(255, 255, 255, 0.1)
      border-radius: 50%
      box-sizing: border-box
      img
        height: 100%
        width: 100%
        border-radius: 50%
        &.play
          animation: rotate 20s linear infinite
        &.pause
          animation-play-state: paused

@keyframes rotate
  0%
    transform: rotate(0)
  100%
    transform: rotate(360deg)

</style>
