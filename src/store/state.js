export default {
  user: null,
  loading: false,
  openid: wx.getStorageSync('openid'),
  userid: wx.getStorageSync('userid'),
  randomNum: 0,
  screenSaverClock: null,
  inIndex: false, // 在首页页面
  inDecision: false, // 在决定页面，只有这两个页面可以摇一摇切换决定
  globalModalConfig: {
    show: false,
    type: {
      name: 'errMsg',
      content: '不知道'
    }
  },
  text: {
    poster: ['http://ojrbqzf6q.qnssl.com/FoVSaBVoph86VQI4mU48MldcunJr.png'],
    main_content: '善良的地球人会给你想要的答案',
    main_btn: '发送给好友',
    sec_btn: '发到朋友圈'
  },
  currentRandomId: -1
}
