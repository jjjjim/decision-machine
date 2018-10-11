<template>
  <block>
    <block v-if="decisionList.length">
      <form @submit="onInit" report-submit>
        <button formType="submit" class="primary init-btn" size="mini" type="plain">
          新的决定
        </button>
      </form>
    </block>
    <block v-else>
      <form @submit="onInit" report-submit v-if="!hasOpenid">
        <button formType="submit" class="primary init-btn" size="mini" type="plain">
          开始使用
        </button>
      </form>
      <block v-else>
        <form @submit="onInit" report-submit v-if="isInParticipedMode">
          <button formType="submit" class="primary init-btn" size="mini" type="plain">
            发起决定
          </button>
        </form>
        <block v-else>
          <div class="btn-group">
            <form @submit="makeDecision($event, 0)" report-submit>
              <button formType="submit" class="negative-circle" size="mini" type="plain">
                NO
              </button>
            </form>
            <form @submit="makeDecision($event, 1)" report-submit>
              <button formType="submit" class="primary-circle init-btn" size="mini" type="plain">
                YES
              </button>
            </form>
          </div>
        </block>
      </block>
    </block>
    <section class="contact">
      <button open-type="contact" class="small-circle about" size="mini" type="plain">
        <img src="http://ojrbqzf6q.qnssl.com/FilRsz0_O7mEgqm4XWlTvaoj_ql_.svgz" alt="home">
      </button>
    </section>
  </block>
</template>
<script>
  export default {
    mounted () {
      this.hasOpenid = !!this.$store.state.openid
      // this.$store.commit('setGlobalModal', {show: true, type: {name: 'shakeHint', content: 'shake'}})
    },
    data () {
      return {
        hasOpenid: false
      }
    },
    props: ['decisionList', 'decisionLength', 'isInParticipedMode'],
    computed: {
      openid () {
        return this.$store.state.openid
      },
      user () {
        return this.$store.state.user
      },
      logined () {
        return this.openid && this.user
      }
    },
    methods: {
      onInit (e) {
        this.$store.commit('saveFormId', e)
        if (this.logined) {
          const url = '/pages/create/main'
          wx.navigateTo({ url })
        } else {
          wx.reLaunch({url: '/pages/login/main'})
        }
      },
      makeDecision (e, index) {
        if (index) {
          wx.navigateTo({url: '/pages/create/main'})
        } else {
          this.$store.commit('setGlobalModal', {show: true, type: {name: 'shakeHint', content: 'shake'}})
        }
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
    opacity: 0.5;
    transform: scaleY(1);
  }
}

</style>

