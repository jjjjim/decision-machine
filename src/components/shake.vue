<template>
  <div class="shake-get-random-decision">
    <section class="inner">
      <img src="http://ojrbqzf6q.qnssl.com/FrGl339h1KbpW5C_jmRf8KchArFX.svgz" alt="shake">
      <section class="text">
        <p class="title">
          摇一摇
        </p>
        <p class="hint">
          看看别人在纠结什么决定
        </p>
      </section>
    </section>
  </div>
</template>
<style lang="scss" scoped>
  .shake-get-random-decision{
    margin-top: 10px;
    padding: 10px;
    border-radius: 4px;
    background-color: darken(#423f3f, 2%);
    .inner{
      display: flex;
      align-items: center;
      img{
        width: 30px;
        height: 30px;
      }
      .text{
        margin-left: 10px;
        text-align: left;
        .title{
          font-size: 18px;
        }
        .hint{
          font-size: 15px;
          opacity: .7;
        }
      }
    }
  }
</style>
