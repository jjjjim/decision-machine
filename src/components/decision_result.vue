<template>
  <div class="decision-result" v-if="showResult">
    <div class="switch-panel">
      <form @submit="switchPanel" report-submit>
        <button formType="submit">
          <img src="http://ojrbqzf6q.qnssl.com/FoEPTqDL8lb7H1JhH_Q4n7rXhD9f.svgz" alt="comment" v-if="currentMode === 'score'">
          <img src="http://ojrbqzf6q.qnssl.com/FmkQogBo9uo6FvQZ7RZ1r_zkkLig.svgz" alt="score-result" v-else>
        </button>
      </form>
    </div>
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
      <ul>
        <li v-for="item in comments" :key="item.time">
          <section class="avatar">
            <img :src="item.avatar" alt="avatars">
          </section>
        </li>
      </ul>
    </block>
  </div>
</template>
<script>
  export default {
    props: ['decisionDetail'],
    data () {
      return {
        currentMode: 'score'
      }
    },
    computed: {
      positiveResult () {
        return (this.decisionDetail.yes) || []
      },
      negativeResult () {
        return (this.decisionDetail.no) || []
      },
      comments () {
        return [
          {
            avatar: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3797481993,1929347741&fm=27&gp=0.jpg',
            name: '小褥子',
            time: '2018-10-02 09:34:21',
            content: '嘿嘿嘿。让我们一起摇摆。'
          }
        ]
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
      }
    },
    methods: {
      switchPanel (e) {
        this.$store.commit('saveFormId', e)
        this.currentMode = this.currentMode === 'comment' ? 'score' : 'comment'
      }
    }
  }
</script>
<style lang="scss">
  @import '../css/decision_result.scss';
</style>