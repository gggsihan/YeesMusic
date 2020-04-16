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
        <div class="middle"
          @touchstart="middleTouchStart"
          @touchmove="middleTouchMove"
          @touchend="middleTouchEnd"
        >
          <div class="middle-l" ref="middelL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="playCd">
                <img class="image" :src="albumImgUrl" alt="">
              </div>
            </div>
          </div>
          <scroll class="middle-r" ref="lyricList" :data="lyric && lyric.lines">
            <div class="lyric-wrapper">
              <div v-if="lyric">
                <p class="text" :class="{'current': currentLineNum === index}"
                  ref="lyricLine" v-for="(line, index) in lyric.lines" :key="index">{{line.txt}}</p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active':currentShow==='cd'}"></span>
            <span class="dot" :class="{'active':currentShow==='lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{formatTime(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
            </div>
            <span class="time time-r">{{formatTime(songTime)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" @click="changeMode">
              <i :class="iconMode"></i>
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
          <progress-circle :radius="64" :percent="percent">
            <img :class="playCd" :src="albumImgUrl">
          </progress-circle>
        </div>
      </div>
    </transition>
    <audio ref="audio" :src="musicUrl" @canplay="ready" @error="onError"
      @timeupdate="updateTime" @ended="end">
    </audio>
    <alert alertCont="未获取到音乐播放地址" ref="alert"></alert>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import animations from 'create-keyframe-animation'
import { prefixStyle } from 'common/js/dom'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/util'
import Lyric from 'common/js/lyric-parse'
import songApi from 'api/song'
import Alert from '@/components/base/alert/alert'
import ProgressBar from '@/components/base/progress-bar/progress-bar'
import ProgressCircle from '@/components/base/progress-circle/progress-circle'
import Scroll from '@/components/base/scroll/scroll'

const transform = prefixStyle('transform')
const transitionDuration = prefixStyle('transitionDuration')

export default {
  data () {
    return {
      musicUrl: '',
      albumImgUrl: '',
      authorName: '',
      songTime: '',
      songReady: false,
      currentTime: 0,
      lyric: null,
      currentLineNum: 0,
      currentShow: 'cd'
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
    percent () {
      return this.currentTime / this.songTime
    },
    iconMode () {
      return this.mode === playMode.sequence ? 'icon-sequence'
        : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    ...mapGetters([
      'playing',
      'fullScreen',
      'playlist',
      'currentSong',
      'currentIndex',
      'mode',
      'sequenceList'
    ])
  },
  watch: {
    currentSong (song, oldSong) {
      if (song.id === oldSong.id) return
      this._initSongMsg(song)
      this.musicUrl = ''
      this._getCurrSongUrl(song.id)
      if (this.lyric) {
        this.lyric.stop()
      }
      this._getSongLyric(song.id)
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
  created () {
    this.touch = {}
  },
  methods: {
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlaying: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_MODE',
      setPlayList: 'SET_PLAYINGLIST'
    }),

    /* 获取歌曲播放链接 */
    _getCurrSongUrl (id) {
      songApi.getSongUrl(id).then(data => {
        this.musicUrl = data.data[0].url
        this.$nextTick(() => {
          // 当获取url为空时，暂停播放
          this.musicUrl ? this.$refs.audio.play() : (() => {
            this.setPlaying(false)
            this.$refs.alert.show()
          })()
        })
      })
    },
    /* 获取歌词 */
    _getSongLyric (id) {
      songApi.getSongLyric(id).then(data => {
        this.lyric = new Lyric(data.lrc.lyric, this.handleLyric)
        if (this.playing) {
          this.lyric.play()
        }
      }).catch(() => {
        this.lyric = null
        this.currentLineNum = 0
      })
    },
    /* 初始化歌曲信息 */
    _initSongMsg (song) {
      this.albumImgUrl = song.al.picUrl
      const name = []
      song.ar.forEach(ar => {
        name.push(ar.name)
      })
      this.authorName = name.join('/')
      this.songTime = song.dt / 1000
    },

    /* 处理歌词滚动 */
    handleLyric ({ lineNum, txt }) {
      this.currentLineNum = lineNum
      if (lineNum > 5) {
        let lineEl = this.$refs.lyricLine[lineNum - 5]
        this.$refs.lyricList.scrollToElement(lineEl, 1000)
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 1000)
      }
    },

    /* 切换全屏/mini */
    back () {
      this.setFullScreen(false)
    },
    open () {
      this.setFullScreen(true)
    },

    /* 切换全屏动画 */
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
    /* 获取初始位置和缩放 */
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

    /* 歌曲操作 暂停/播放/前进/后退 */
    togglePlay () {
      if (!this.songReady || !this.musicUrl) return
      this.setPlaying(!this.playing)
      if (this.lyric) {
        this.lyric.togglePlay()
      }
    },
    prev () {
      if (!this.songReady) return
      if (this.playlist.length === 1) {
        this.loop()
      } else {
        let index = this.currentIndex - 1
        if (index === -1) {
          index = this.playlist.length - 1
        }
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.togglePlay()
        }
      }
      this.songReady = false
    },
    next () {
      if (!this.songReady) return
      if (this.playlist.length === 1) {
        this.loop()
      } else {
        let index = this.currentIndex + 1
        if (index === this.playlist.length) {
          index = 0
        }
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.togglePlay()
        }
      }
      this.songReady = false
    },

    /* 播放器操作方法 */
    ready () {
      this.songReady = true
    },
    onError () {
      this.songReady = true
    },
    end () {
      if (this.mode === playMode.loop) {
        this.loop()
      } else {
        this.next()
      }
    },
    updateTime (e) {
      this.currentTime = e.target.currentTime
    },

    /* 循环播放操作 */
    loop () {
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
      if (this.lyric) {
        this.lyric.seek(0)
      }
    },

    /* 辅助函数--将毫秒转化成分秒 */
    formatTime (interval) {
      interval = interval | 0
      const minute = interval / 60 | 0
      const second = interval % 60
      return `${minute}:${second < 10 ? '0' + second : second}`
    },

    /* 进度条变化回调 */
    onProgressBarChange (percent) {
      const currentTime = this.songTime * percent
      this.$refs.audio.currentTime = currentTime
      if (!this.playing) this.togglePlay()
      if (this.lyric) {
        this.lyric.seek(currentTime * 1000)
      }
    },

    /* 切换播放模式 */
    changeMode () {
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
      let list = null
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      this.setPlayList(list)
      this.resetCurrentIndex(list)
    },
    /* 切换模式后重置当前播放index */
    resetCurrentIndex (list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },

    /* 切换cd页和歌词页操作 */
    middleTouchStart (e) {
      this.touch.initiated = true
      const touches = e.touches[0]
      this.touch.startX = touches.pageX
      this.touch.startY = touches.pageY
    },
    middleTouchMove (e) {
      if (!this.touch.initiated) return
      const touches = e.touches[0]
      const deltaX = touches.pageX - this.touch.startX
      const deltaY = touches.pageY - this.touch.startY
      if (Math.abs(deltaY) > Math.abs(deltaX)) return
      const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
      const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
      this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
      this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
      this.$refs.lyricList.$el.style[transitionDuration] = 0
      this.$refs.middelL.style.opacity = 1 - this.touch.percent
      this.$refs.middelL.style[transitionDuration] = 0
    },
    middleTouchEnd () {
      this.touch.initialed = false
      let offsetWidth
      let opacity
      if (this.currentShow === 'cd') {
        if (this.touch.percent > 0.1) {
          offsetWidth = -window.innerWidth
          opacity = 0
          this.currentShow = 'lyric'
        } else {
          offsetWidth = 0
          opacity = 1
        }
      } else {
        if (this.touch.percent < 0.9) {
          offsetWidth = 0
          this.currentShow = 'cd'
          opacity = 1
        } else {
          offsetWidth = -window.innerWidth
          opacity = 0
        }
      }
      const time = 300
      this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
      this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`
      this.$refs.middelL.style.opacity = opacity
      this.$refs.middelL.style[transitionDuration] = `${time}ms`
    }
  },
  components: {
    Alert,
    ProgressBar,
    ProgressCircle,
    Scroll
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
      .middle-r
        display: inline-block
        vertical-align: top
        width: 100%
        height: 100%
        overflow: hidden
        .lyric-wrapper
          width: 80%
          margin: 0 auto
          overflow: hidden
          text-align: center
          .text
            line-height: 32px
            color: $color-text-l
            font-size: $font-size-medium
            &.current
              color: $color-text
    .bottom
      position: absolute
      bottom: 50px
      width: 100%
      .dot-wrapper
        text-align: center
        font-size: 0
        .dot
          display: inline-block
          vertical-align: middle
          margin: 0 4px
          width: 8px
          height: 8px
          border-radius: 50%
          background: $color-text-l
          &.active
            width: 20px
            border-radius: 5px
            background: $color-text-ll
      .progress-wrapper
        display: flex
        align-items: center
        width: 80%
        margin: 0px auto
        padding: 10px 0
        .time
          color: $color-text
          font-size: $font-size-small
          flex: 0 0 30px
          line-height: 30px
          width: 30px
          &.time-l
            text-align: left
          &.time-r
            text-align: right
        .progress-bar-wrapper
          flex: 1
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
      img
        position: absolute
        left: 4px
        top: 4px
        height: 56px
        width: 56px
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
