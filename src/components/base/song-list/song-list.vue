<template>
  <div class="song-list">
    <div class="song-item" v-for="(song, index) in songList" :key="song.id" @click="selectSong(song, index)">
      <span v-if="showType === 'playlist'">{{index + 1}}</span>
      <div class="item-desc">
        <h2>{{song.name}}</h2><p v-if="song.al">{{songDetail(song)}}</p>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    songList: {
      type: Array,
      default: () => []
    },
    showType: {
      type: String,
      default: 'playlist'
    }
  },
  methods: {
    songDetail (song) {
      const artists = []
      if (song && song.ar) {
        song.ar.forEach(art => {
          artists.push(art.name)
        })
        return artists.join('/') + ' - ' + song.al.name
      }
      return ''
    },
    selectSong (song, index) {
      this.$emit('select', song, index)
    }
  },
  created () {},
  mounted () {}
}
</script>
<style lang='stylus' scoped>
@import '~common/stylus/variable'
.song-item
  height: 64px
  display: flex
  align-items: center
  padding-right: 16px
  margin-left: 16px
  color: $color-text
  font-size: $font-size-medium-x
  border-bottom: 0.5px solid $color-background-l
  span
    margin-right: 10px
  .item-desc
    flex: 1
    h2
      width: 70vw
      overflow: hidden
      white-space: nowrap
      text-overflow: ellipsis
    p
      font-size: $font-size-small
      color: $color-text-l
      margin-top: 5px
</style>
