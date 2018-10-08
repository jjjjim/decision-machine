<template>
  <div>
    <div class="author">
      <div class="launch-info">
        <img class="avatar" :src="detail.creator_avatar" alt="avatar">
        <div class="info ellipsis">
          <p class="nickname ellipsis">
            {{ detail.creator_name }}
          </p>
          <div class="time" v-if="detail.add_time">
            <span>
              {{ createTime }}
            </span>
          </div>
        </div>
      </div>
      <div class="state">
        <img :src="stateImg" alt="state">
      </div>
    </div>
    <p class="content" :class='avaliable ? "" : "disable"'>
      {{ detail.question }}
    </p>
  </div>
</template>
<script>
  export default {
    props: ['detail', 'createTime', 'stateImg', 'avaliable']
  }
</script>
<style lang="scss" scoped>
.author{
  display: flex;
  align-items: center;
  justify-content: space-between;
  .launch-info{
    display: flex;
    justify-content: flex-start;
    width: calc(100% - 60px);
    padding-right: 5px;
    box-sizing: border-box;
    .avatar{
      width: 40px;
      height: 40px;
      border-radius: 50%;
      box-sizing: border-box;
      border: 3px solid #fff;
    }
    .info{
      flex: 1;
      text-align: left;
      font-family: 'fuck';
      margin-left: 10px;
      .nickname{
        font-size: 18px;
      }
      .time{
        font-size: 12px;
        color: #9b9b9b;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
  }
  .state{
    font-size: 0;
    width: 60px;
    img{
      width: 60px;
      height: 22px;
    }
  }
}
.content{
  width: 100%;
  margin-top: 20px;
  font-size: 15px;
  font-family: 'fuck';
  white-space: pre-wrap;
  text-align: left;
  &.disable{
    text-decoration: line-through;
    color: #9b9b9b;
  }
}
</style>
