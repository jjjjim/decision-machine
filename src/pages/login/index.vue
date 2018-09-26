<template>
  <div class="container login">
    <machine>
      <div slot="screen">
        <div class="index-login">
          <section class="fingerprint-wrapper">
            <img src="../../images/fingerprintwhite.svg" alt="fingerprint">
          </section>
          <p class="margin">
            这是一台极其贵重的设备，在使用之前，我们需要获取你的身份信息以进行安全校验。
          </p>
          <p>
            要完成这项操作，请点击下方的蓝色按钮，然后点击弹出框中的“允许”。
          </p>
        </div>
      </div>
      <div slot="operate">
        <button class="primary" open-type="getUserInfo" @getuserinfo="bindGetUserInfo" :disabled="gettingOpenid" :loading="gettingOpenid" v-if="!gettingOpenid">
          <span v-if="gettingOpenid">
            登录中...
          </span>
          <span v-else>
            {{ denyAuthorize ? "再试一次" : "给予授权"}}
          </span>
        </button>
      </div>
    </machine>
  </div>
</template>

<script>
import machine from '@/components/machine'
/* eslint-disable-next-line */
const regeneratorRuntime = require('../../../static/regenerator-runtime/runtime.js')
export default {
  data () {
    return {
      canUseBtnLogin: wx.canIUse('button.open-type.getUserInfo'),
      isShowIndexLoginModal: true,
      gettingOpenid: false,
      isSavingInfo: false
    }
  },
  mounted () {
    this.init()
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
    },
    logined () {
      return this.user && this.openid
    }
  },
  methods: {
    async init () {
      if (this.logined || this.gettingOpenid) {
        if (this.logined) {
          wx.reLaunch({url: '/pages/index/main'})
        }
        return
      }
      this.gettingOpenid = true
      try {
        const jscode = await this.getJscode()
        /* eslint-disable-next-line */
        const openid = await this.getOpenId(jscode)
        this.gettingOpenid = false
        this.getUserInfo()
      } catch (error) {
        this.gettingOpenid = false
        this.showErrMsg(error.message)
      }
    },
    getJscode () {
      return new Promise((resolve, reject) => {
        const config = {
          show: true,
          type: {
            name: 'loading',
            content: 'getting code...'
          }
        }
        this.$store.commit('setGlobalModal', config)
        wx.login({
          timeout: 5000,
          success: res => {
            this.$store.commit('setGlobalModal')
            if (res.code) {
              resolve(res.code)
            } else {
              reject(new Error('没有获取到jscode。'))
            }
          },
          fail: error => {
            if (error) {
              this.$store.commit('setGlobalModal')
              reject(new Error('获取jscode出错。'))
            }
          }
        })
      })
    },
    getOpenId (code) {
      this.$store.commit('setGlobalModal', {show: true, type: {name: 'loading', content: '获取 openid...'}})
      return new Promise((resolve, reject) => {
        const config = {
          jscode: code
        }
        this.$http.post(`get_choice_openid`, config).then(
          res => {
            const data = res.data
            if (res.data) {
              wx.setStorageSync('unionid', data.unionid)
              const openid = data.openid
              if (openid.length > 10) {
                this.$store.commit('setOpenid', openid)
                wx.setStorageSync('openid', openid)
                resolve(openid)
                this.$store.commit('setGlobalModal')
              } else {
                reject(new Error('error: invalid openid'))
              }
            } else {
              reject(new Error('error: get openid'))
            }
          },
          /* eslint-disable-next-line */
          error => {
            reject(new Error('fail: get openid'))
          }
        )
      })
    },
    getUserInfo () {
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: res => {
                this.$store.commit('setUserInfo', res.userInfo)
                this.saveInfo()
              },
              fail: err => {
                if (err) {
                  this.showErrMsg('获取用户信息出错，请重试。')
                }
              }
            })
          } else {
            this.authorizeLogin()
          }
        },
        fail: err => {
          if (err) {
            this.showErrMsg('获取授权列表失败，请重试。')
          }
        }
      })
    },
    authorizeLogin () {
      if (!this.canUseBtnLogin) {
        wx.getUserInfo({
          success: res => {
            this.$store.commit('setUserInfo', res.userInfo)
            this.saveInfo()
          },
          fail: err => {
            if (err) {
              this.showErrMsg('获取授权信息失败，请重试。')
            }
          }
        })
      }
    },
    bindGetUserInfo (e) {
      const userInfo = e.target.userInfo
      if (userInfo) {
        if (!this.openid) {
          this.init()
        }
        this.denyAuthorize = false
        this.$store.commit('setUserInfo', userInfo)
        this.saveInfo()
      } else {
        // errorToast('你拒绝了授权，将无法正常使用小协议')
        this.denyAuthorize = true
        this.showErrMsg('你拒绝了身份校验，因此将无权使用这台贵重的设备。莫非是手滑了？不妨再试一次。')
      }
    },
    saveInfo () {
      /* eslint-disable */
      const user = this.user
      const config = {
        open_id: this.openid,
        // uid: wx.getStorageSync('unionid'),
        name: user.nickName,
        avatar: user.avatarUrl,
        sex: user.gender,
        country: user.country,
        province: user.province,
        city: user.city
      }
      if (config.open_id && config.name && config.avatar && !this.isSavingInfo) {
        this.isSavingInfo = true
        this.$store.commit('setGlobalModal', {show: true, type: {name: 'loading', content: '写入数据中...'}})
        this.$http.post(`choice_user`, config).then(
          res => {
            const data = res.data
            this.$store.commit('setGlobalModal')
            if (data.id) {
              wx.setStorageSync('userid', data.id)
              this.$store.commit('setUserId', data.id)
              this.enterApp()
            } else {
              this.showErrMsg('请重新授权，再试一次。')
            }
          },
          /* eslint-disable-next-line */
          error => {
            this.$store.commit('setGlobalModal')
            setTimeout(() => {
              this.showErrMsg('录入信息出错，请再试一次。')
            }, 300)
          }
        ).then(
          () => {
            this.isSavingInfo = false
          }
        )
      } else {
        if (!config.openid) {
          this.showErrMsg('没有获取到你的身份ID，请再试一次。')
        } else if (!config.name) {
          this.showErrMsg('没有检索到你的姓名，请再试一次。')
        } else {
          this.showErrMsg('获取到的信息不完整，请再试一次。')
        }
      }
    },
    showErrMsg (n) {
      this.denyAuthorize = true
      const config = {
        show: true,
        type: {
          name: 'errorMsg',
          content: n
        }
      }
      this.$store.commit('setGlobalModal', config)
    },
    enterApp () {
      const query = this.$root.$mp.query
      let url = query.id ? `../decision/main?id=${query.id}` : `../index/main`
      wx.reLaunch({url})
    }
  }
}
</script>

<style lang="scss" scoped>
@keyframes fingerprint {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(52px);
  }
  100% {
    transform: translateY(0);
  }
}
.login{
  .index-login{
    padding-top: 5px;
    .fingerprint-wrapper{
      position: relative;
      width: 64px;
      margin: 0 auto;
      img{
        width: 64px;
        height: 64px;
      }
      &::after{
        content: "";
        position: absolute;
        width: 80%;
        height: 4px;
        background-color: #fff;
        border-radius: 3px;
        left: 10%;
        top: 5px;
        animation: fingerprint 4s infinite;
      }
    }
    p{
      text-align: left;
      font-size: 15px;
      line-height: 20px;
      &.margin{
        margin-top: 10px;
        margin-bottom: 5px;
      }
    }
  }
}

</style>
