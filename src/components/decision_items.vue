<template>
  <scroll-view scroll-y class="decion-items" @scroll="delayScreenSaver">
    <ul>
      <li v-for="(item, index) in items" :key="index">
        <item :detail="item">
        </item>
      </li>
    </ul>
  </scroll-view>
</template>
<script>
  import item from '@/components/decision_item'
  export default {
    props: ['items'],
    components: {
      item
    },
    methods: {
      delayScreenSaver () {
        this.$store.commit('setScreenSaverClock')
      }
    }
  }
</script>
<style lang="scss" scoped>
  .decion-items{
    height: 100%;
    ul{
      li{
        &:not(:last-child){
          margin-bottom: 10px;
        }
      }
    }
  }
</style>