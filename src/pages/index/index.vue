<template>
  <div class="container" :class='isFresh ? "fresh" : "old"'>
    <machine v-if="decisionLength">
      <div slot="screen">
        <decisionitems :items="decisionList">
        </decisionitems>
      </div>
      <div slot="operate">
        <button class="primary no-margin" size="mini" type="plain"  @click.stop="onInit">
          新的决定
        </button>
        <div class="about">
          <button class="small-circle about contact" size="mini" type="plain" open-type="contact">
            <img src="http://ojrbqzf6q.qnssl.com/Fiw0hfRnmwC0rczg03FlcG_Ws-h3.svgz" alt="home">
          </button>
        </div>
      </div>
    </machine>
    <machine v-else>
      <div slot="screen">
        <ul class="welcome-introduce">
          <li>
            <p>
              我今天晚上要不要去吃夜宵？
            </p>
          </li>
          <li>
            <p>
              我该不该买那台价值不菲的电脑？
            </p>
          </li>
          <li>
            <p>
              我要不要鼓起勇气跟TA表白？
            </p>
          </li>
          <li>
            <p class="more">
              ……
            </p>
          </li>
          <li>
            <p>
              求助好友，帮你下定决心，作出决定。
            </p>
          </li>
          <li>
            <p>
              这，就是我存在的意义。
            </p>
          </li>
        </ul>
        <shake>
        </shake>
      </div>
      <div slot="operate">
        <button class="primary init-btn" size="mini" type="plain"  @click.stop="onInit">
          发起决定
        </button>
      </div>
    </machine>
  </div>
</template>
<script>
import machine from '@/components/machine'
import decisionitems from '@/components/decision_items'
import hostresult from '@/components/host_result'
import shake from '@/components/shake'
export default {
  data () {
    return {
      machine,
      decisionList: [],
      isFresh: false,
      currentIndex: 0
    }
  },
  mounted () {
    this.isFresh = !wx.getStorageSync('openid')
    this.setNavigationBar()
    // this.getUserInfo()
    this.getDecisionList()
    this.$store.commit('setInIndex', true)
    this.intiGetRandomDecision()
  },
  onShow () {
    this.$store.commit('setInIndex', true)
    this.getDecisionList()
  },
  onHide () {
    // wx.stopAccelerometer()
    this.$store.commit('setInIndex', false)
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '一台帮你作决定的神秘机器。',
      path: `/pages/index/main`
    }
  },
  components: {
    machine,
    decisionitems,
    hostresult,
    shake
  },
  computed: {
    isShowDecisionList () {
      return this.decisionList.length
    },
    openid () {
      return this.$store.state.openid
    },
    user () {
      return this.$store.state.user
    },
    logined () {
      return this.openid && this.user
    },
    currentDecision () {
      return this.decisionList[this.currentIndex] || {}
    },
    realCurrentDecision () {
      return Object.assign(this.currentDecision, {creator_avatar: (this.user && this.user.avatarUrl) || ''})
    },
    decisionLength () {
      return this.decisionList.length
    }
  },
  methods: {
    setNavigationBar () {
      if (this.isFresh) {
        wx.setNavigationBarColor({
          frontColor: '#000000',
          backgroundColor: '#ffffff'
        })
        setTimeout(() => {
          wx.setNavigationBarColor({
            frontColor: '#000000',
            backgroundColor: '#ffffff',
            animation: {
              duration: 1900,
              timingFunc: 'easeIn'
            }
          })
        }, 8000)
      }
    },
    onInit () {
      if (this.logined) {
        const url = '../create/main'
        wx.navigateTo({ url })
      } else {
        wx.reLaunch({url: '../login/main'})
      }
    },
    getUserInfo () {
      // 调用登录接口
      wx.login({
        success: () => {
          wx.getUserInfo({
            success: (res) => {
              this.userInfo = res.userInfo
            }
          })
        }
      })
    },
    getDecisionList () {
      if (this.openid) {
        this.$store.commit('setGlobalModal', {show: true, type: {name: 'loading', content: '获取已创建的决定...'}})
        this.$http.post('question_list', {open_id: this.openid}).then(
          res => {
            const data = res.data && res.data.result
            this.$store.commit('setGlobalModal')
            if (Array.isArray(data)) {
              this.decisionList = data
            } else {
              this.$store.commit('setGlobalModal', {show: true, type: {name: 'errorMsg', content: '获取列表出错'}})
            }
          }
        )
      }
    },
    intiGetRandomDecision () {
      wx.onAccelerometerChange(e => {
        const inIndex = this.$store.state.inIndex
        if (!inIndex || this.isBusy) {
          return
        }
        if (e.x > 1 && e.y > 1) {
          this.isBusy = true
          this.$store.commit('setGlobalModal', {show: true, type: {name: 'random'}})
          this.$http.post('get_public', {open_id: this.openid}).then(
            res => {
              const randomDecision = res.data && res.data.result
              this.$store.commit('setGlobalModal')
              if (randomDecision.id && randomDecision.state === 1) {
                wx.redirectTo({url: `/pages/decision/main?id=${randomDecision.id}&shake=1`})
              } else {
                this.$store.commit('setGlobalModal', {show: true, type: {name: 'errorMsg', content: '获取到的决定已失效，请再试一次吧。'}})
              }
            },
            error => {
              if (error) {
                this.$store.commit('setGlobalModal', {show: true, type: {name: 'errorMsg', content: '获取到的决定已失效，请再试一次吧。'}})
              }
            }
          ).then(
            () => {
              this.isBusy = false
            }
          )
        }
      })
    }
  }
}
</script>

<style lang="scss">
@keyframes breath{
  0% {
    opacity: 0;
    color: #4a4a4a;
    transform: scaleY(0);
  }
  100% {
    opacity: 1;
    color: #ffffff;
    transform: scaleY(1);
  }
}
@keyframes machine{
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes back {
  0% {
    background-color: #ffffff;
  }
  100% {
    background-color: #ffffff;
  }
}
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
.container{
  height: 100vh;
  &.old{
    background-color: #ffffff;    
  }
  &.fresh{
    background-color: #ffffff;
    animation: back 2s ease-in forwards;
    animation-delay: 8s;
    .show-machine-aniamtion{
      // opacity: 0;
      // animation: machine 2s forwards;
      animation-delay: 8s;
    }
    .welcome-introduce{
      li{
        opacity: 0;
        animation: breath .8s forwards;
      }
    }
    .init-btn{
      animation-delay: 10s;
    }
  }
}
.machine{
  .welcome-introduce{
    font-size: 16px;
    text-align: left;
    font-family: 'fuck';
    li{
      line-height: normal;
      transform-origin: center;
      &:not(:last-child){
        margin-bottom: 10px;
      }
      .more{
        text-align: center;
      }
      &:first-child{
        animation-delay: 1.4s;
      }
      &:nth-child(2){
        animation-delay: 2.8s;
      }
      &:nth-child(3){
        animation-delay: 4.2s;
      }
      &:nth-child(4){
        animation-delay: 5.6s;
      }
      &:nth-child(5){
        animation-delay: 7s;
      }
      &:nth-child(6){
        animation-delay: 8.4s;
      }
    }
  }
}
.init-btn{
  transform: scaleY(0);
  animation: btn .3s forwards;
}
.contact{
  opacity: 0.5;
}
</style>
