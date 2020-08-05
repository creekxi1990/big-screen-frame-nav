<template>
    <div class="map-view" id="map-container"></div>
</template>

<script>
  import ZnvMap from '../utils/znvMap'
  export default {
    name: 'MapView',
    data() {
      return {}
    },
    mounted () {
      this.$nextTick(() => {
        this.initMap()
      })
    },
    methods: {
      initMap () {
        // 初始化地图
        ZnvMap.start('map-container', {
          resizeEnable: true,
          zoom: 8
          // mapStyle: 'amap://styles/blue'
        })
      }
    }
  }
</script>

<style scoped lang="scss">
.map-view{
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
