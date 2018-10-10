<template>
  <div class="wrapper">
    <div class="inner">
      <div class="author-avatar">
        <img class="avatar" :src="detail.creator_avatar" alt="avatar">
      </div>
      <p class="nickname ellipsis">
        {{ detail.creator_name }}
      </p>
      <p class="content" :class='avaliable ? "" : "disable"'>
        {{ detail.question }}
      </p>
      <div class="time" v-if="detail.add_time">
        <span class="text">
          于
        </span>
        <span class="create-time">
          {{ createTime }}
        </span>
        <span class="text">
          发起
        </span>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: ['detail', 'createTime', 'stateImg', 'avaliable']
  }
</script>
<style lang="scss" scoped>
.wrapper{
  border-radius: 4px;
  font-family: 'fuck';
  .inner{
    position: relative;
    padding: 10px;
    .author-avatar{
      text-align: center;
      .avatar{
        width: 50px;
        height: 50px;
        border-radius: 50%;
        box-sizing: border-box;
        border: 3px solid #fff
      }
    }
    .nickname{
      font-size: 10px;
      margin-top: 5px;
      font-weight: bold;
      opacity: 0.2;    
    }
    .content{
      width: 100%;
      font-size: 18px;
      font-family: 'fuck';
      white-space: pre-wrap;
      text-align: center;
      margin: 10px 0;
      &.disable{
        text-decoration: line-through;
        color: #9b9b9b;
      }
    }
    .time{
      text-align: center;
      font-size: 10px;
      opacity: 0.2;
      .text{
        margin: 0 3px;
      }
    }
  }

}
</style>
