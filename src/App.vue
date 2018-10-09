<script>
export default {
  data () {
    return {
      isBusy: false
    }
  },
  created () {
    this.getUserInfo()
    this.getText()
    wx.startAccelerometer({
      interval: 'ui'
    })
    this.getRandomDecision()
  },
  computed: {
    openid () {
      return this.$store.state.openid
    }
  },
  methods: {
    getUserInfo () {
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: res => {
                this.$store.commit('setUserInfo', res.userInfo)
              }
            })
          }
        }
      })
    },
    getText () {
      this.$http.get('https://s.niucodata.com/api3/hot_update').then(
        res => {
          const text = res.data && res.data.result && res.data.result[0]
          if (text.id) {
            text.poster = JSON.parse(text.poster)
            this.$store.commit('setText', text)
          }
        }
      )
    },
    getRandomDecision () {
      wx.onAccelerometerChange(e => {
        const inIndex = this.$store.state.inIndex
        const inDecision = this.$store.state.inDecision
        const isShakeAvaliable = (inIndex || inDecision) && !this.isBusy
        if (isShakeAvaliable && e.x > 1 && e.y > 1) {
          this.isBusy = true
          this.$store.commit('setGlobalModal', {show: true, type: {name: 'random'}})
          this.$http.post('get_public', {open_id: this.openid}).then(
            res => {
              const randomDecision = res.data && res.data.result
              /* eslint-disable */
              this.$store.commit('setGlobalModal')
              if (randomDecision.id && randomDecision.state === 1) {
                if (inIndex) {
                  wx.navigateTo({url: `/pages/decision/main?id=${randomDecision.id}&shake=1`})
                } else if (inDecision) {
                  this.$store.commit('updateRandomId', randomDecision.id)
                }
                // wx.redirectTo({url: `/pages/decision/main?id=${randomDecision.id}&shake=1`})
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
@import './css/font.scss';
@import './css/iconfont.scss';
@import './css/buttons.scss';
page{
  font-family: 'zcool-gdh';  
}
.container {
  height: 100%;
  box-sizing: border-box;
}
/* this rule will be remove */
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}
.ellipsis{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.btn-group{
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}
</style>
