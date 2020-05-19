<template>
  <div class="dist">
    <div class="dist-item">
      <img v-lazy="imgUrl" alt />
    </div>
    <p>{{desc}}</p>
  </div>
</template>

<script>

export default {
  components: {},
  props: {
    distList: {
      type: Array,
      default: () => { return [] }
    },
    imgUrl: {
      type: String
    },
    desc: {
      type: String
    }
  }
}
</script>
<style lang='stylus' scoped>
@import '~common/stylus/variable';
.dist
  width: 30%
  margin-top: 20px
  .dist-item
    padding-bottom: 100%
    color: $color-text
    height: 0
    img
      width: 100%
      border-radius: 6px
  p
    display: -webkit-box
    -webkit-box-orient: vertical
    -webkit-line-clamp: 2
    overflow: hidden
    margin: 5px 0 10px 0
    width: 100%
    font-size: $font-size-small

</style>
