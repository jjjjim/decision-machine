<template>
  <div class="container" :class='isFresh ? "fresh" : "old"'>
    <machine>
      <div slot="screen">
        <!-- <indexcontent :decisionList="decisionList">
        </indexcontent> -->
        <swiper duration="400" :current="currentIndex" @change="onSwipe">
          <block>
            <swiper-item>
              <indexcontent :decisionList="decisionList">
              </indexcontent>
            </swiper-item>
            <swiper-item>
              <indexcontent :decisionList="participedDecisionList" v-on:loadMore="getParticipedDecisionList" :noMoreData="noMoreData" :isInParticipedMode="isInParticipedMode">
              </indexcontent>
            </swiper-item>
          </block>
        </swiper>
      </div>
      <div slot="operate">
        <indexbtn :decisionList="decisionList" :isInParticipedMode="isInParticipedMode">
        </indexbtn>
      </div>
    </machine>
    <div class="is-loading" v-if="isLoading">
      <loading> 
      </loading>
    </div>
  </div>
</template>
<script>
import machine from '@/components/machine'
import indexcontent from '@/components/index_page'
import indexbtn from '@/components/index_btn_group'
import loading from '@/components/loading'
export default {
  data () {
    return {
      machine,
      decisionList: [],
      participedDecisionList: [],
      isLoading: false,
      noMoreData: false,
      offset: 0,
      limit: 20,
      isFresh: false,
      currentIndex: 0
    }
  },
  mounted () {
    this.isFresh = !wx.getStorageSync('openid')
    this.setNavigationBar()
    this.$store.commit('setInIndex', true)
    this.getMyDecisionList()
    this.getParticipedDecisionList()
  },
  onShow () {
    this.$store.commit('setInIndex', true)
    // this.getMyDecisionList()
  },
  onHide () {
    this.$store.commit('setInIndex', false)
  },
  onPullDownRefresh () {
    this.noMoreData = false
    this.isLoading = false
    this.offset = 0
    this.participedDecisionList = []
    this.getMyDecisionList()
    this.getParticipedDecisionList()
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
    loading
  },
  computed: {
    isInParticipedMode () {
      return this.currentIndex === 1 // 是否在 我的参与 swiper下
    },
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
    getMyDecisionList () {
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
    },
    getParticipedDecisionList () {
      const config = {
        offset: this.offset,
        limit: this.limit,
        open_id: this.openid
      }
      if (this.isLoading || this.noMoreData || !this.openid) {
        return
      }
      if (this.offset > 0) {
        this.isLoading = true
      }
      this.$http.post('get_participated_list', config).then(
        res => {
          const list = res.data && res.data.result
          if (Array.isArray(list)) {
            this.participedDecisionList.push(...list)
            if (list.length) {
              this.offset += this.limit
            } else {
              this.noMoreData = true
            }
          }
        }
      ).then(
        () => {
          this.isLoading = false
        }
      )
    },
    onSwipe (e) {
      this.currentIndex = e.mp.detail.current
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
  swiper{
    height: 100%;
  }
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
    .contact{
      animation-delay: 10s;      
    }
  }
}
.init-btn{
  transform: scaleY(0);
  animation: btn .3s forwards;
}
.contact{
  animation: btn .3s forwards;
  opacity: 0;
}
.is-loading{
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 999;
}
</style>
