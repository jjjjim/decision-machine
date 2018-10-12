<template>
  <scroll-view scroll-y class="decion-items" @scroll="delayScreenSaver" @scrolltolower="loadData" lower-threshold="20">
    <div class="tips" :animation="tipAnimation" v-if="!isInParticipedMode && isRealShowPrompt">
      <section class="img">
        <img src="http://ojrbqzf6q.qnssl.com/Fnc_F4k6VKAaWQFJQF6JM7Gtn3_w.svgz" class="pull-down" alt="pulldown">
      </section>
      <section class="content">
        <p>
          按住“决定决定机”的右侧边框下拉刷新
        </p>
        <form @submit="switchShowPrompt" report-submit>
          <button formType="submit">
            我知道了
          </button>
        </form>        
      </section>
    </div>
    <!-- <div class="tips shake" v-if="isInParticipedMode">
      <section class="img">
        <img src="http://ojrbqzf6q.qnssl.com/FrGl339h1KbpW5C_jmRf8KchArFX.svgz" class="shake" alt="shake">
      </section>
      <section class="shake content">
        <p class="title">
          我参与过的决定
        </p>
        <p class="value">
          摇一摇，参与别人的决定
        </p>
      </section>
    </div> -->
    <ul>
      <li v-for="(item, index) in items" :key="index">
        <item :detail="item">
        </item>
      </li>
    </ul>
    <!-- {{ noMoreData }}, {{ isIn }} -->
    <p class="no-more-data" v-if="noMoreData && isInParticipedMode">
      数据已加载完毕
    </p>
    <p class="to-my-particeiped-page-hint" v-if="!isInParticipedMode">
      左滑这里进入“我参与过的决定”页面
    </p>
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
      this.switchShowPrompt()
    },
    props: ['items', 'noMoreData', 'isInParticipedMode'],
    components: {
      item
    },
    methods: {
      delayScreenSaver () {
        this.$store.commit('setScreenSaverClock')
      },
      loadData () {
        this.$emit('loadMore')
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
  @import '../css/global.scss';
  .decion-items{
    height: 100%;
    padding: 5px;
    box-sizing: border-box;
    .tips{
      font-family: 'fuck';
      background-color: #3d3a3a;
      margin-bottom: 10px;
      border-radius: 5px;
      box-shadow: -4px 6px 8px rgab(0, 0, 0, 0.16);
      // transform: translateY(-30);
      // opacity: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      font-size: 0;
      &.shake{
        justify-content: center;
      }
      .img{
        .pull-down{
          width: 100px;
          height: 116px;
        }
        .shake{
          width: 60px;
          height: 60px;
        }
      }
      .content{
        text-align: left;
        padding: 16px 0;
        padding-left: 10px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        &.shake{
          margin-left: 10px;
        }
        p{
          margin-bottom: 10px;
          font-size: 12px;
          text-align: left;
          line-height: 1.7;
        }
        &.shake{
          .title{
            font-size: 10px;
            opacity: 0.5;
            margin-bottom: 6px;
          }
          .value{
            margin-bottom: 0;
          }
        }
        button{
          width: 80px;
          height: 24px;
          line-height: 24px;
          text-align: center;
          border-radius: 12px;
          background-color: $primary;
          padding: 0;
          color: #fff;
          font-size: 12px;
          // display: none;
        }
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
          margin-bottom: 15px;
        }
      }
    }
    .no-more-data, .to-my-particeiped-page-hint{
      margin-top: 10px;
      font-family: 'fuck';
      font-size: 10px;
      opacity: 0.5;
    }
  }
</style>