<template>
  <block>
    {{ commentTime }}
  </block>
</template>
<script>
  export default {
    props: ['time'],
    computed: {
      commentTime () {
        return this.time.replace('T', ' ')
      }
    }
  }
</script>