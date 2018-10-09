<template>
  <scroll-view scroll-y class="decion-items" @scroll="delayScreenSaver">
    <div class="pulldown-refresh tips" :animation="tipAnimation" v-if="isRealShowPrompt">
      <form @submit="switchShowPrompt" report-submit>
        <button formType="submit">
          <section class="header">
            <span class="prompt">
              提示：
            </span>
            <span class="iconfont icon-times-circle"></span>
          </section>
          <section class="item">
            <span class="index">
              1.
            </span>
            <span class="content">
              摇一摇，看看别人在纠结什么决定
            </span>
          </section>
          <section class="item">
            <span class="index">
              2.
            </span>
            <span class="content">
              按住“决定决定机”的右侧边框下拉刷新
            </span>
          </section>
        </button>
      </form>
    </div>
    <ul>
      <li v-for="(item, index) in items" :key="index">
        <item :detail="item">
        </item>
      </li>
    </ul>
  </scroll-view>
</template>
<script>
  import item from '@/components/decision_item'
  export default {
    data () {
      return {
        tipAnimation: {},
        isShowPrompt: false,
        isRealShowPrompt: false
      }
    },

    created () {
      setTimeout(() => {
        this.switchShowPrompt()
      }, 1200)
    },
    props: ['items'],
    components: {
      item
    },
    methods: {
      delayScreenSaver () {
        this.$store.commit('setScreenSaverClock')
      },
      closePrompt () {
      },
      switchShowPrompt (e) {
        const animationTime = 300
        if (e) {
          this.$store.commit('saveFormId', e)
        }
        if (!wx.getStorageSync('closedindexprompt')) {
          this.isShowPrompt = !this.isShowPrompt
          const isShowPrompt = this.isShowPrompt
          let animation = wx.createAnimation({
            duration: animationTime,
            timingFunction: 'ease'
          })
          if (isShowPrompt) {
            this.isRealShowPrompt = true
            animation.translateY(0).opacity(1).step()
          } else {
            animation.translateY(-30).opacity(0).step()
            setTimeout(() => {
              this.isRealShowPrompt = false
              wx.setStorageSync('closedindexprompt', 1)
            }, animationTime)
          }
          this.tipAnimation = animation
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .decion-items{
    height: 100%;
    .tips{
      font-family: 'fuck';
      background-color: #3d3a3a;
      margin-bottom: 10px;
      border-radius: 5px;
      box-shadow: -4px 6px 8px rgab(0, 0, 0, 0.16);
      transform: translateY(-30);
      opacity: 0;
      button{
        width: 100%;
        font-size: 11px;
        padding: 12px;
        line-height: 1.5;
      }
      .header{
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 8px;
        padding-bottom: 8px;
        position: relative;
        .prompt{
          font-weight: bold;
        }
        button{
          line-height: 1;
          span{
            font-size: 11px;
          }
        }
        &::after{
          content: "";
          position: absolute;
          width: 100%;
          left: 0;
          bottom: 0;
          height: 1px;
          background-color: #fff;
          transform: scaleY(0.5);
          opacity: 0.2;
        }
      }
      .item{
        text-align: left;
        display: flex;
        align-items: center;
        &:nth-of-type(2){
          margin-bottom: 6px;
        }
        .index{
          margin-right: 5px;
        }
      }

    }
    ul{
      li{
        &:not(:last-child){
          margin-bottom: 10px;
        }
      }
    }
  }
</style>