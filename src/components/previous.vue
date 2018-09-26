<template>
  <div class="doreamon-negative-circle">
    <button class="previous-circle" size="mini" type="plain" @touchstart="touchStart" @touchend="touchEnd" @touchcancel="touchEnd" @click.stop="emitMethod">
      <slot name="btn-content">
      </slot>
    </button>
    <img class="hand" src="http://ojrbqzf6q.qnssl.com/FliltaT77wNilNKBSOuroELceJbr.svg" alt="hand" :animation="handAnimation">
  </div>
</template>
<script>
  export default {
    data () {
      return {
        showHandTime: 200,
        handAnimation: {}
      }
    },
    methods: {
      touchStart () {
        this.showHand()
      },
      showHand (e) {
        let handAnimation = wx.createAnimation({
          duration: this.showHandTime,
          transformOrigin: '50% 40%',
          timingFunction: 'ease'
        })
        handAnimation.opacity(1).translateY(0).rotate(-20).step()
        this.handAnimation = handAnimation
      },
      hideHand () {
        let handAnimation = wx.createAnimation({
          duration: this.showHandTime,
          transformOrigin: '50% 40%',
          timingFunction: 'ease'
        })
        handAnimation.rotate(0).opacity(0).translateY(63).step()
        this.handAnimation = handAnimation
      },
      touchEnd () {
        // setTimeout(() => {
        //   this.hideHand()
        // }, 100)
      },
      emitMethod () {
        this.hideHand()
        this.$emit('emitMethod')
      }
    }
  }
</script>
<style lang="scss">
  .doreamon-negative-circle{
    display: inline-block;
    position: relative;
    .previous-circle{
      width: 42px;
      height: 39px;
      line-height: 30px;
      padding: 0;
      background-image: url(http://ojrbqzf6q.qnssl.com/FvsoBADvhxBSwYGIID7nX182Dzkd.svg); 
      &:active{
        line-height: 39px;
        background-image: url(http://ojrbqzf6q.qnssl.com/Fu6UrWKkrGi4M1mgRtzWd9jj0LYx.svg); 
      } 
    }
    .hand{
      position: absolute;
      width: 84px;
      height: 143px;
      left: 40%;
      top: -20px;
      opacity: 0;
      transform-origin: center 30px;
      transform: translateY(63px);
    }
  }
</style>