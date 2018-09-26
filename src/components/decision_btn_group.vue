<template>
  <block>
    <block v-if="!isHost">
      <div class="btn-group">
        <block v-if="!participated && avaliable">
          <button class="negative-circle" size="mini" type="plain" @click.stop="makeDecision(0)">
            NO
          </button>
          <button class="primary-circle init-btn" size="mini" type="plain" @click.stop="makeDecision(1)">
            YES
          </button>
        </block>
        <block v-else>
          <button class="default-circle" size="mini" type="plain" @click.stop="backHome">
            回到首页
          </button>
          <button class="primary-circle init-btn" size="mini" type="plain" @click.stop="toPage('create')">
            发起决定
          </button>
        </block>
      </div>
    </block>
    <block v-else>
      <div class="btn-group">
        <block v-if="avaliable">
          <button class="negative-circle share-as-img" :class='isHost ? "host" : ""' size="mini" type="plain" @click.stop="eventDraw">
            {{ text.sec_btn }}
            <!-- <img src="http://ojrbqzf6q.qnssl.com/FkHu6hhbaxBMwWiiaIum6hzYftVZ.svg" alt="friend"> -->
          </button>
          <button class="primary-circle init-btn share-to-friends" :class='isHost ? "host" : ""' size="mini" type="plain" open-type="share">
            {{ text.main_btn }}
          </button>
        </block>
        <block v-else>
          <button class="default-circle back-home" size="mini" type="plain" @click.stop="backHome">
            回到首页
          </button>
          <button class="primary-circle init-btn create-decision" size="mini" type="plain" @click.stop="toPage('create')">
            新的决定
          </button>
        </block>
      </div>
      <div class="about" v-if="isShowBackHome">
        <button class="small-circle about" size="mini" type="plain" @click.stop='backHome'>
          <img src="http://ojrbqzf6q.qnssl.com/FqGbqhhUaasUtiHzzVnGctH4BZaD.svg" alt="home">
        </button>
      </div>
    </block>
  </block>
</template>
<script>
  export default {
    props: ['isHost', 'isShowBackHome', 'participated', 'avaliable'],
    methods: {
      makeDecision (index) {
        this.$store.commit('setScreenSaverClock')
        this.$emit('makeDecision', index)
      },
      eventDraw () {
        this.$store.commit('setScreenSaverClock')
        this.$emit('distShareImg')
      },
      showModal (type) {
        this.$store.commit('setGlobalModal', {show: true, type: {name: type}})
      },
      backHome () {
        wx.reLaunch({url: '/pages/index/main'})
      },
      toPage (route) {
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