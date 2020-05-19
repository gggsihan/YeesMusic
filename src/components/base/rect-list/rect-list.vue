<template>
  <div class="rect">
    <div class="rect-img">
      <img v-lazy="imgUrl" alt="">
    </div>
    <div class="list-cont">
      <p v-for="(track, index) in tracks" :key="index">
        {{index + 1 + '.'}}
        <span>{{track.first}}</span>-
        <span>{{track.second}}</span>
      </p>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    imgUrl: {
      type: String
    },
    tracks: {
      type: Array
    },
    updateTime: {
      type: String
    }
  }
}
</script>
<style lang='stylus' scoped>
@import '~common/stylus/variable'
.rect
  display: flex
  align-items: center
  height: 120px
  .rect-img
    width: 30%
    margin-right: 16px
    img
      width: 100%
      border-radius: 6px
  .list-cont
    flex: 1
    font-size: $font-size-small
    p
      margin-bottom: 10px
</style>
