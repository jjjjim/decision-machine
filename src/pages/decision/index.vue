<template>
  <div class="container">
    <machine>
      <div slot="screen">
        <decision :detail="decisionDetail" :isHost="isHost" :participated="participated">
        </decision>
      </div>
      <div slot="operate">
        <section class="btn-group-wrapper">
          <decisionbtngroup :isHost="isHost" :isShowBackHome="isShowBackHome" :participated="participated" :avaliable="avaliable" v-on:distShareImg="eventDraw" v-on:makeDecision="makeDecision">
          </decisionbtngroup>
        </section>
      </div>
    </machine>
    <canvasdrawer :painting="painting" class="canvasdrawer" @getImage="eventGetImage"/>
  </div>
</template>

<script>
import machine from '@/components/machine'
import decision from '@/components/decision'
import shareImgTemplate from '@/images/share-img2.png'
import border from '@/images/border2.png'
import decisionbtngroup from '@/components/decision_btn_group'
/* eslint-disable-next-line */
const regeneratorRuntime = require('../../../static/regenerator-runtime/runtime.js')
export default {
  data () {
    return {
      id: -1,
      decisionDetail: {},
      painting: {},
      shareImage: '',
      shareImgTemplate,
      border,
      openid: '',
      participated: false,
      isShowBackHome: false,
      clockArray: [],
      loopDuration: 5000,
      isShowLoading: true,
      fromShake: false // 是否从摇一摇进入
    }
  },
  onLoad (options) {
    const scene = decodeURIComponent(options.scene)
    this.clockArray = []
    this.isShowLoading = true
    let id = Number(scene) > 0 ? scene : this.$root.$mp.query.id
    this.id = id
    this.isShowBackHome = this.$root.$mp.query.home
    this.fromShake = this.$root.$mp.query.shake
    this.openid = wx.getStorageSync('openid')
  },
  onPullDownRefresh () {
    this.init()
  },
  onShow () {
    this.init()
    this.loopGetDetail()
  },
  onUnload () {
    this.$store.commit('setInDecision', false)
    this.destroyLoop()
  },
  onHide () {
    this.destroyLoop()
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '可以来帮我做个决定吗？',
      path: `/pages/decision/main?id=${this.id}&home=true`
    }
  },
  components: {
    machine,
    decision,
    decisionbtngroup
  },
  computed: {
    user () {
      return this.$store.state.user
    },
    userid () {
      return this.$store.state.userid
    },
    logined () {
      return this.user && this.openid
    },
    isHost () {
      return this.$store.state.userid === this.decisionDetail.creator_id
    },
    avaliable () {
      return this.decisionDetail.state && this.decisionDetail.state !== 0
    },
    randomId () {
      const id = this.$store.state.currentRandomId
      if (id > 0) {
        this.$root.$mp.query.id = id
        this.id = id
        this.getDetail()
      }
      return id
    }
  },
  methods: {
    async init () {
      if (this.openid) {
        if (this.fromShake) {
          this.$store.commit('setInDecision', true)
        }
        this.getDetail()
        return
      }
      try {
        const jscode = await this.getJscode()
        /* eslint-disable-next-line */
        const openid = await this.getOpenId(jscode)
        this.openid = openid
        this.getDetail()
      } catch (error) {
        wx.stopPullDownRefresh()
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
    makeDecision (choice) {
      if (!this.logined) {
        wx.reLaunch({
          url: `../login/main?from=decision&id=${this.id}`
        })
        return
      }
      if (this.participated) {
        let errMsg = '你已参与过这个决定，不能再次参与。'
        this.$store.commit('setGlobalModal', {show: true, type: {name: 'errorMsg', content: errMsg}})
        return
      }
      if (this.decisionDetail.state === 0) {
        this.$store.commit('setGlobalModal', {show: true, type: {name: 'timeout'}})
        return
      }
      if (!this.decisionDetail.id) {
        return
      }
      const config = {
        open_id: this.openid,
        q_id: this.id,
        choice
      }
      this.$store.commit('setGlobalModal', {show: true, type: {name: 'loading', content: '参与决定...'}})
      this.$http.post('make_choice', config).then(
        res => {
          if (res.data && res.data.result === 'ok') {
            this.$store.commit('setGlobalModal')
            this.checkResult()
          } else {
            this.$store.commit('setGlobalModal', {show: true, type: {name: 'errorMsg', content: '常在河边走，哪有不湿鞋。设备难免会有出故障的时候，请再试一次(5021)。'}})
          }
        },
        error => {
          if (error) {
            const errInfo = error.response && error.response.data
            if (errInfo.code === 504) {
              // errMsg = '你已经参与过这个决定，不能重复参与。'
              wx.navigateTo({url: `../result/main?id=${this.id}`})
              return
            }
            let errMsg = '常在河边走，哪有不湿鞋。设备难免会有出故障的时候，请再试一次(5022)。'
            this.$store.commit('setGlobalModal', {show: true, type: {name: 'errorMsg', content: errMsg}})
          }
        }
      )
    },
    loopGetDetail () {
      this.isShowLoading = false
      const clock = setInterval(this.getDetail, this.loopDuration)
      this.clockArray.push(clock)
    },
    getDetail () {
      if (!this.openid || !this.id) {
        return
      }
      const config = {
        open_id: this.openid,
        q_id: this.id
      }
      if (this.isShowLoading) {
        this.$store.commit('setGlobalModal', {show: true, type: {name: 'loading', content: '获取详情...'}})
      }
      this.$http.post('question_detail', config).then(
        res => {
          const id = res.data && res.data.result && res.data.result.id
          if (id) {
            if (this.$store.state.globalModalConfig.type.name !== 'screensaver') {
              this.$store.commit('setGlobalModal')
            }
            this.decisionDetail = res.data.result
            this.isParticipated()
          } else {
            this.$store.commit('setGlobalModal', {show: true, type: {name: 'errorMsg', content: '获取数据出错，请再试一次(5011)。'}})
          }
        },
        error => {
          if (error) {
            this.$store.commit('setGlobalModal', {show: true, type: {name: 'errorMsg', content: '获取数据出错，请再试一次(5012)。'}})
          }
        }
      ).then(
        () => {
          wx.stopPullDownRefresh()
        }
      )
    },
    howToUse () {
      this.$store.commit('setGlobalModal', {show: true, type: {name: 'howToUse'}})
    },
    isParticipated () {
      const allMembers = this.decisionDetail.yes.concat(this.decisionDetail.no)
      this.participated = false
      for (let key of allMembers) {
        if (key && key.id === this.userid) {
          this.participated = true
        }
      }
    },
    checkResult () {
      this.participated = true
      this.getDetail()
    },
    showModal (type) {
      this.$store.commit('setGlobalModal', {show: true, type: {name: type}})
    },
    destroyLoop () {
      for (let key of this.clockArray) {
        clearInterval(key)
      }
      this.clockArray = []
      this.$store.commit('updateRandomId', -1)
    },
    eventDraw () {
      if (this.shareImage) {
        this.eventSave()
        return
      }
      this.$store.commit('setGlobalModal', {show: true, type: {name: 'loading', content: '绘制图片中...'}})
      const config = [
        {
          type: 'image',
          url: this.shareImgTemplate,
          top: 0,
          left: 0,
          width: 375,
          height: 667
        },
        {
          type: 'text',
          content: this.decisionDetail.question,
          color: '#403c39',
          top: 158,
          left: 46,
          width: 263,
          breakWord: true,
          MaxLineNumber: 3,
          fontSize: 30,
          lineHeight: 42
        },
        {
          type: 'image',
          url: `https://m.niucodata.com/pic.php?pic=${this.decisionDetail.creator_avatar}`,
          top: 60,
          left: 148,
          width: 79,
          height: 79
        },
        {
          type: 'image',
          url: `https://m.niucodata.com/pic.php?pic=http://pfdn803m2.bkt.clouddn.com/FsgArcagKVeold2BWGnT4K9yMcOH.png`,
          top: 60,
          left: 148,
          width: 80,
          height: 80
        },
        {
          type: 'image',
          url: `https://box.niucodata.com/token/jdjdj_qr/${this.id}`,
          // url: `https://m.niucodata.com/pic.php?pic=${this.user.avatarUrl}`,
          top: 298,
          left: 140,
          width: 94,
          height: 94
        }
      ]
      this.painting = {
        width: 375,
        height: 667,
        clear: true,
        views: config
      }
    },
    eventGetImage (event) {
      wx.hideLoading()
      this.shareImage = event.target.tempFilePath
      this.eventSave()
    },
    eventSave () {
      const that = this
      wx.saveImageToPhotosAlbum({
        filePath: this.shareImage,
        success (res) {
          that.$store.commit('setGlobalModal', {show: true, type: {name: 'friends', content: 'friends'}})
        },
        /* eslint-disable-next-line */
        fail (err) {
          that.$store.commit('setGlobalModal', {show: true, type: {name: 'errorMsg', content: '保存图片失败'}})
        },
        complete () {
          wx.hideLoading()
          that.shareImage = ''
          that.painting = {}
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container{
  .back-home{
    width: 175px;
    height: 48px;
  }
}
</style>
