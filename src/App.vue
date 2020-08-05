<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      screenWidth: '',
      screenHeight: ''
    }
  },
  mounted () {
    this.resize()
    window.onresize = function () {
      this.resize()
    }.bind(this)
    document.title = sysConfig.systemTitle
  },
  methods: {
    resize () {
      // 系统整体缩放
      let cliWidth = document.documentElement.clientWidth || document.body.clientWidth
      let cliHeight = document.documentElement.clientHeight || document.body.clientHeight
      let contW = 1920
      let contH = 1080
      let w = cliWidth / contW
      let h = cliHeight / contH
      this.$store.dispatch('view/setResize', [w, h])
      let appDom = document.querySelector('#app')
      appDom.style.transform = 'scale(' + w + ',' + h + ')'
      appDom.style.transformOrigin = 'top left'
      appDom.style.width = contW + 'px'
      appDom.style.height = contH + 'px'
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: "Microsoft YaHei", 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #fff;
  /*background: url('./assets/main/bg.png') no-repeat center/cover;*/
}
</style>
