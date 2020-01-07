<template>
  <div class="recommend">
    <scroll ref="scroll" class="recommend-cont" :data="recDistList">
      <div>
        <div class="slider-wrapper" v-if="sliderList.length">
          <slider>
            <div v-for="(item, i) in sliderList" :key="i">
              <a :href="item.url ? item.url : ''">
                <img @load="loadImg()" :src="item.imageUrl">
              </a>
            </div>
          </slider>
        </div>
        <div class="dist">
          <div class="title">推荐歌单</div>
          <div class="dist-cont">
            <div class="dist-item" v-for="item in recDistList" :key="item.id">
              <img @load="loadImg()" :src="item.picUrl" alt="">
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
    recommendApi.recomList().then(data => {
      this.recDistList = data.result
    })
    recommendApi.getBanner().then(data => {
      this.sliderList = data.banners
    })
  },
  methods: {
    loadImg () {
      if (!this.checkLoaded) {
        this.$refs.scroll.refresh()
        this.checkLoaded = true
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable';

.recommend {
  color: $color-theme;
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  .recommend-cont {
    height: 100%;
    overflow: hidden;
  }
  .dist {
    .title {
      padding: 16px;
      border-bottom: 1px solid $color-text-d;
    }
    .dist-cont {
      display: flex;
      flex-wrap: wrap;
      margin: 16px;
      justify-content: space-between;

      .dist-item {
        width: 30%;
        color: $color-text;

        img {
          width: 100%;
          border-radius: 6px;
        }

        p {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
          margin: 5px 0 10px 0;
          width: 100%;
        }
      }
    }
  }
}
</style>
