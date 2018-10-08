<template>
  <div class="container" :class='isFresh ? "fresh" : "old"'>
    <machine>
      <div slot="screen">
        <indexcontent :decisionList="decisionList">
        </indexcontent>
      </div>
      <div slot="operate">
        <indexbtn :decisionList="decisionList">
        </indexbtn>
      </div>
    </machine>
  </div>
</template>
<script>
import machine from '@/components/machine'
import indexcontent from '@/components/index_page'
import indexbtn from '@/components/index_btn_group'
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
    this.$store.commit('setInIndex', true)
    this.getDecisionList()
  },
  onShow () {
    this.$store.commit('setInIndex', true)
    // this.getDecisionList()
  },
  onHide () {
    this.$store.commit('setInIndex', false)
  },
  onPullDownRefresh () {
    this.getDecisionList()
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
    indexcontent,
    indexbtn,
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
        ).then(
          () => {
            wx.stopPullDownRefresh()
          }
        )
      }
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
      animation-delay: 8s;
    }
    .shake-get-random-decision{
      transform: scaleY(0);
      animation: breath .8s forwards;
      animation-delay: 10s;    
    }
    .init-btn{
      animation-delay: 10s;
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
