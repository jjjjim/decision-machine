<template>
  <p  class="current-index">
    {{ realCurrentIndex }}/ {{wholeCount}}
  </p>
</template>
<script>
  export default {
    props: ['currentIndex', 'wholeCount'],
    computed: {
      realCurrentIndex () {
        return this.currentIndex + 1
      }
    }
  }
</script>
<style lang="scss" scoped>
.current-index{
  text-align: center;
  font-size: 14px;
  color: #9b9b9b;
  margin-bottom: 10px;
}
</style>