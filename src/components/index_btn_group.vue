<template>
  <section class="btn-group index-btn-group">
    <primarybtn v-on:emitMethod="onInit">
    </primarybtn>
  </section>
</template>
<script>
  import primarybtn from '@/components/doraemon_btn_primary'
  import previousbtn from '@/components/previous'
  import nextbtn from '@/components/next'
  export default {
    props: ['currentIndex', 'decisionLength'],
    components: {
      previousbtn,
      primarybtn,
      nextbtn
    },
    computed: {
      openid () {
        return this.$store.state.openid
      },
      user () {
        return this.$store.state.user
      },
      logined () {
        return this.openid && this.user
      }
    },
    methods: {
      previousOne () {
        this.$emit('switch', -1)
      },
      nextOne () {
        this.$emit('switch', 1)
      },
      onInit () {
        if (this.logined) {
          const url = '../create/main'
          wx.navigateTo({ url })
        } else {
          wx.reLaunch({url: '../login/main'})
        }
      }
    }
  }
</script>
<style lang="scss">
  .btn-group{
    .disabled{
      opacity: 0;
      display: inline-block;
      width: 42px;
      height: 39px;
    }
  }
</style>

