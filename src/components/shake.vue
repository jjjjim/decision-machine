<template>
  <div class="shake-hint">
    <div>
      <section class="wrapper">
        <img src="http://ojrbqzf6q.qnssl.com/FoJiyZfqYSCWBx5rR8Ys-5Ydxv0x.svgz" alt="shake">
      </section>
      <p class="title">
        摇一摇
      </p>
      <p class="value">
        看看别人在纠结什么决定
      </p>
    </div>
  </div>
</template>
<script>
</script>
<style lang="scss" scoped>
.shake-hint{
  height: 100%;
  display: flex;
  align-items: center;
  & > div{
    width: 100%;
  }
  .wrapper{
    width: 100px;
    height: 100px;
    line-height: 100px;
    border-radius: 50%;
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
    img{
      width: 60px;
      height: 60px;
    }
  }
  .title{
    margin-top: 30px;
    font-size: 20px;
  }
  .value{
    font-size: 15px;
    opacity: 0.6;
  }
}
</style>
