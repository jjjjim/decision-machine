import Vue from 'vue'
import App from './App'
import store from './store'
Vue.prototype.$store = store

const Fly = require('./utils/fly.min.js')
const fly = new Fly()
fly.config.headers = {
  'content-type': 'application/json'
}
fly.config.baseURL = 'https://s.niucodata.com/api2/'
Vue.prototype.$http = fly

Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue(App)
app.$mount()
