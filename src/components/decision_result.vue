<template>
  <div class="decision-result" v-if="showResult">
    <div class="teach-result-switch" v-if="1===3 && isRealShowPrompt" :animation="tipAnimation">
      <p>
        点击下方按钮切换结果或评论
      </p>
      <form @submit="switchShowPrompt" report-submit>
        <button formType="submit" class="close-btn">
          <span class="icon-times-circle close"></span>
        </button>
      </form>
    </div>
    <div class="switch-panel">
      <form @submit="switchPanel" report-submit>
        <button formType="submit" class="score" :disabled="currentMode === 'score'" :class="currentMode === 'score' ? 'selected' : ''">
          <span class="icon-flag"></span>
        </button>
      </form>
      <form @submit="switchPanel" report-submit>
        <button formType="submit" class="comments" :disabled="currentMode === 'comments'" :class="currentMode === 'comments' ? 'selected' : ''">
          <span class="icon-comment-alt-dots"></span>
        </button>
      </form>
    </div>
    <div class="result-content">
      <block v-if="currentMode === 'score'">
        <div class="state">
          <span class="text against">
            反对方
          </span>
          <div class="score">
            <span class="count">
              {{ negativeResult.length }}          
            </span>
            <img src="http://ojrbqzf6q.qnssl.com/FqGFl4pu_WB3OQTJz-1dZwisUPcX.svgz" alt="VS" class="icon">
            <span class="count">
              {{ positiveResult.length }}
            </span>
          </div>
          <span class="text support">
            赞成方
          </span>
        </div>
        <section class="bar positive">
          <section class="negative" :style="negativeRate">
          </section>
        </section>
        <ul class="members">
          <li>
            <ul class="avatars with-name" v-if="negativeResult.length <= 5">
              <li v-for="(item, index) in negativeResult" :key="index" class="ellipsis" v-if="item">
                <img class="avatar" :src="item.avatar" alt="avatar">
                <span>
                  {{ item.name }}
                </span>
              </li>
            </ul>
            <ul class="avatars no-name" v-else>
              <li v-for="(item, index) in negativeResult" :key="index" class="ellipsis" v-if="item">
                <img class="avatar" :src="item.avatar" alt="avatar">
              </li>
            </ul>
          </li>
          <li>
            <ul class="avatars with-name" v-if="positiveResult.length <= 5">
              <li v-for="(item, index) in positiveResult" :key="index" class="ellipsis" v-if="item">
                <span class="ellipsis">
                  {{ item.name }}
                </span>
                <img class="avatar" :src="item.avatar" alt="avatar">
              </li>
            </ul>
            <ul class="avatars no-name" v-else>
              <li v-for="(item, index) in positiveResult" :key="index" class="ellipsis" v-if="item">
                <img class="avatar" :src="item.avatar" alt="avatar">
              </li>
            </ul>
          </li>
        </ul>
      </block>
      <block v-else>
        <section class="new-comment">
          <input type="text" v-model.trim="commentContent" placeholder="输入评论内容" @input="delayScreenSaver">
          <form @submit="addComment" report-submit>        
            <button formType="submit" :disabled="isLoading">
              <span class="loading icon-spinner" v-if="isLoading"></span>            
              <span class="icon-paper-plane" v-else></span>
            </button>
          </form>        
        </section>
        <ul class="comments" v-if="comments.length">
          <li v-for="item in comments" :key="item.time" v-if="item">
            <section class="author">
              <img :src="item.avatar" alt="avatars" class="avatar">
              <section class="info">
                <p v-if="item.name">
                  {{ item.name }}
                </p>
                <p class="time" v-if="item.time">
                  <commenttime :time="item.time">
                  </commenttime>
                </p>
              </section>
            </section>
            <section class="content">
              {{ item.content }}
            </section>
          </li>
        </ul>
        <p class="empty" v-else>
          暂无评论
        </p>
      </block>
    </div>
  </div>
