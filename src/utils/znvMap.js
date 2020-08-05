import coordtransform from './coordtransform'
import ZMapAPI from 'znvmap'

let ZnvMap = { closeFilter: true }
let ZMap // 地图服务
let map // 地图对象
let markerCluster // 聚合类markerCluster
let layerMarks = {} // 点位信息
let polygonMap = {}
let resourcePowerMarker = []
let Geocoder
let polygons
let mouseTool
let runInterval = null
let runMarker = null
ZnvMap.start = async function (mapId, opts) {
  markerCluster = null
  layerMarks = {}
  // eslint-disable-next-line
  const ZMapResponse = await new ZMapAPI({
    mapName: sysConfig.map.mapType,
    apiUrl: sysConfig.map.apiUrl,
    mapServeUrl: sysConfig.map.mapServeUrl
  })
  ZMap = ZMapResponse
  ZnvMap.ZMap = ZMapResponse
  ZnvMap.loadMap(opts, mapId)
}
ZnvMap.destroy = function () {
  ZnvMap.isMapComplete = 0
  ZnvMap.map._destroy()
}
// 加载地图
ZnvMap.loadMap = function (opts, mapId) {
  let defOpts = {
  }
  defOpts = Object.assign({}, defOpts, opts)
  map = new ZMap.Map(mapId, defOpts)
  ZnvMap.map = map
  ZnvMap.onclick(() => {
    if (ZnvMap.infoWindow) {
      ZnvMap.infoWindow._close()
    }
  })
  map._on(ZMap.Constants.ZOOM_END, function (data) {
    if (data.zoom >= 18 || data.zoom <= 10) {
      for (let key in polygonMap) {
        polygonMap[key].hide()
      }
    } else {
      for (let key in polygonMap) {
        polygonMap[key].show()
      }
    }
  })
}
/*
* 加载点位
* datas数据中需要标准化的字段中id、icon、name、type、gpsx、gpsy
* */
ZnvMap.loadDeviceLayer = function (points, opts, callback) {
  let markers = []
  let removeMarkers = []
  if (points && points.length > 0) {
    points.forEach((point) => {
      if (layerMarks[point.id]) {
        layerMarks[point.id]._remove()
        removeMarkers.push(layerMarks[point.id])
        layerMarks[point.id] = null
      }
      if (!point.gpsx || !point.gpsy) {
        return false
      } else {
        // layerMarks 为图层管理对象
        let marker = ZnvMap.addDeviceMarker(point, opts, callback)
        layerMarks[point.id] = marker
        markers.push(marker)
      }
    })
    if (removeMarkers.length > 0) markerCluster._removeMarkers(removeMarkers)
    removeMarkers = null
  }
  ZnvMap.markerCluster(markers, {
    minimumClusterSize: 5,
    averageCenter: false
  })
  markers = null
}
ZnvMap.addDeviceMarker = function (device, optParam, callback) {
  let lnglat = ZnvMap.zbTransform(device)
  device.lnglat = lnglat
  let opts = {
    icon: device.icon,
    // title: device.name,
    size: { width: 36, height: 36 },
    position: { lng: lnglat[0], lat: lnglat[1] },
    extData: device,
    isFresh: false, // 是否刷新地图
    offset: { x: 0, y: 0 },
    content: device.content
  }
  if (optParam) {
    opts = Object.assign(opts, optParam)
  }
  let marker = new ZMap.Marker(map, opts)
  if (opts.label) {
    marker._setLabel(opts.label)
  }
  marker._addEventListener('click', callback)
  lnglat = null
  return marker
}
ZnvMap.addDevice = function (points, opts, callback) {
  let marker = ZnvMap.addDeviceMarker(points[0], opts, callback)
  layerMarks[points[0].id] = marker
  if (markerCluster) markerCluster._addMarker(marker)
}
ZnvMap.addCircle = function (device, optParam) {
  let lnglat = ZnvMap.zbTransform(device)
  let opts = {
    center: lnglat,
    radius: device.radius, // 半径
    borderWeight: 4,
    strokeColor: '#98b8ff',
    strokeOpacity: 1,
    strokeWeight: 4,
    fillOpacity: 0.6,
    strokeStyle: 'dashed',
    strokeDasharray: [22, 2],
    // 线样式还支持 'dashed'
    fillColor: 'rgba(68,119,136,0.1)',
    zIndex: 50
  }
  if (optParam) {
    opts = Object.assign(opts, optParam)
  }
  let circle = new ZMap.Circle(map, opts)
  circle._add()
  return circle
}
ZnvMap.editCircle = function (circle) {
  let circleEditor = new ZMap.CircleEditor(map, circle)
  circleEditor._open()
  circleEditor._addEventListener('adjust', function (event) {
    ZnvMap.circleContainsMarkers(circle)
  })
  circleEditor._addEventListener('move', function (event) {
    ZnvMap.circleContainsMarkers(circle)
  })
  return circleEditor
}
ZnvMap.circleContainsMarkers = function (circle) {
  let showMarkers = []
  let hideMarkers = []
  resourcePowerMarker.forEach((marker) => {
    let lnglat = marker._getPosition()
    if (circle._contains(lnglat)) {
      showMarkers.push(marker)
      marker._show()
    } else {
      hideMarkers.push(marker)
      marker._hide()
    }
  })
  if (markerCluster) {
    markerCluster._addMarkers(showMarkers)
    markerCluster._removeMarkers(hideMarkers)
  }
}

