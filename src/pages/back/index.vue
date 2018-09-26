<template>
  <div class="back">
    <section class="machine-behind" :animation="machineBehindAnimation">
      <img src="http://ojrbqzf6q.qnssl.com/Fm6946SDWmFIpYUPnW_NnwKU0nnz.png" alt="name" class="name">
      <img src="http://ojrbqzf6q.qnssl.com/FneKo4sUHSgDSd8KwaxGFvolYjSt.svgz" alt="behind" class="device">
    </section>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        items: [
          {
            title: '出厂日期',
            value: '2018.09'
          },
          {
            title: '制造商',
            value: '北京市毛线球科技有限公司'
          },
          {
            title: '生产地址',
            value: '北京市朝阳区马克大厦X座3层'
          },
          {
            title: '典型功率',
            value: '3.9瓦'
          },
          {
            title: '产品型号',
            value: 'MK51'
          }
        ],
        hh: ''
      }
    }
  }
</script>
<style lang="scss" scoped>
.back{
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100vh;
  .machine-behind{
    text-align: center;
    position: relative;
    .device{
      width: 329px;
      height: 580px;
      position: relative;
      z-index: 2;
    }
    .name{
      position: absolute;
      width: 145px;
      height: 40px;
      left: 50%;
      top: 100px;
      transform: translateX(-50%);
      z-index: 100;
    }
  }
}
</style>