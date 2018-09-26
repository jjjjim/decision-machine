export default {
  setUserInfo (state, val) {
    state.user = val
  },
  setLoading (state, val) {
    state.loading = val
  },
  setRandom (state) {
    state.randomNum = Math.random()
  },
  setOpenid (state, val) {
    state.openid = val
  },
  setUserId (state, val) {
    state.userid = val
  },
  setGlobalModal (state, val) {
    const config = Object.assign({show: false, type: {name: 'working', content: 'working...'}}, val)
    state.globalModalConfig = config
  },
  setScreenSaverClock (state, val = 44 * 1000) {
    if (state.screenSaverClock) {
      clearTimeout(state.screenSaverClock)
    }
    state.screenSaverClock = setTimeout(() => {
      state.globalModalConfig = {show: true, type: {name: 'screensaver'}}
    }, val)
  },
  setText (state, val) {
    state.text = val
  }
}