ZnvMap.loadCircleLayer = function (points, opts) {
  let markers = []
  if (points && points.length > 0) {
    points.forEach((point) => {
      if (!point.gpsx || !point.gpsy) {
        return true
      }
      // layerMarks 为图层管理对象
      let marker = ZnvMap.addCircleMarker(point, opts)
      marker._add()
      markers.push(marker)
      layerMarks[point.id] = marker
    })
  }
}
ZnvMap.addCircleMarker = function (point, optParam) {
  let opts = {
    center: ZnvMap.zbTransform(point),
    extData: point
  }
  if (optParam) {
    opts = Object.assign(opts, optParam)
  }
  return new ZMap.CircleMarker(map, opts)
}
ZnvMap.markerCluster = function (markers, opts) {
  if (markerCluster) {
    markerCluster._complete(function () {
      markerCluster._addMarkers(markers)
    })
  } else {
    markerCluster = new ZMap.MapLib.MarkerClusterer(map, markers, opts)
  }
}
// 测距
ZnvMap.measureDistance = function () {
  if (ZnvMap.mouseTool) {
    ZnvMap.mouseTool = null
  }
  ZnvMap.mouseTool = new ZMap.MapLib.MouseTool(map)
  ZnvMap.mouseTool._measureDistance()
}
// 测面
ZnvMap.measureArea = function () {
  if (!ZnvMap.mouseTool) {
    ZnvMap.mouseTool = null
  }
  ZnvMap.mouseTool = new ZMap.MapLib.MouseTool(map)
  ZnvMap.mouseTool._measureArea()
}

