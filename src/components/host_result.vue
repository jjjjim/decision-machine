<template>
  <div class="host-result">
    <result :decisionDetail="decisionDetail">
      <div slot="currentindex">
        <currentindex :currentIndex="currentIndex" :wholeCount="wholeCount">
        </currentindex>
      </div>
    </result>
  </div>
</template>
<script>
  import result from '@/components/result'
  import currentindex from '@/components/current_index'
  export default {
    props: ['decisionDetail', 'currentIndex', 'wholeCount'],
    components: {
      result,
      currentindex
    },
    computed: {
      index () {
        return this.currentIndex + 1
      }
    }
  }
</script>
<style lang="scss" scoped>
  .host-result{
    height: 100%;
  }
</style>
