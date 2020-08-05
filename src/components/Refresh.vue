<template>
  <div>
    Hello
  </div>
</template>

<script>
  /**
   * 功能组件
   * 用于刷新当前路由的页面
   */
  export default {
    name: "Refresh",
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.$router.replace({
          path: from.path,
          params: to.params,
          query: to.query
        })
      })
    }
  }
</script>

<style>

</style>