// 行政区查询
ZnvMap.getDistrict = function (districtName, opts) {
  let district = new ZMap.MapLib.DistrictSearch(map, opts)
  district._search(districtName, function (status, result) {
    if (polygons) map._removeOverlays(polygons)
    polygons = []
    let bounds = result.districtList[0].boundaries
    if (bounds) {
      for (let i = 0, l = bounds.length; i < l; i++) {
        let polygon = new ZMap.Polygon(map, {
          strokeWeight: 1,
          path: bounds[i],
          fillOpacity: 0.4,
          fillColor: '#80d8ff',
          strokeColor: '#0091ea'
        })
        polygons.push(polygon.protoSelf)
      }
    }
    map._addOverlay(polygons)
    map._setFitView(polygons)
  })
}
ZnvMap.removeDevice = function (id) {
  const device = layerMarks[id]
  if (markerCluster) markerCluster._removeMarker(device)
}
ZnvMap.removeDevices = function (ids) {
  let devices = []
  ids.forEach(id => {
    const device = layerMarks[id]
    devices.push(device)
  })
  if (markerCluster) markerCluster._removeMarkers(devices)
}
ZnvMap.showAllLayer = function () {
  let showMarkers = []
  for (let key in layerMarks) {
    let marker = layerMarks[key]
    showMarkers.push(marker)
    marker._show()
  }
  if (markerCluster) markerCluster._addMarkers(showMarkers)
  showMarkers = null
}
// 隐藏所有点位图标
ZnvMap.hideAllLayer = function () {
  for (let key in layerMarks) {
    let marker = layerMarks[key]
    marker._hide()
  }
  if (markerCluster) markerCluster._clearMarkers()
}
// 根据id显示图层
ZnvMap.showLayerById = function (id) {
  let layer = layerMarks[id]
  if (layer) {
    layer._show()
  }
  if (markerCluster) markerCluster._addMarker(layer)
  return layer
}
// 显示点位图标
ZnvMap.showLayer = function (keyName, value) {
  let showMarkers = []
  for (let key in layerMarks) {
    let marker = layerMarks[key]
    let extData = marker.extData
    if (extData[keyName] === value) {
      marker._show()
      showMarkers.push(marker)
    }
  }
  if (markerCluster) markerCluster._addMarkers(showMarkers)
}

