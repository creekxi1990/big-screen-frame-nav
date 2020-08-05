<template>
    <div class="echarts-map-view">
      <div id="mapChart" class="chart"></div>
    </div>
</template>

<script>
import echarts from 'echarts'
import cityMap from '../../public/mapJson/map/china-main-city-map.js'
import geoCoordMap from '../../public/mapJson/cityLocation'
import infoApi from '../api/info'
export default {
  name: 'EchartsMapView',
  data () {
    return {
      myChart: null, // Echarts地图全局变量，主要是在返回上级地图的方法中会用到
      cityMap: cityMap,
      geoCoordMap: geoCoordMap,
      areaCode: '',
      cityCode: '',
      mapId: sysConfig.mapId,
      mapName: sysConfig.mapName,
      mapJson: null,
      mapStack: [],
      parentId: null, // 记录父级ID、Name
      parentName: null,
      pointList: []
    }
  },
  mounted () {
    // 初始化地图
    this.mapChart('mapChart')
    document.querySelector('#mapChart').oncontextmenu = function () { return false } // 阻止浏览器指定区域的右键默认事件
  },
  watch: {
  },
  methods: {
    /**
     * 返回上一级地图
     */
    async back () {
      if (this.mapStack.length !== 0) {
        // 如果有上级目录则执行
        let map = this.mapStack.pop()
        let response = await infoApi.getMapJson(map.mapId)
        const mapJson = response.data
        let proMapData = []
        this.registerAndsetOption(
          this.myChart,
          map.mapId,
          map.mapName,
          mapJson,
          false,
          proMapData
        )
        // 返回上一级后，父级的ID、Name随之改变
        this.parentId = map.mapId
        this.parentName = map.mapName
      }
    },
    async mapChart (chartId) {
      let response = await infoApi.getMapJson(this.mapId)
      this.mapJson = response.data
      let mapData = [] // 地图上数据
      this.myChart = echarts.init(document.getElementById(chartId))
      this.registerAndsetOption(this.myChart, this.mapId, this.mapName, this.mapJson, false, mapData)
      this.parentId = this.mapId
      this.parentName = this.mapName
      this.myChart.on('click', async (param) => {
        if (this.mapStack.length === 0) this.areaCode = param.data && param.data.areaCode
        let cityId = this.cityMap[param.name]
        if (cityId && cityId === this.cityCode) cityId = null
        this.cityCode = cityId
        if (cityId) {
          // 代表有下级地图
          infoApi.getMapJson(cityId)
            .then(response => {
              const mapJson = response.data
              let proMapData = []
              this.registerAndsetOption(
                this.myChart,
                cityId,
                param.name,
                mapJson,
                true,
                proMapData
              )
            })
        } else {
          // 没有下级地图，回到一级中国地图，并将mapStack清空
          let proMapData = []
          this.registerAndsetOption(this.myChart, this.mapId, this.mapName, this.mapJson, false, proMapData)
          this.mapStack = []
          this.parentId = this.mapId
          this.parentName = this.mapName
        }
      })
      this.myChart.on('contextmenu', (params) => {
        this.back()
      })
    },
    /**
     *
     * @param {*} myChart
     * @param {*} id        省市县Id
     * @param {*} name      省市县名称
     * @param {*} mapJson   地图Json数据
     * @param {*} flag      是否往mapStack里添加parentId，parentName
     */
    registerAndsetOption (myChart, id, name, mapJson, flag, mapData) {
      echarts.registerMap(name, mapJson)
      myChart.setOption({
        tooltip: {
          trigger: 'item',
          backgroundColor: 'transparent',
          formatter: function (value) {
            // return value.name
          }
        },
        visualMap: { // 颜色的设置  dataRange
          show: false,
          x: 'left',
          y: 'center',
          seriesIndex: [1],
          min: 0,
          max: 10,
          text: ['高', '低'], // 文本，默认为数值文本
          textStyle: {
            color: '#fff'
          },
          inRange: {
            color: ['#96BDFC', '#7AA7F0', '#5187DF', '#6495ED']
          }
        },
        geo: {
          map: name,
          left: '70',
          itemStyle: { // 地图区域的多边形 图形样式
            color: '#fff',
            normal: { // 是图形在默认状态下的样式
              label: {
                show: true, // 是否显示标签
                textStyle: {
                  color: '#ff0'
                }
              },

              borderWidth: 1,
              borderColor: '#3BBAFF',
              shadowColor: '#3C8BBD',
              shadowOffsetY: 5,
              shadowOffsetX: 5
            }
          }
        },
        series: [
          {
            type: 'effectScatter',
            left: '50',
            coordinateSystem: 'geo',
            data: this.pointList,
            symbolSize: 5,
            showEffectOn: 'render',
            rippleEffect: {
              scale: 8,
              brushType: 'fill'
            },
            hoverAnimation: true,
            label: {
              normal: {
                formatter: '{b}',
                position: 'bottom',
                color: '#fff',
                show: false
              }
            },
            itemStyle: {
              normal: {
                color: function (v) {
                  return v.data.status === 0 ? '#A0F3F8' : 'yellow'
                },
                shadowBlur: 0,
                shadowColor: 'yellow'
              }
            },
            zlevel: 1
          }, {
            type: 'map',
            mapType: name,
            left: '70',
            // zoom: 1.2,
            roam: false, // 是否开启鼠标缩放和平移漫游
            itemStyle: { // 地图区域的多边形 图形样式
              // color: ['rgb(11,85,142)', 'rgb(13,106,177)'],
              normal: { // 是图形在默认状态下的样式
                label: {
                  show: true, // 是否显示标签
                  textStyle: {
                    color: '#fff'
                  }
                },
                borderWidth: 1,
                borderColor: '#387ba7',
                areaColor: '#96BDFC'
              }
            },
            data: mapData
          }
        ]
      })

      if (flag) {
        // 往mapStack里添加parentId，parentName,返回上一级使用
        this.mapStack.push({
          mapId: this.parentId,
          mapName: this.parentName
        })
        this.parentId = id
        this.parentName = name
      }
    }
  }
}
</script>

<style scoped lang="scss">
.echarts-map-view{
  width: 100%;
  height: 100%;
  .chart {
    width: 100%;
    height: 100%;
  }
}
</style>
