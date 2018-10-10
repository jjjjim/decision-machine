<template>
  <block>
    <block v-if="!isHost">
      <div class="btn-group">
        <block v-if="!participated && avaliable">
          <form @submit="makeDecision($event, 0)" report-submit>
            <button formType="submit" class="negative-circle" size="mini" type="plain">
              NO
            </button>
          </form>
          <form @submit="makeDecision($event, 1)" report-submit>
            <button formType="submit" class="primary-circle init-btn" size="mini" type="plain" @click.stop="makeDecision(1)">
              YES
            </button>
          </form>          
        </block>
        <block v-else>
          <form @submit="backHome" report-submit>
            <button formType="submit" class="default-circle" size="mini" type="plain">
              回到首页
            </button>
          </form>       
          <form @submit="toPage($event, 'create')" report-submit>
            <button formType="submit" class="primary-circle init-btn" size="mini" type="plain">
              我也要发
            </button>
          </form>          
        </block>
      </div>
    </block>
    <block v-else>
      <div class="btn-group">
        <block v-if="avaliable">
          <form @submit="eventDraw" report-submit>
            <button formType="submit" class="negative-circle share-as-img" :class='isHost ? "host" : ""' size="mini" type="plain">
              {{ text.sec_btn }}
              <!-- <img src="http://ojrbqzf6q.qnssl.com/FkHu6hhbaxBMwWiiaIum6hzYftVZ.svg" alt="friend"> -->
            </button>
          </form>
          <button class="primary-circle init-btn share-to-friends" :class='isHost ? "host" : ""' size="mini" type="plain" open-type="share">
            {{ text.main_btn }}
          </button>        
        </block>
        <block v-else>
          <form @submit="backHome" report-submit>
            <button formType="submit" class="default-circle back-home" size="mini" type="plain">
              回到首页
            </button>
          </form>
          <form @submit="toPage($event, 'create')" report-submit>
            <button formType="submit" class="primary-circle init-btn create-decision" size="mini" type="plain">
              新的决定
            </button>
          </form>
        </block>
      </div>
      <div class="about" v-if="isShowBackHome">
        <form @submit="backHome" report-submit>
          <button formType="submit" class="small-circle about" size="mini" type="plain">
            <img src="http://ojrbqzf6q.qnssl.com/FqGbqhhUaasUtiHzzVnGctH4BZaD.svg" alt="home">
          </button>
        </form>
      </div>
    </block>
  </block>
</template>
<script>
  export default {
    props: ['isHost', 'isShowBackHome', 'participated', 'avaliable'],
    methods: {
      makeDecision (e, index) {
        this.$store.commit('saveFormId', e)
        this.$store.commit('setScreenSaverClock')
        this.$emit('makeDecision', index)
      },
      eventDraw (e) {
        this.$store.commit('saveFormId', e)
        this.$store.commit('setScreenSaverClock')
        this.$emit('distShareImg')
      },
      backHome (e) {
        this.$store.commit('saveFormId', e)
        wx.reLaunch({url: '/pages/index/main'})
      },
      toPage (e, route) {
        this.$store.commit('saveFormId', e)
        wx.navigateTo({url: `/pages/${route}/main`})
      }
    },
    computed: {
      text () {
        return this.$store.state.text
      }
    }
  }
</script>
<style lang="scss" scoped>
.btn-group{
  display: flex;
  align-items: center;
  justify-content: space-between;
  .how-to-use{
    display: inline-block;
    position: absolute;
    font-size: 12px;
    top: 20px;
    color: #fff;
    left: 50%;
    transform: translateX(-50%);
    width: 65px;
    height: 17px;
    line-height: 20px;
    text-align: center;
    background-image: url(http://ojrbqzf6q.qnssl.com/Fi0AGlJkLYVL5DTI-9ttPWNHnamS.svg);
  }
  button{
    &.host{
      img{
        width: 22px;
        height: 16px;
        margin-top: 11px;
      }
      &:active{
        img{
          margin-top: 18px;
        }
      }
    }
  }
}
.about{
  button{
    opacity: .5;
  }
}
</style>