<template>
  <div class="recommend">
    <scroll ref="scroll" class="recommend-cont" :data="recDistList">
      <div>
        <div class="slider-wrapper" v-if="sliderList.length">
          <slider>
            <div v-for="(item, i) in sliderList" :key="i">
              <a :href="item.url ? item.url : ''">
                <img @load="loadImg()" :src="item.imageUrl" />
              </a>
            </div>
          </slider>
        </div>
        <div class="dist">
          <div class="title">
            <span>推荐歌单</span>
            <span class="rec-more" @click="showMoreRec()">更多</span>
          </div>
          <div class="dist-cont">
            <tab-list
              v-for="item in recDistList" :key="item.id"
              :imgUrl="item.picUrl"
              :desc="item.name"
              @click.native="goDetail(item.id)"
            ></tab-list>
          </div>
        </div>
      </div>
    </scroll>
  </div>
</template>

<script>
import Scroll from '@/components/base/scroll/scroll'
import Slider from '@/components/base/slider/slider'
import TabList from '@/components/base/tab-list/tab-list'
import recommendApi from 'api/recommend'
export default {
  data () {
    return {
      sliderList: [], // 轮播图列表
      recDistList: [] // 推荐歌单列表
    }
  },
  components: {
    Slider,
    Scroll,
    TabList
  },
  created () {
    recommendApi.recomList().then(data => { // 获取推荐歌单列表
      this.recDistList = data.result
    })
    recommendApi.getBanner().then(data => { // 获取首页轮播列表
      this.sliderList = data.banners
    })
  },
  methods: {
    loadImg () {
      if (!this.checkLoaded) {
        this.$refs.scroll.refresh()
        this.checkLoaded = true
      }
    },
    showMoreRec () {},
    goDetail (id) {
      this.$router.push({ path: `/playlist-detail/${id}` })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'
@import '~common/stylus/mixin'

.recommend
  color: $color-theme
  position: fixed
  width: 100%
  top: 44px
  bottom: 64px
  .recommend-cont
    height: 100%
    overflow: hidden
  .dist
    .title
      height: 44px;
      padding: 0 16px;
      font-size: $font-size-medium
      border-bottom: 1px solid $color-text-d
      display: flex
      justify-content: space-between
      align-items: center
      .rec-more
        color: $color-text-l
        padding: 5px 10px
        border-radius: 10px
        display: inline-block
        font-size: $font-size-small
        background: $color-background-l
    .dist-cont
      flex-between()
      flex-wrap: wrap
      padding: 0 16px

</style>
