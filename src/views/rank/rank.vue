<template>
  <div class="rank">
    <scroll ref="scroll" class="rank-cont" :data="officalList">
      <div>
        <div class="title">官方榜</div>
        <div class="rect-cont">
          <rect-list
            v-for="item in officalList" :key="item.id"
            :imgUrl="item.coverImgUrl"
            :tracks="item.tracks"
            @click.native="searchIdx(item.name)"
          ></rect-list>
        </div>
        <div class="title">推荐榜</div>
        <div class="dist-cont">
          <tab-list
            v-for="item in recommendList" :key="item.id"
            :imgUrl="item.coverImgUrl"
            :desc="item.name"
            @click.native="searchIdx(item.name)"
          ></tab-list>
        </div>
        <div class="title">更多榜单</div>
        <div class="dist-cont">
          <tab-list
            v-for="item in moreList" :key="item.id"
            :imgUrl="item.coverImgUrl"
            :desc="item.name"
            @click.native="searchIdx(item.name)"
          ></tab-list>
        </div>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import rankApi from 'api/rank.js'
import Scroll from '@/components/base/scroll/scroll'
import TabList from '@/components/base/tab-list/tab-list'
import RectList from '@/components/base/rect-list/rect-list'
export default {
  data () {
    return {
      topList: [],
      officalList: [],
      recommendList: [],
      moreList: []
    }
  },
  mounted () {
    rankApi.getTopList().then(data => {
      this.topList = data
    })
    rankApi.getTopListDetail().then((data) => {
      if (data.code === 200) {
        this.officalList = data.list.slice(0, 4)
        this.recommendList = data.list.slice(4, 10)
        this.moreList = data.list.slice(10)
      }
    })
  },
  methods: {
    searchIdx (idx) {
      if (this.topList[idx]) {
        this.$router.push({ path: `/rank/${this.topList[idx]}` })
      }
    }
  },
  components: {
    Scroll,
    TabList,
    RectList
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'
@import '~common/stylus/mixin'

.rank
  color: $color-theme
  position: fixed
  width: 100%
  top: 44px
  bottom: 64px
  .rank-cont
    height: 100%
    overflow: hidden
    .title
      height: 55px
      padding: 0 16px
      font-size: $font-size-medium
      border-bottom: 1px solid $color-text-d
      line-height: 55px
      font-weight: $font-weight-bold
    .rect-cont
      padding: 0 16px
      margin-top: 10px
    .dist-cont
      padding: 0 16px
      flex-between()
      flex-wrap: wrap

</style>
