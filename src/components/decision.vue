<template>
  <scroll-view scroll-y class="decision detail" @scroll="delayScreenSaver">
    <section class="content-zone">
      <decisioncontent :detail="detail" :createTime="createTime" :stateImg="stateImg" :avaliable="avaliable" v-if="createTime">
      </decisioncontent>
      <result :decisionDetail="detail" v-if="showResult">
      </result>
    </section>
    <div class="hint" v-if="showHint && !wholeNumber && isHost">
      <block>
        <p v-if="!wholeNumber && isHost">
          {{ text.main_content }}
        </p>
        <block v-if="1===3">
          <p v-if="!isHost && !participated">
            点击下方按钮，帮我做决定       
          </p>
          <p v-if="!isHost && participated">
            已参与此决定
          </p>
        </block>
      </block>
    </div>
  </scroll-view>
</template>
<script>
  import decisioncontent from '@/components/decision_content'
  import result from '@/components/decision_result'
  import endImg from '@/images/decisionend.svg'
  import avaliableImg from '@/images/decisionavaliable.svg'
  export default {
    data () {
      return {
        endImg,
        avaliableImg
      }
    },
    props: ['detail', 'isHost', 'participated'],
    computed: {
      avaliable () {
        return this.detail.state !== 0
      },
      stateImg () {
        return this.avaliable ? this.avaliableImg : this.endImg
      },
      createTime () {
        return this.detail && this.detail.add_time && this.detail.add_time.replace('T', ' ')
      },
      positiveResult () {
        return (this.detail.yes) || []
      },
      negativeResult () {
        return (this.detail.no) || []
      },
      wholeNumber () {
        return this.positiveResult.length + this.negativeResult.length
      },
      showResult () {
        return this.isHost || this.participated
      },
      showHint () {
        return (!this.isHost || (!this.wholeNumber && this.isHost)) && this.avaliable
      },
      text () {
        return this.$store.state.text
      }
    },
    components: {
      decisioncontent,
      result
    },
    methods: {
      delayScreenSaver () {
        this.$store.commit('setScreenSaverClock')
      }
    }
  }
</script>
<style lang="scss" scoped>
@import '../css/global.scss';
@keyframes timeout{
  0% {
    transform: rotate(0);
  }
  25% {
    transform: rotate(-20deg);    
  }
  50% {
    transform: rotate(0);    
  }
  75% {
    transform: rotate(20deg);    
  }
  100% {
    transform: rotate(0);    
  }
}
.detail{
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .content-zone{
    width: 100%;
    .author{
      display: flex;
      align-items: center;
      justify-content: space-between;
      .launch-info{
        display: flex;
        justify-content: flex-start;
        width: calc(100% - 60px);
        padding-right: 5px;
        box-sizing: border-box;
        .avatar{
          width: 40px;
          height: 40px;
          border-radius: 50%;
          box-sizing: border-box;
          border: 3px solid #fff;
        }
        .info{
          flex: 1;
          text-align: left;
          font-family: 'fuck';
          margin-left: 10px;
          .nickname{
            font-size: 18px;
          }
          .time{
            font-size: 12px;
            color: #9b9b9b;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
        }
      }
      .state{
        font-size: 0;
        width: 60px;
        img{
          width: 60px;
          height: 22px;
        }
      }
    }
    .content{
      width: 100%;
      margin-top: 20px;
      font-size: 15px;
      font-family: 'fuck';
      white-space: pre-wrap;
      text-align: left;
      &.disable{
        text-decoration: line-through;
        color: #9b9b9b;
      }
    }
    .timeout{
      background-color: darken(#423f3f, 2%);
      padding: 10px;
      text-align: center;
      font-family: 'zcool-gdh';
      margin-top: 10px;
      .header{
        display: flex;
        align-items: center;
      }
      img{
        width: 19px;
        height: 18px;
        // animation: timeout .12s 5;
        margin-right: 4px;
      }
      .title{
        margin-top: 10px;
        margin-bottom: 6px;
        font-size: 18px;
      }
      .warning-content{
        font-size: 15px;
        line-height: 1.5;
        text-align: left;
      }
    }
  }
  .hint{
    padding-top: 10px;
    position: relative;
    font-size: 14px;
    opacity: 0.2;
    &::after{
      content: "";
      position: absolute;
      width: 90%;
      height: 1px;
      left: 10%;
      top: 0;
      background-color: #9b9b9b;
      // opacity: 0.2;
      transform: scaleY(0.5);
    }
  }
}
</style>
