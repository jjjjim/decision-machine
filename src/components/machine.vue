<template>
  <section class="machine-template">
    <!-- <section class="light">
      <img :src="lightImg" alt="light">
    </section> -->
    <section class="machine" :animation="machineAnimation" v-if="!isShowMachineBehind">
      <img :src="machine" alt="machine" class="show-machine-aniamtion device" @longpress="showBack">
      <section class="top-bar">
        <slot name="top">
        </slot>
      </section>
      <block v-if="isShowModal">
        <section class="screen">
          <div class="error-msg" v-if="isShowErrorMsgModal">
            <p class="unhappy">
              :(
            </p>
            <p class="title">
              这真是让人尴尬
            </p>
            <p class="content">
              {{ errorMsg }}
            </p>
          </div>
          <div class="loading" v-if="isShowLoadingModal">
            <section>
              <img :src="loadingImg" alt="loading">
              <p>
                {{ loadingText }}
              </p>
            </section>
          </div>
          <div class="get-random-decision" v-if="isShowGetRandomDecison">
            <section>
              <img :src="loadingImg" alt="loading">
              <p>
                正在随机获取已公开的决定...
              </p>              
            </section>
          </div>
          <div class="screen-saver" :style="wallPaper" v-if="isShowScreenSaver">
          </div>
          <div class="how-to-use" v-if="isShowHowToUseModal">
            <p>
              总有那么些艰难的决定让我们犹豫不决，心乱如麻。使用这台机器，快速征集好友的看法。
            </p>
            <ul>
              <li>
                <span>
                  
                </span>
                色按钮：不建议发起人做出这个决定。
              </li>
              <li>
                <span>
                  
                </span>
                色按钮：认可并支持发起人的这个决定。
              </li>
            </ul>
          </div>
          <div class="share-as-img" v-if="isShowFriendsModal">
            <p class="happy-face">
              :)
            </p>
            <p class="title">
              已保存到系统相册
            </p>
            <p class="value">
              快分享到朋友圈，让伙伴们来帮你作决定吧！
            </p>
          </div>
        </section>
        <section class="operate" @click.stop>
          <button class="primary" @click.stop="closeModal">
            <span>
              {{ modalCloseBtnText }}
            </span>
          </button>
        </section>
      </block>
      <block v-else>
        <section class="screen">
          <slot name="screen">
          </slot>
        </section>
        <section class="operate" @click.stop>
          <slot name="operate">

          </slot>
        </section>
      </block>
    </section>
  </section>
