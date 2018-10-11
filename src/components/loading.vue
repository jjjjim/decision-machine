<template>
  <div class="wrapper">
    <img src="http://ojrbqzf6q.qnssl.com/FhxTUbBkYBMrdnCIXxmXLoZySDCv.svgz" alt="loading">  
  </div>
</template>
<script>
  export default {
    props: ['text']
  }
</script>
<style lang="scss" scoped>
  @keyframes loading {
    0% {
      transform: rotate(0);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  .loadingicon{
    width: 23px;
    height: 23px;
    animation: loading 1.2s linear infinite;
  }
  .wrapper{
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    padding: 10px;
    width: 50px;
    height: 50px;
    text-align: center;
    border-radius: 5px;
    background-color: darken(#433f3f, 4%);
    img{
      @extend .loadingicon;
    }
  }
</style>