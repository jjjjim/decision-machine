<template>
  <section class="machine-template result">
    <!-- <section class="light">
      <img :src="lightImg" alt="light">
    </section> -->
    <section class="machine">
      <section class="introduce show-machine-aniamtion">
        <p>
          决定决定机
        </p>
        <p>
          MAKE YOUR DECISION
        </p>
      </section>
      <img :src="machine" alt="machine" class="show-machine-aniamtion">
      <section class="top-bar">
        <slot name="top">
        </slot>
      </section>
      <block v-if="isShowModal">
        <section class="screen">
          <div class="error-msg" v-if="isShowErrorMsgModal">
            <p class="unhappy">
              :(
            </p>
            <p class="title">
              这真是让人尴尬
            </p>
            <p class="content">
              {{ errorMsg }}
            </p>
          </div>
          <div class="loading" v-if="isShowLoadingModal">
            <section>
              <img :src="loadingImg" alt="loading">
              <p>
                {{ loadingText }}
              </p>
            </section>
          </div>
        </section>
        <section class="operate">
          <button class="primary" @click.stop="closeModal">
            <span>
              我知道了
            </span>
          </button>
        </section>
      </block>
      <block v-else>
        <section class="screen">
          
        </section>
        <section class="operate">
          <section class="btn-group">
            <button class="primary create" size="mini" type="plain" @click.stop="backHome">
              回到首页
            </button>
          </section>
        </section>
        <section class="know-more">
          <img src="http://ojrbqzf6q.qnssl.com/FsGQYzutvFtRiwgyiqdhKnRzMBe-.svg" alt="know-more">
        </section>
      </block>
    </section>
  </section>
</template>
<script>
  import machine from '@/images/machine.svg'
  import loadingImg from '@/images/loading.svg'
  export default {
    data () {
      return {
        machine,
        gettingOpenid: false,
        isSavingInfo: false,
        loadingImg,
        decisionDetail: {}
      }
    },
    mounted () {
      this.id = this.$root.$mp.query.id
      this.getDetail()
    },
    computed: {
      user () {
        return this.$store.state.user
      },
      openid () {
        return this.$store.state.openid
      },
      isShowModal () {
        return this.$store.state.globalModalConfig.show
      },
      isShowErrorMsgModal () {
        return this.$store.state.globalModalConfig.type.name === 'errorMsg'
      },
      errorMsg () {
        if (this.isShowErrorMsgModal) {
          return this.$store.state.globalModalConfig.type.content
        }
      },
      isShowLoadingModal () {
        return this.$store.state.globalModalConfig.type.name === 'loading'
      },
      loadingText () {
        if (this.isShowLoadingModal) {
          return this.$store.state.globalModalConfig.type.content
        }
      },
      isHost () {
        return this.$store.state.userid === this.decisionDetail.creator_id
      },
      positiveResult () {
        return (this.decisionDetail.yes) || []
      },
      negativeResult () {
        return (this.decisionDetail.no) || []
      },
      wholeNumber () {
        return this.positiveResult.length + this.negativeResult.length
      },
      negativeRate () {
        let rate = 0
        const negativeLength = this.negativeResult.length
        const positiveLength = this.positiveResult.length
        if (negativeLength) {
          if (positiveLength) {
            rate = negativeLength / (negativeLength + positiveLength)
          } else {
            rate = 1
          }
        } else {
          if (positiveLength) {
            rate = 0
          } else {
            rate = 0.5
          }
        }
        return `transform: scaleX(${rate})`
      }
    },
    methods: {
      getDetail () {
        const config = {
          open_id: this.openid,
          q_id: this.id
        }
        this.$store.commit('setGlobalModal', {show: true, type: {name: 'loading', content: 'loading data...'}})
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
      closeModal () {
        this.$store.commit('setGlobalModal')
      },
      backHome () {
        wx.reLaunch({url: '../index/main'})
      }
    }
  }
</script>
<style lang="scss" scoped>
@import '../../css/decision_result.scss';
@keyframes btn {
  0% {
    opacity: 0;
    transform: scaleY(0.1);
  }
  100% {
    opacity: 1;
    transform: scaleY(1);
  }
}
@keyframes machine{
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes loading {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
.machine-template{
  height: 100vh;
  display: flex;
  flex-direction: columm;
  justify-content: space-between;
  flex-wrap: wrap;
}
.light{
  width: 100%;
  text-align: center;
  img{
    width: 207px;
    height: 178px;
  }
}
.machine{
  width: 100%;
  position: relative;
  text-align: center;
  font-size: 0;
  margin: 0 auto;
  align-self: flex-end;
  img{
    width: 321px;
    height: 491px;
    z-index: 2;
    position: relative;
  }
  .introduce{
    position: absolute;
    left: 0;
    top: 6px;
    width: 100%;
    text-align: center;
    color: #fff;
    font-size: 14px;
    z-index: 999;
    p:first-child{
      font-size: 30px;
    }
    p:last-child{
      font-size: 11px;
      letter-spacing: 0;
      margin-top: -5px;
      opacity: 0.46;
    }
  }
  .top-bar{
    position: absolute;
    width: 300px;
    left: 50%;
    text-align: center;
    bottom: calc(100% + 20px);
    transform: translateX(-50%);
  }
  .screen{
    position: absolute;
    left: 50%;
    top: 90px;
    width: 170px;
    height: 200px;
    transform: translateX(-50%);
    border-radius: 5px;
    color: #fff;
    z-index: 3;
    .error-msg{
      text-align: left;
      padding: 10px;
      .unhappy{
        font-size: 30px;
        margin-bottom: 10px;
      }
      .title{
        font-size: 20px;
        padding-bottom: 8px;
        position: relative;
        &::after{
          content: "";
          position: absolute;
          height: 1px;
          width: 100%;
          left: 0;
          bottom: 0;
          background-color: #7C818F;
          transform: scaleY(0.5);
        }
      }
      .content{
        margin-top: 8px;
        font-size: 13px;
        opacity: 0.7;
        line-height: 1.7;
      }
    }
    .loading{
      padding-top: 50px;
      & > section{
        img{
          width: 23px;
          height: 23px;
          animation: loading 1.2s linear infinite;
        }
        p{
          margin-top: 15px;
          font-size: 12px;
        }
      }
    }
    .how-to-use{
      text-align: left;
      & > p{
        font-size: 13px;
        margin-bottom: 20px;
      }
      & > ul{
        li{
          font-size: 12px;
          span{
            display: inline-block;
            width: 7px;
            height: 7px;
            border-radius: 50%;
          }
          &:first-child{
            margin-bottom: 5px;
            span{
              background: $negative;
            }
          }
          &:nth-child(2){
            span{
              background: $primary;
            }
          }
        }
      }
    }
    .timeout{
      text-align: center;
      img{
        width: 51px;
        height: 41px;
      }
      .title{
        margin-top: 15px;
        margin-bottom: 10px;
        font-size: 15px;
      }
      .content{
        font-size: 13px;
      }
    }
  }
  .operate{
    position: absolute;
    left: 0;
    top: 351px;
    width: 100%;
    text-align: center;
    z-index: 3;
    button{
      animation: btn .2s;
    }
  }
  .know-more{
    position: absolute;
    left: 0px;
    top: 351px;
    z-index: 0;
    img{
      width: 55px;
      height: 55px;
    }
  }
}
.result{
  .btn-group{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 30px;
    &.host{
      button{
        img{
          margin-top: 8px;
        }
        &.negative-circle{
          img{
            width: 26px;
            height: 16px;
          }
        }
        &.primary-circle{
          img{
            width: 20px;
            height: 16px;
          }
        }
        &:active{
          img{
            margin-top: 18px;
          }
        }
      }
    }
  }
}
</style>
