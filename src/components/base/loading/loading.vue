<template>
  <div class="loading-cont">
    <div class="loading">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
</template>

<script>

export default {
}
</script>
<style lang='stylus' scoped>
@import '~common/stylus/variable'
.loading-cont
  position: absolute
  width: 100%
  top: 50%
  transform: translateY(-50%)
  display: flex
  justify-content: center
  .loading
    position: relative
    width: 53px
    span
      display:block
      bottom:0px
      width: 9px
      height: 5px
      background: $color-background
      position:absolute
      animation: loading 1.5s  infinite ease-in-out
    span:nth-child(2)
      left: 11px
      animation-delay: .2s
    span:nth-child(3)
      left: 22px
      animation-delay: .4s
    span:nth-child(4)
      left: 33px
      animation-delay: .6s
    span:nth-child(5)
      left: 44px
      animation-delay: .8s
  @keyframes loading
    0%
      height:5px
      transform:translateY(0px)
      background:$color-theme
    25%
      height:30px
      transform:translateY(15px)
      background:$color-theme
    50%
      height:5px
      transform:translateY(0px)
      background:$color-theme
    100%
      height:5px
      transform:translateY(0px)
      background:$color-theme

</style>
