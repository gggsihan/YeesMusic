<template>
  <div id="app">
    <m-header></m-header>
    <keep-alive exclude="search,playlist-detail">
      <router-view></router-view>
    </keep-alive>
    <player></player>
    <tab></tab>
  </div>
</template>
<script>
import MHeader from '@/components/m-header/header'
import Tab from '@/components/tab/tab'
import Player from '@/components/player/player'

export default {
  components: {
    MHeader,
    Tab,
    Player
  }
}
</script>

<style scoped lang="stylus">
</style>
