import request from '@/utils/httpRequest'
function getMapJson (mapId) {
  return request({
    url: '/mapJson/map/' + mapId + '.json'
  })
}
export default {
  getMapJson
}
