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
            <div class="dist-item" v-for="item in recDistList" :key="item.id">
              <img @load="loadImg()" :src="item.picUrl" alt />
              <p>{{item.name}}</p>
            </div>
          </div>
        </div>
      </div>
    </scroll>
  </div>
</template>

<script>
import Scroll from '@/components/base/scroll/scroll'
import Slider from '@/components/base/slider/slider'
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
    Scroll
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
    showMoreRec () {}
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable';

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
      display: flex
      flex-wrap: wrap
      margin: 16px
      justify-content: space-between
      .dist-item
        width: 30%
        color: $color-text
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
