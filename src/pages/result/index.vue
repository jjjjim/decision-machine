<template>
  <div class="container">
    <machine>
      <div slot="screen">
        <result :decisionDetail="decisionDetail">
        </result>
      </div>
      <div slot="operate">
        <button class="primary create" size="mini" type="plain" @click.stop="backHome">
          回到首页
        </button>
      </div>
    </machine>
  </div>
</template>

<script>
import machine from '@/components/machine'
import result from '@/components/result'
export default {
  data () {
    return {
      id: -1,
      decisionDetail: {}
    }
  },
  mounted () {
    this.id = this.$root.$mp.query.id
    this.getDetail()
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '这里有一个艰难的决定等你参与',
      path: `/pages/decision/main?id=${this.id}`
    }
  },
  components: {
    machine,
    result
  },
  computed: {
    openid () {
      return this.$store.state.openid
    },
    user () {
      return this.$store.state.user
    }
  },
  methods: {
    getDetail () {
      const config = {
        open_id: this.openid,
        q_id: this.id
      }
      this.$store.commit('setGlobalModal', {show: true, type: {name: 'loading', content: '获取详情...'}})
      this.$http.post('question_detail', config).then(
        res => {
          const id = res.data && res.data.result && res.data.result.id
          if (id) {
            this.$store.commit('setGlobalModal')
            this.decisionDetail = res.data.result
          } else {
            this.$store.commit('setGlobalModal', {show: true, type: {name: 'errorMsg', content: '获取数据出错，请再试一次(5011)。'}})
          }
        },
        error => {
          if (error) {
            this.$store.commit('setGlobalModal', {show: true, type: {name: 'errorMsg', content: '获取数据出错，请再试一次(5012)。'}})
          }
        }
      )
    },
    showModal (type) {
      this.$store.commit('setGlobalModal', {show: true, type: {name: type}})
    },
    backHome () {
      wx.reLaunch({url: '../index/main'})
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
