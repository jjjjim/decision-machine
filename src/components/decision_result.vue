<template>
  <div class="decision-result" v-if="showResult">
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
  </div>
</template>
<script>
  export default {
    props: ['decisionDetail'],
    computed: {
      positiveResult () {
        return (this.decisionDetail.yes) || []
      },
      negativeResult () {
        return (this.decisionDetail.no) || []
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
    }
  }
</script>
<style lang="scss">
  @import '../css/decision_result.scss';
</style>