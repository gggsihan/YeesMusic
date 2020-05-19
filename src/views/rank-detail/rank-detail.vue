<template>
  <transition name="slide">
    <music-list :bgImg="listData.coverImgUrl"
      :title="listData.name" :desc="listData.description" :songs="songList"></music-list>
  </transition>
</template>

<script>
import rankApi from 'api/rank.js'
import MusicList from '@/components/music-list/music-list'

export default {
  components: {
    MusicList
  },
  data () {
    return {
      idx: '',
      listData: {},
      songList: []
    }
  },
  created () {
    this.idx = this.$route.params.idx
    this.getTopListSongs()
  },
  methods: {
    getTopListSongs () {
      rankApi.getTopListCont(this.idx).then(data => {
        this.listData = data.playlist
        this.songList = this.listData.tracks
      })
    }
  }
}
</script>
<style lang='stylus' scoped>
.slide-enter-active, .slide-leave-active
  transition all 0.3s
.slide-enter, .slide-leave-to
  transform translate3d(100%, 0, 0)

</style>