// 隐藏点位图标
ZnvMap.hideLayer = function (keyName, value) {
  let hideMarkers = []
  for (let key in layerMarks) {
    let marker = layerMarks[key]
    let extData = marker.extData
    if (extData[keyName] === value) {
      marker._hide()
      hideMarkers.push(marker)
    }
  }
  if (markerCluster) markerCluster._removeMarkers(hideMarkers)
}
// 隐藏其他点位图标
ZnvMap.hideSiblingsLayer = function (keyName, value) {
  let hideMarkers = []
  for (let key in layerMarks) {
    let marker = layerMarks[key]
    let extData = marker.extData
    if (extData[keyName] !== value) {
      marker._hide()
      hideMarkers.push(marker)
    }
  }
  if (markerCluster) markerCluster._removeMarkers(hideMarkers)
}
// 显示某类图标，其他的隐藏
ZnvMap.onlyShowMarker = function (keyName) {
  let showMarkers = []
  for (let key in layerMarks) {
    let marker = layerMarks[key]
    let extData = marker.extData
    if (keyName === extData.type) {
      marker._show()
      marker.znvVisble = true
      showMarkers.push(marker)
    }
    marker = null
  }
  if (markerCluster) {
    markerCluster._addMarkers(showMarkers)
  }
  showMarkers = null
}
// 根据id找点位
ZnvMap.getPointById = function (id) {
  return layerMarks[id]
}
// 设置有效范围为中间一部分（不被磁贴覆盖的部分）
ZnvMap.containsLngLat = function (bounds, position) {
  let nlat = bounds.getNorthEast().getLat()
  let slat = bounds.getSouthWest().getLat()
  let wlng1 = bounds.getSouthWest().getLng()
  let elng1 = bounds.getNorthEast().getLng()
  // let nlat = nlat1 - (nlat1 - slat1) * 3 / 8;
  let elng = elng1 - (elng1 - wlng1) * 5 / 16
  // let slat = nlat1 - (nlat1 - slat1) * 5 / 8;
  let wlng = elng1 - (elng1 - wlng1) * 11 / 16
  return elng > position.lng && wlng < position.lng && nlat > position.lat && slat < position.lat
}
// 初始化地理编码与逆地理编码
ZnvMap.initGeocoder = function (opts) {
  Geocoder = new ZMap.MapLib.Geocoder(map, opts)
  return Geocoder
}
ZnvMap.zbTransform = function (param) { // 坐标转换
  let point
  param.lng = param.gpsX || param.gpsx || param.lng
  param.lat = param.gpsY || param.gpsy || param.lat
  // eslint-disable-next-line
  let csysType = sysConfig.map.mapCsysType
  if (param.gpsType === -1 || (csysType === 4 && (param.csysType === 4 || param.gpsType === 4)) || (csysType === 1 && (param.csysType === 1 || param.gpsType === 1))) { // 是高德坐标
    point = [parseFloat(param.lng), parseFloat(param.lat)]
  } else {
    if (csysType === 4) {
      point = coordtransform.wgs84togcj02(parseFloat(param.lng), parseFloat(param.lat))
    } else {
      point = coordtransform.gcj02towgs84(parseFloat(param.lng), parseFloat(param.lat))
    }
  }
  return point
}
ZnvMap.onclick = function (f) {
  ZnvMap.map._addEventListener('click', function (e) {
    f(e)
  })
}
ZnvMap.onmouseup = function (f) {
  ZnvMap.map._addEventListener('mouseup', function (e) {
    f(e)
  })
}
ZnvMap.clearAll = function () { // 数据清空
  if (ZnvMap.infoWindow) {
    ZnvMap.infoWindow._close()
  }
}
ZnvMap.mapComplete = function (callback) {
  let znvMap = this
  if (znvMap.isMapComplete === 1) {
    callback.call(znvMap)
    return
  }
  let intervalId = setInterval(function () {
    if (znvMap.isMapComplete === 1) {
      clearInterval(intervalId)
      callback.call(znvMap)
    }
  }, 200)
}
ZnvMap.mapZoomComplete = function (callback) {
  let znvMap = this

  let intervalId = setInterval(function () {
    if ((znvMap.isMapZoomComplete === 1)) {
      clearInterval(intervalId)
      callback.call(znvMap)
    }
  }, 200)
}
/* 定位到经纬
* params
* lng 经度
* lat 维度
* zomm 层级
* csysType 坐标系类型，1表示WGS84,2表示GCJ02,3表示BD09(百度坐标系）
*/
ZnvMap.gotoMapPoint = function (params) {
  let defParams = {
    lng: 121.5092888,
    lat: 31.1959285,
    zoom: 15,
    csysType: 1
  }
  defParams = Object.assign({}, defParams, params)
  let point
  point = ZnvMap.zbTransform(defParams)
  if (point[0] === 0 || point[1] === 0) {
    return
  }
  this.mapComplete(function () {
    map._centerAndZoom(point, defParams.zoom)
    // this.addTestIcon(point[0],point[1]);
  })
}
ZnvMap.gotoMarker = function (params) {
  params.zoom = 15
  ZnvMap.gotoMapPoint(params)
}
// 刻画区域轮廓
ZnvMap.regionalContour = function (id, pathStr, opts) {
  let path = pathStr.split(';')
  let lnglatArr = []

  for (let i = 0; i < path.length; i++) {
    let item = path[i]
    let lnglat = item.split(',')
    if (lnglat.length !== 2) {
      continue
    }
    let lnglan = ZnvMap.zbTransform({
      lng: lnglat[0],
      lat: lnglat[1]
    })
    lnglatArr.push(lnglan)
  }

  opts.path = lnglatArr
  let polygon = new ZMap.Polygon(map, opts)
  map._addOverlay(polygon, false)
  polygonMap[id] = polygon
  return polygon
}
// 跟据id删除区域轮廓
ZnvMap.removeContourById = function (id) {
  let contour = polygonMap[id]
  if (contour && contour.remove) {
    delete polygonMap[id]
    contour.remove()
  }
}
// 画线
ZnvMap.drawLine = function (lineArr, opts) {
  let path = []
  lineArr.forEach((v) => {
    path.push(ZnvMap.zbTransform(v))
  })
  let polyline = new ZMap.Polyline(map, path, opts)
  return polyline
}
// 圈选、框选、点选、线选、多边形选
ZnvMap.draw = function (type, callback) {
  ZnvMap.clearDrawOverlays()
  mouseTool = ZnvMap.mouseTool = new ZMap.MapLib.MouseTool(map)
  if (type === 1) {
    mouseTool._drawCircle(function (v) {
      callback && callback(v)
    })
  } else if (type === 2) {
    mouseTool._drawRectangle(function (v) {
      callback && callback(v)
    })
  } else if (type === 3) {
    mouseTool._drawLine(function (v) {
      callback && callback(v)
    })
  } else if (type === 4) {
    mouseTool._drawPoint(function (v) {
      callback && callback(v)
    })
  } else if (type === 5) {
    mouseTool._drawPolygon(function (v) {
      callback && callback(v)
    })
  }
}
ZnvMap.clearDrawOverlays = function () {
  if (mouseTool) {
    mouseTool._clearDrawOverlays()
  }
}

