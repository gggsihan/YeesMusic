<template>
  <div class="m-header">
    <div class="icon"></div>
    <h1 class="text">Yees Music</h1>
  </div>
</template>

<script>
export default {}
</script>

<style scoped lang="stylus">
@import '~common/stylus/mixin'
@import '~common/stylus/variable'

.m-header
  position: relative
  height: 44px
  text-align: center
  color: $color-theme
  .icon
    display: inline-block
    vertical-align: top
    margin-top: 6px
    width: 32px
    height: 32px
    margin-right: 9px
    background-size: 32px
    bg-image('~common/icons/header-icon')
  .text
    display: inline-block
    vertical-align: top
    line-height: 44px
    font-size: $font-size-large
</style>
