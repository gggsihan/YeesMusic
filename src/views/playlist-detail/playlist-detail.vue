<template>
  <transition name="slide">
    <music-list :bgImg="listData.coverImgUrl"
      :title="'歌单'" :desc="listData.name" :songs="songList"></music-list>
  </transition>
</template>

<script>
import MusicList from '@/components/music-list/music-list'
import playlistApi from 'api/playlist'

export default {
  name: 'playlist-detail',
  components: {
    MusicList
  },
  data () {
    return {
      id: '',
      listData: {},
      songList: []
    }
  },
  created () {
    this.id = this.$route.params.id
    this.getPlaylistDetail()
  },
  methods: {
    getPlaylistDetail () {
      playlistApi.getPlaylistDetail(this.id).then(data => {
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
