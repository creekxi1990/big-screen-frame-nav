// eslint-disable-next-line
const sysConfig = {
  systemTitle: 'PEIM', // 系统名称
  systemIcon: '/images/znv-logo.png', // 系统图标
  alarmShowNum: 5, // 大屏实时告警显示个数
  mapId: 100000, // 第一级地图的id,默认中国地图,省份与id对应关系可参考china-main-city-map.js
  mapName: 'china', // 第一级地图的name
  language: [
    {
      value: 'zh-CN',
      label: '中文'
    },
    {
      value: 'en',
      label: 'English'
    }
  ],
  user: {
    userName: 'admin',
    password: '888888'
  },
  map: {
    mapType: 'gaodeMap', // gaodeMap openlayerMap gaodePliceMap superMap arcGisMap
    key: 'ec85d3648154874552835438ac6a02b2',
    apiUrl: 'http://webapi.amap.com/maps?v=1.4.6&key=2dfcc9a2e5eab40d2dfd5b248ff824ff&&plugin=AMap.MapType,AMap.Scale,AMap.OverView,AMap.ToolBar,AMap.MouseTool',
    mapUrl: 'http://10.45.157.179:8008',
    mapCsysType: 4, // 地图坐标系 csysType 坐标系类型，1表示WGS84,4表示GCJ02,3表示BD09(百度坐标系）
    superMapUrl: 'https://iserver.supermap.io/iserver/services/map-china400/rest/maps/China_4326'
  }
}
