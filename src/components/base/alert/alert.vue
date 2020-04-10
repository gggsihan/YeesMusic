<template>
  <transition name="alert-fade">
    <div class="alert" v-show="showFlag" @click.stop>
      <div class="alert-box">
        <span>{{alertCont}}</span>
      </div>
    </div>
  </transition>
</template>

<script>

export default {
  props: {
    alertCont: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      showFlag: false
    }
  },
  methods: {
    show () {
      this.showFlag = true
      setTimeout(() => {
        this.showFlag = false
      }, 1000)
    }
  }
}
</script>
<style lang='stylus' scoped>
@import "~common/stylus/variable"
.alert
  position: fixed
  top: 0
  bottom: 0
  left: 0
  right: 0
  background: $color-background-d
  z-index: 999
  display: flex
  justify-content: center
  align-items: center
  &.alert-fade-enter-active
    animation: alert-fadein 0.3s
  &.alert-fade-leave-active
    animation: alert-fadeout 0.3s
  .alert-box
    padding: 24px 16px
    background: $color-background
    border-radius: 20px
    color: $color-theme

@keyframes alert-fadein
  0%
    opacity: 0
  100%
    opacity: 1
@keyframes alert-fadeout
  0%
    opacity: 1
  100%
    opacity: 0

</style>
