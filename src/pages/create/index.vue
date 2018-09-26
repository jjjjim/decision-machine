<template>
  <div class="container">
    <machine>
      <div slot="screen">
        <div class="create">
          <section>
            <textarea focus @input="delayScreenSaver" v-model.trim="decisionContent" placeholder="我今晚要不要喝醉？" placeholder-style="color: #7b8190;font-size: 15px;" maxlength="80" auto-height></textarea>
          </section>
        </div>
      </div>
      <div slot="operate">
        <button class="primary init-btn" size="mini" type="plain" @click.stop="toLaunchDecision">
          确认发起
        </button>
      </div>
    </machine>
  </div>
</template>

<script>
import machine from '@/components/machine'
export default {
  mounted () {
    this.loopCancelSaver()
  },
  data () {
    return {
      wether: '',
      decisionContent: '',
      clocks: [],
      loopClock: null
    }
  },
  components: {
    machine
  },
  computed: {
    openid () {
      return this.$store.state.openid
    },
    user () {
      return this.$store.state.user
    }
  },
  onUnload () {
    for (let key of this.clocks) {
      clearInterval(key)
    }
    this.clocks = []
    this.loopClock = null
  },
  methods: {
    bindViewTap () {
      const url = '../logs/main'
      wx.navigateTo({ url })
    },
    toLaunchDecision () {
      if (!this.user) {
        wx.reLaunch({url: '../login/main'})
        return
      }
      if (!this.decisionContent) {
        this.$store.commit('setGlobalModal', {show: true, type: {name: 'errorMsg', content: '你还没有输入决定内容'}})
        return
      }
      // const reminded = wx.getStorageSync('createreminded')
      const reminded = true
      if (reminded) {
        this.launchDecision()
      } else {
        wx.showModal({
          title: '发起的决定会在24小时后失效',
          content: '快让小伙伴来给你答案吧！',
          showCancel: false,
          confirmText: '我知道了',
          success: res => {
            if (res.confirm) {
              wx.setStorageSync('createreminded', 1)
              this.launchDecision()
            }
          }
        })
      }
    },
    launchDecision () {
      const question = this.decisionContent
      this.$store.commit('setGlobalModal', {show: true, type: {name: 'loading', content: '正在发起协议...'}})
      this.$http.post('create_choice', {open_id: this.openid, question}).then(
        res => {
          //
          const id = res.data && res.data.id
          if (id) {
            this.$store.commit('setGlobalModal')
            this.toDetailPage(id)
          } else {
            this.$store.commit('setGlobalModal', {show: true, type: {name: 'errorMsg', content: '创建失败，请再试一次'}})
          }
        },
        error => {
          if (error) {
            this.$store.commit('setGlobalModal', {show: true, type: {name: 'errorMsg', content: '创建失败，请再试一次(2)'}})
          }
        }
      )
    },
    toDetailPage (id) {
      wx.navigateTo({
        url: `../decision/main?id=${id}`
      })
    },
    loopCancelSaver () {
      this.loopClock = setInterval(() => {
        this.delayScreenSaver()
      }, 2000)
      this.clocks.push(this.loopClock)
    },
    delayScreenSaver () {
      this.$store.commit('setScreenSaverClock')
    }
  }
}
</script>

<style lang="scss" scoped>
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
  .create{
    text-align: left;
    .weather{
      margin: 5px 0;
    }
    textarea{
      width: 100%;
      font-size: 15px;
      min-height: 50px;
      font-family: 'zcool-gdh2';
    }
  }
}
.init-btn{
  transform: scaleY(0);
  animation: btn .3s forwards;
}
</style>
