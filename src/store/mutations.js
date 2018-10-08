const Fly = require('../utils/fly.min.js')
const fly = new Fly()
fly.config.headers = {
  'content-type': 'application/json'
}
fly.config.baseURL = 'https://s.niucodata.com/api2/'
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
  },
  setInIndex (state, val) {
    state.inIndex = val
  },
  setInDecision (state, val) {
    state.inDecision = val
  },
  saveFormId (state, e) {
    const id = e.mp.detail.formId
    if (!isNaN(id)) {
      fly.post('save_formId', {open_id: state.openid, form_id: id}).then(
        res => {
        }
      )
    }
  },
  updateRandomId (state, id) {
    state.currentRandomId = id
  }
}
