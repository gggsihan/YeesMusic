<template>
  <transition name="slide">
    <music-list :bgImg="singerData.picUrl"
      :title="singerData.name" :desc="singerData.briefDesc" :songs="hotSongs"></music-list>
  </transition>
</template>

<script>
import MusicList from '@/components/music-list/music-list'
import singerApi from 'api/singer'
export default {
  data () {
    return {
      id: '',
      singerData: {},
      hotSongs: []
    }
  },
  created () {
    this.id = this.$route.params.id
    this.getSingerSongs()
  },
  methods: {
    getSingerSongs () {
      singerApi.getSingerSongs(this.id).then((data) => {
        this.singerData = data.artist
        this.hotSongs = data.hotSongs
      })
    }
  },
  components: {
    MusicList
  }
}
</script>

<style lang="stylus" scoped>
.slide-enter-active, .slide-leave-active
  transition all 0.3s
.slide-enter, .slide-leave-to
  transform translate3d(100%, 0, 0)
</style>
