<template>
  <div id="app">
    <m-header></m-header>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <tab></tab>
  </div>
</template>
<script>
import MHeader from '@/components/m-header/header'
import Tab from '@/components/tab/tab'

export default {
  components: {
    MHeader,
    Tab
  }
}
</script>

<style scoped lang="stylus">
</style>
