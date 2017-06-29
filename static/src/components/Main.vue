<template>
  <div class="main">
    <div class="img-box">
      <h1>{{title}}</h1>
      <img
        src="http://static.open-open.com/lib/uploadImg/20161012/20161012105523_94.png"
        alt="">
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Main',
    mounted() {

    },
    data () {
      return {
        title: 'Welcome to Your Vue.js App'
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  .img-box {
    h1{
      font-size: 20px;
      margin-bottom: 20px;
    }
    margin: 100px;
    text-align: center;
  }
</style>
