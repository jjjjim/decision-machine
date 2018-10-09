<template>
  <section class="is-public">
    <section class="wrapper">
      <form @submit="setPublic" report-submit>
        <button formType="submit">
          <section class="icon-container">
            <!-- <img src="http://ojrbqzf6q.qnssl.com/FgvuDxEFM2Irh0P4KCTdKy6JMH7_.svgz" alt="ispublic" v-if="isPublic"> -->
            <span class="icon-lock-alt" v-if="isPublic" >
            </span>
            <span class="icon-lock-open-alt" v-else></span>
          </section>
          <section class="text">
            <p class="title">
              {{ isPublic ?  "已开启匿名" : "已取消匿名" }}
            </p>
            <p class="more-hint">
              {{ isPublic ? "以匿名身份发起此决定" :  "可以公开我的头像和昵称" }}
            </p>
          </section>
        </button>
      </form>
    </section>
  </section>
</template>
<script>
  export default {
    props: ['isPublic'],
    methods: {
      setPublic (e) {
        this.$emit('switchIsPublic', e)
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
    font-family: 'fuck';
    form, button{
      width: 100%;
    }
    button{
      display: flex;
      align-items: center;
    }
    .icon-container{
      width: 30px;
      text-align: left;
      height: 30px;
      line-height: 30px;
      text-align: center;
      border-radius: 3px;
      box-sizing: border-box;
      margin-right: 14px;
      img{
        width: 16px;
        height: 16px;
        vertical-align: -6px;
      }
    }
    .text{
      flex: 1;
      text-align: left;
      line-height: 1.6;
      .title{
        font-size: 15px;
      }
      .more-hint{
        font-size: 12px;
        opacity: .6;
        font-family: 'fuck';
      }
    }
  }
}
</style>
