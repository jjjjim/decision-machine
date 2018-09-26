<script>
export default {
  created () {
    this.getUserInfo()
    this.getText()
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
    }
  }
}
</script>

<style lang="scss">
@import './css/font.scss';
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
