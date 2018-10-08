<template>
  <block>
    <block>
      <decisionitems :items="decisionList" v-if="decisionList.length">
      </decisionitems>
      <block v-else>
        <ul class="welcome-introduce" v-if="!hasOpenid">
          <li>
            <p>
              我今天晚上要不要去吃夜宵？
            </p>
          </li>
          <li>
            <p>
              我该不该买那台价值不菲的电脑？
            </p>
          </li>
          <li>
            <p>
              我要不要鼓起勇气跟TA表白？
            </p>
          </li>
          <li>
            <p class="more">
              ……
            </p>
          </li>
          <li>
            <p>
              求助好友，帮你下定决心，作出决定。
            </p>
          </li>
          <li>
            <p>
              这，就是我存在的意义。
            </p>
          </li>
        </ul>
        <div class="teach-fresh-user" v-else>
          <decisioncontent :detail="detail" :createTime="createTime" :stateImg="stateImg" :avaliable="avaliable">
          </decisioncontent>
          <div class="hint">
            <p>
              点击下方按钮，帮我做决定
            </p>
          </div>
        </div>
      </block>
    </block>
  </block>
</template>
<script>
  import decisioncontent from '@/components/decision_content'
  import decisionitems from '@/components/decision_items'
  import avaliableImg from '@/images/decisionavaliable.svg'

  export default {
    mounted () {
      const user = this.$store.state.user
      if (user) {
        this.detail.creator_name = user.nickName
        this.detail.creator_avatar = user.avatarUrl
      }
      this.hasOpenid = !!this.$store.state.openid
    },
    data () {
      return {
        hasOpenid: false,
        detail: {
          creator_name: '',
          creator_avatar: '',
          question: '要不要发起第一个决定呢？',
          add_time: '刚刚'
        },
        createTime: '刚刚',
        stateImg: avaliableImg,
        avaliable: true
      }
    },
    props: ['decisionList'],
    computed: {
      user () {
        return this.$store.state.user
      }
    },
    components: {
      decisioncontent,
      decisionitems
    }
  }
</script>

<style lang="scss" scoped>
@keyframes breath{
  0%{
    opacity: 0;
    color: #4a4a4a;
    transform: scaleY(0);
  }
  100% {
    opacity: 1;
    color: #ffffff;
    transform: scaleY(1);
  }
}
.welcome-introduce{
  font-size: 16px;
  text-align: left;
  font-family: 'fuck';
  li{
    line-height: normal;
    transform-origin: center;
    &:not(:last-child){
      margin-bottom: 10px;
    }
    .more{
      text-align: center;
    }
    &:first-child{
      animation-delay: 1.4s;
    }
    &:nth-child(2){
      animation-delay: 2.8s;
    }
    &:nth-child(3){
      animation-delay: 4.2s;
    }
    &:nth-child(4){
      animation-delay: 5.6s;
    }
    &:nth-child(5){
      animation-delay: 7s;
    }
    &:nth-child(6){
      animation-delay: 8.4s;
    }
    opacity: 0;
    animation: breath .8s forwards;
  }
}
.teach-fresh-user{
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .hint{
    width: 100%;
    padding-top: 10px;
    position: relative;
    font-size: 14px;
    margin-top: 10px;
    &::after{
      content: "";
      position: absolute;
      width: 100%;
      height: 1px;
      left: 0;
      top: 0;
      background-color: #9b9b9b;
      transform: scaleY(0.5);
    }
  }
}
</style>
