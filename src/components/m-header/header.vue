<template>
  <div class="m-header">
    <div class="header-icon"></div>
    <h1 class="header-text">Yees Music</h1>
    <div class="header-search" @click="goSearch()"><i class="icon-search"></i></div>
  </div>
</template>

<script>
export default {
  methods: {
    goSearch () {
      this.$router.push('/search')
    }
  }
}
</script>

<style scoped lang="stylus">
@import '~common/stylus/mixin'
@import '~common/stylus/variable'

.m-header
  position: relative
  height: 44px
  text-align: center
  color: $color-theme
  .header-icon
    display: inline-block
    vertical-align: top
    margin-top: 6px
    width: 32px
    height: 32px
    margin-right: 9px
    background-size: 32px
    bg-image('~common/icons/header-icon')
  .header-text
    display: inline-block
    vertical-align: top
    line-height: 44px
    font-size: $font-size-large
  .header-search
    position: absolute
    top: 13px
    bottom: 13px
    right: 16px
    i
      font-size: $font-size-large

</style>
