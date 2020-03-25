<template>
  <div class="tab">
    <router-link tag="div" class="tab-item" to="/recommend">
      <i class="icon-music tag-link tag-icon"></i>
      <span class="tag-link">推荐</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/rank">
      <i class="icon-playlist tag-link tag-icon"></i>
      <span class="tag-link">排行</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/singer">
      <i class="icon-sequence tag-link tag-icon"></i>
      <span class="tag-link">歌手</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/mine">
      <i class="icon-mine tag-link tag-icon"></i>
      <span class="tag-link">我的</span>
    </router-link>
  </div>
</template>

<script>
export default {}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'
.tab
  position: fixed
  bottom: 0
  left: 0
  right: 0
  display: flex
  height: 64px
  font-size: $font-size-small
  background: $color-background-l
  border-radius: 10px 10px 0 0
  .tab-item
    flex: 1
    text-align: center
    display: flex
    flex-direction: column
    justify-content: center
    algin-items: center
    .tag-icon
      font-size: $font-size-large
      padding-bottom: 5px
    .tag-link
      color: $color-text-l
    &.router-link-active
      .tag-link
        color: $color-theme
</style>