</template>
<script>
  import machine from '@/images/machinev2.svg'
  import fingerprintImg from '@/images/fingerprint.svg'
  import loadingImg from '@/images/loading.svg'
  import lightImg from '@/images/light.svg'

  export default {
    data () {
      return {
        machine,
        gettingOpenid: false,
        isSavingInfo: false,
        fingerprintImg,
        denyAuthorize: false,
        loadingImg,
        lightImg
      }
    },
    mounted () {
      this.showScreenSaver()
    },
    computed: {
      user () {
        return this.$store.state.user
      },
      openid () {
        return this.$store.state.openid
      },
      logined () {
        return this.user && this.openid
      },
      isShowModal () {
        return this.$store.state.globalModalConfig.show
      },
      isShowHowToUseModal () {
        return this.$store.state.globalModalConfig.type.name === 'howToUse'
      },
      isShowErrorMsgModal () {
        return this.$store.state.globalModalConfig.type.name === 'errorMsg'
      },
      isShowFriendsModal () {
        return this.$store.state.globalModalConfig.type.name === 'friends'
      },
      isShowScreenSaver () {
        return this.$store.state.globalModalConfig.type.name === 'screensaver'
      },
      isMachineWorking () {
        return this.$store.state.globalModalConfig.type.name === 'working'
      },
      isShowGetRandomDecison () {
        return this.$store.state.globalModalConfig.type.name === 'random'
      },
      errorMsg () {
        if (this.isShowErrorMsgModal) {
          return this.$store.state.globalModalConfig.type.content
        }
      },
      isShowLoadingModal () {
        return this.$store.state.globalModalConfig.type.name === 'loading'
      },
      loadingText () {
        if (this.isShowLoadingModal) {
          return this.$store.state.globalModalConfig.type.content
        }
      },
      modalCloseBtnText () {
        if (this.isShowLoadingModal) {
          return 'loading'
        } else if (this.isShowScreenSaver) {
          return '返回系统'
        } else {
          return '我知道了'
        }
      },
      screenSaver () {
        return this.$store.state.screenSaver
      },
      wallPaper () {
        const items = this.$store.state.text.poster
        const url = items[Math.floor(Math.random() * items.length)]
        return `background-image: url(${url})`
      }
    },
    methods: {
      backHome () {
        wx.reLaunch({url: '../index/main'})
      },
      closeModal () {
        if (!this.isShowLoadingModal) {
          this.$store.commit('setGlobalModal')
          this.denyAuthorize = false
        }
      },
      showBack () {
        wx.navigateTo({url: '/pages/back/main'})
      },
      showScreenSaver () {
        this.$store.commit('setScreenSaverClock')
      },
      closeScreenSaver () {
        this.$store.commit('setGlobalModal')
      }
    },
    watch: {
      isMachineWorking (n) {
        if (n) {
          this.showScreenSaver()
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
@import '../css/global.scss';
@keyframes btn {
  0% {
    opacity: 0;
    transform: scaleY(0.1);
  }
  100% {
    opacity: 1;
    transform: scaleY(1);
  }
}
@keyframes machine{
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes loading {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
.loadingicon{
  width: 23px;
  height: 23px;
  animation: loading 1.2s linear infinite;
}
.machine-template{
  height: 100vh;
  display: flex;
  flex-direction: columm;
  justify-content: space-between;
  flex-wrap: wrap;
  position: relative;
  z-index: 99;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
.light{
  width: 100%;
  text-align: center;
  img{
    width: 207px;
    height: 178px;
  }
}
.device{
  width: 329px;
  height: 580px;
  position: relative;
  z-index: 2;
}
.machine{
  width: 329px;
  position: relative;
  text-align: center;
  font-size: 0;
  margin: 0 auto;
  align-self: center;
  overflow: hidden;
  .top-bar{
    position: absolute;
    width: 300px;
    left: 50%;
    text-align: center;
    bottom: calc(100% + 20px);
    transform: translateX(-50%);
  }
  .screen{
    position: absolute;
    left: 50%;
    top: 20px;
    width: 276px;
    padding: 10px;
    box-sizing: border-box;
    height: 384px;
    transform: translateX(-50%);
    border-radius: 10px;
    color: #fff;
    border-radius: 5px;
    font-size: 15px;
    z-index: 99;
    .error-msg{
      text-align: left;
      padding: 10px;
      .unhappy{
        font-size: 30px;
        margin-bottom: 10px;
      }
      .title{
        font-size: 20px;
        padding-bottom: 8px;
        position: relative;
        &::after{
          content: "";
          position: absolute;
          height: 1px;
          width: 100%;
          left: 0;
          bottom: 0;
          background-color: #7C818F;
          transform: scaleY(0.5);
        }
      }
      .content{
        margin-top: 8px;
        font-size: 14px;
        opacity: 0.8;
        line-height: 1.7;
      }
    }
    .loading{
      padding-top: 50px;
      & > section{
        img{
          @extend .loadingicon;
        }
        p{
          margin-top: 15px;
          font-size: 15px;
        }
      }
    }
    .get-random-decision{
        padding-top: 50px;
        img{
          @extend .loadingicon;
        }
        p{
          margin-top: 20px;
          font-size: 15px;
        }
    }
    .screen-saver{
      height: 100%;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      animation: btn .5s;
    }
    .share-as-img{
      text-align: left;
      .happy-face{
        font-size: 30px;
      }
      .title{
        margin-top: 10px;
        margin-bottom: 5px;
        font-size: 18px;
        color: #fff;
      }
      .value{
        font-size: 14px;
        color: #9b9b9b;
      }
    }
    .how-to-use{
      text-align: left;
      & > p{
        font-size: 15px;
        margin-bottom: 20px;
      }
      & > ul{
        li{
          font-size: 14px;
          span{
            display: inline-block;
            width: 7px;
            height: 7px;
            border-radius: 50%;
          }
          &:first-child{
            margin-bottom: 5px;
            span{
              background: $negative;
            }
          }
          &:nth-child(2){
            span{
              background: $primary;
            }
          }
        }
      }
    }
  }
  .operate{
    position: absolute;
    left: 10%;
    top: 450px;
    width: 80%;
    text-align: center;
    z-index: 99;
    button{
      animation: btn .2s;
      display: inline-block;
    }
  }
}
</style>