</template>
<script>
  import commenttime from '@/components/comment_time'
  export default {
    mounted () {
      // this.switchShowPrompt()
    },
    props: ['decisionDetail'],
    data () {
      return {
        currentMode: 'score',
        commentContent: '',
        isShowPrompt: false,
        isLoading: false,
        isRealShowPrompt: false,
        tipAnimation: {}
      }
    },
    components: {
      commenttime
    },
    computed: {
      positiveResult () {
        return (this.decisionDetail.yes) || []
      },
      negativeResult () {
        return (this.decisionDetail.no) || []
      },
      comments () {
        // return [
        //   {
        //     avatar: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3797481993,1929347741&fm=27&gp=0.jpg',
        //     name: '小褥子',
        //     time: '2018-10-02 09:34:21',
        //     content: '嘿嘿嘿。让我们一起摇摆。'
        //   },
        //   {
        //     avatar: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3797481993,1929347741&fm=27&gp=0.jpg',
        //     name: '小褥子',
        //     time: '2018-10-02 09:34:21',
        //     content: '嘿嘿嘿。让我们一起摇摆。'
        //   },
        //   {
        //     avatar: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3797481993,1929347741&fm=27&gp=0.jpg',
        //     name: '小褥子',
        //     time: '2018-10-02 09:34:21',
        //     content: '嘿嘿嘿。让我们一起摇摆。'
        //   }
        // ]
        return this.decisionDetail.comments
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
      },
      wholeNumber () {
        return this.positiveResult.length + this.negativeResult.length
      },
      state () {
        return this.decisionDetail.state === 1 ? '进行中' : '已完成'
      },
      showResult () {
        return this.decisionDetail.state === 0 || (this.decisionDetail.state === 1 && this.wholeNumber)
      },
      resultText () {
        const positiveLength = this.positiveResult.length
        const negativeLength = this.negativeResult.length
        if (positiveLength > negativeLength) {
          return '多数人支持'
        } else if (positiveLength < negativeLength) {
          return '多数人反对'
        } else {
          return '双方持平'
        }
      },
      user () {
        return this.$store.state.user
      },
      openid () {
        return this.$store.state.openid
      }
    },
    methods: {
      switchPanel (e) {
        this.$store.commit('saveFormId', e)
        this.delayScreenSaver()
        this.currentMode = this.currentMode === 'comments' ? 'score' : 'comments'
      },
      delayScreenSaver () {
        this.$store.commit('setScreenSaverClock')
      },
      addComment (e) {
        this.$store.commit('saveFormId', e)
        const comment = this.commentContent
        const qID = this.$root.$mp.query.id
        const openid = this.openid
        if (comment && qID && openid) {
          this.isLoading = true
          const config = {
            open_id: openid,
            q_id: qID,
            content: comment
          }
          this.$http.post('add_comment', config).then(
            res => {
              this.commentContent = ''
              this.$store.commit('updateRandomId', qID)
            },
            error => {
              if (error) {
                this.$store.commit('setGlobalModal', {show: true, type: {name: 'errorMsg', content: '评论失败'}})
              }
            }
          ).then(
            () => {
              this.isLoading = false
            }
          )
        }
      },
      switchShowPrompt (e) {
        const animationTime = 300
        if (e) {
          this.$store.commit('saveFormId', e)
        }
        if (!wx.getStorageSync('switchresultprompt')) {
          this.isShowPrompt = !this.isShowPrompt
          const isShowPrompt = this.isShowPrompt
          let animation = wx.createAnimation({
            duration: animationTime,
            timingFunction: 'ease'
          })
          if (isShowPrompt) {
            this.isRealShowPrompt = true
            animation.scale(1).opacity(1).step()
          } else {
            animation.scale(1).opacity(0).step()
            setTimeout(() => {
              this.isRealShowPrompt = false
              wx.setStorageSync('switchresultprompt', 1)
            }, animationTime)
          }
          this.tipAnimation = animation
        }
      }
    }
  }
</script>
<style lang="scss">
  @import '../css/decision_result.scss';
</style>