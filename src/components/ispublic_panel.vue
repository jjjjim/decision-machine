<template>
  <section class="is-public">
    <section class="wrapper">
      <section class="icon-container" @click.stop="setPublic" :class='isPublic ? "public" : "private"'>
        <img src="http://ojrbqzf6q.qnssl.com/FgvuDxEFM2Irh0P4KCTdKy6JMH7_.svgz" alt="ispublic" v-if="isPublic">
      </section>
      <section class="text">
        <p class="title">
          是否公开此决定
        </p>
        <p class="more-hint">
          {{ isPublic ? "任何用户都可以看到并参与这个决定" : "您需要手动将此决定分享给好友" }}
        </p>
      </section>
    </section>
    <p class="public-hint" v-if="1==3">
      公开此决定意味着决定决定机的任意用户都有可能看到并参与你的决定。
    </p>
  </section>
</template>
<script>
  export default {
    props: ['isPublic'],
    methods: {
      setPublic () {
        this.$emit('switchIsPublic')
      }
    }
  }
</script>
<style lang="scss" scoped>
@import '../css/global.scss';

.is-public{
  background-color: darken(#423f3f, 2%);
  padding: 10px;
  border-radius: 4px;
  .wrapper{
    display: flex;
    align-items: center;
    font-family: 'fuck';
    .icon-container{
      width: 30px;
      height: 30px;
      text-align: center;
      border-radius: 3px;
      box-sizing: border-box;
      margin-right: 10px;
      &.public{
        background-color: $negative;
      }
      &.private{
        background-color: #aaa;
      }
      img{
        width: 16px;
        height: 16px;
        vertical-align: -6px;
      }
    }
    .text{
      .more-hint{
        font-size: 12px;
        opacity: .6;
        font-family: 'fuck';
      }
    }
  }
}
</style>