// 轨迹绘制
ZnvMap.drawTrack = function (data) {
  let lineArr = []
  for (let i = 0; i < data.length; i++) {
    let lnglat = ZnvMap.zbTransform(data[i])
    lineArr.push({ lng: lnglat[0], lat: lnglat[1] })
  }
  let opts = {
    strokeColor: '#FFA200', // 线颜色
    strokeOpacity: 1, // 线透明度
    strokeWeight: 3, // 线宽
    // strokeStyle: 'solid', // 线样式
    isFresh: false
  }
  // ZnvMap.Polyline(map, lineArr, opts)
  let lineArrR = ZnvMap.optimizeLineArr(lineArr)
  // let polyline = new ZMap.Polyline(map, lineArr, opts)

  return new ZMap.TrackPolyline(map, lineArrR, opts)
}
// 去掉重复的轨迹线
ZnvMap.optimizeLineArr = function (lineArr) {
  let optArr = []
  let reArr = []
  if (lineArr.length > 0) {
    reArr.push(lineArr[0])
  }
  for (let i = 1; i < lineArr.length; i++) {
    let lineStr = JSON.stringify(lineArr[i - 1]) + JSON.stringify(lineArr[i])
    let index = $.inArray(lineStr, optArr)
    if (index < 0) {
      optArr.push(lineStr)
      reArr.push(lineArr[i])
    }
  }
  return reArr
}
// 轨迹回放
ZnvMap.trackReplay = function (data) {
  let lineArr = []
  for (let i = 0; i < data.length; i++) {
    let lnglat = ZnvMap.zbTransform(data[i])
    lineArr.push({ lng: lnglat[0], lat: lnglat[1] })
  }
  // let track = new ZMap.TrackReplay(map, lineArr, opts)
  let track = ZnvMap.drawTrack(data)
  // let track2 = ZnvMap.dynamicDisplayTrack(lineArr, data)
  return track
}
// 轨迹清除
ZnvMap.clearTrack = function (track) {
  track._remove()
  ZnvMap.exitRun()
}
ZnvMap.LayerSwitcher = function (data) {
  let track = new ZMap.Controls.LayerSwitcher(map)
  track._remove()
}
ZnvMap.InfoWindow = function (data) {
  let opt = {
    xAxis: 0,
    yAxis: 0,
    width: 200,
    height: 200,
    color: 'red',
    fontSize: '20px'
  }
  const infowindow = new ZMap.InfoWindow('qweqwe', opt)
  console.log(infowindow)
}
// 退出轨迹回放动态效果
ZnvMap.exitRun = function () {
  if (runInterval) {
    window.clearInterval(runInterval)
  }
  if (runMarker) {
    runMarker._setMap(null)
  }
}

// 修改地图样式
ZnvMap.setMapStyle = function (styleName) {
  if (map) map._setMapStyle(styleName)
}
window.ZnvMap = ZnvMap

export default ZnvMap
