<template>
  <form @submit="checkDetail($event, detail.id)" report-submit>
    <button formType="submit" class="item">
      <header>
        <section class="info">
          <span class="status" :class='resultClass'></span>
          <span class="time">
            <!-- {{ time }} 2018-09-01 10:23:23 -->
            <!-- {{ state === 1 ? '进行中' : '已完成' }} -->
            {{ result.text }}
          </span>
        </section>
        <section class="participate-number">
          <span>
            {{ wholeNumber }} 人已参与
          </span>
        </section>
      </header>
      <section class="content">
        {{ detail.question }}
      </section>
    </button>
  </form>
</template>
<script>
  export default {
    props: ['detail'],
    computed: {
      time () {
        return this.detail && this.detail.add_time && this.detail.add_time.replace('T', ' ')
      },
      positiveResult () {
        const result = []
        const yesList = this.detail.yes
        result.length = Array.isArray(yesList) ? yesList.length : isNaN(yesList) ? 0 : yesList
        return result
      },
      negativeResult () {
        const result = []
        const noList = this.detail.no
        result.length = Array.isArray(noList) ? noList.length : isNaN(noList) ? 0 : noList
        return result
      },
      wholeNumber () {
        return this.positiveResult.length + this.negativeResult.length
      },
      state () {
        return this.detail.state
      },
      result () {
        return this.positiveResult.length > this.negativeResult.length ? {status: 1, text: '多数赞成'} : this.positiveResult.length === this.negativeResult.length ? {status: 0, text: '双方持平'} : {status: 2, text: '多数反对'}
      },
      resultClass () {
        switch (this.result.status) {
          case 0:
            return 'equal'
          case 1:
            return 'positive'
          case 2:
            return 'negative'
        }
      }
    },
    methods: {
      checkDetail (e, id) {
        this.$store.commit('saveFormId', e)
        wx.navigateTo({url: `/pages/decision/main?id=${id}`})
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '../css/global.scss';
  .item{
    width: 100%;
    line-height: 1.5;
    font-family: 'fuck';
    background-color: darken(#433f3f, 2%);
    padding: 12px;
    header{
      display: flex;
      justify-content: space-between;
      color: #9b9b9b;
      font-size: 10px;
      .info{
        .status{
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-right: 5px;
          &.positive{
            background-color: $primary;
          }
          &.negative{
            background-color: $negative;
          }
          &.equal{
            background-color: #9b9b9b;
          }
        }
      }
    }
    .content{
      text-align: left;
      font-size: 16px;
      margin-top: 5px;
    }
  }
</style>