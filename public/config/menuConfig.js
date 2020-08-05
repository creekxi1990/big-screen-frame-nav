/*
* path： 路由；name： 路由名称；id：路由id；parent：父级id；level：菜单等级（1为第一层，后面延续）；title：菜单名称；icon：菜单图标名称
* */
export default [
  { path: '/refresh', name: 'refresh', id: '0', parent: '-1', level: '0', title: '刷新功能页' },
  { path: 'http://www.baidu.com', name: 'policeHome', id: '11', parent: '2', level: '1', title: '首页', icon: 'home', imgNormal: '', imgCapture: '' },
  { path: '/wallMapFight', name: 'wallMapFight', id: '12', parent: '2', level: '1', title: '一标六实', icon: 'ybliu', imgNormal: '', imgCapture: '' },
  { path: 'http://www.baidu.com', name: 'yblsRealPerson', id: '1201', parent: '12', level: '2', title: '实有人口', icon: '1', imgNormal: 'nav_icon_pop_n', imgCapture: 'nav_icon_pop_c' },
  { path: '/specialHouse', name: 'specialHouse', id: '1202', parent: '12', level: '2', title: '实有房屋', icon: '2', imgNormal: 'nav_icon_house_n', imgCapture: 'nav_icon_house_c' },
  { path: '/realUnit', name: 'realUnit', id: '1203', parent: '12', level: '2', title: '实有单位', icon: '3', imgNormal: 'nav_icon_unit_n', imgCapture: 'nav_icon_unit_c' },
  { path: '/realAlarm', name: 'realAlarm', id: '1205', parent: '12', level: '2', title: '实有警情', icon: '5', imgNormal: 'nav_icon_ps_n', imgCapture: 'nav_icon_ps_c' },
  { path: '/powerAndEquipment', name: 'powerAndEquipment', id: '1206', parent: '12', level: '2', title: '实有力量与装备', icon: '6', imgNormal: 'nav_icon_fe_n', imgCapture: 'nav_icon_fe_c' },
  { path: '/securityFacilities', name: 'securityFacilities', id: '1204', parent: '12', level: '2', title: '实有安防设施', icon: '4', imgNormal: 'nav_icon_security_n', imgCapture: 'nav_icon_security_c' },
  { path: '/person', name: 'person', id: '13', parent: '2', level: '1', title: '人口管理', icon: 'people', imgNormal: 'nav_icon_data_n', imgCapture: 'nav_icon_data_c' },
  { path: '/changKou', name: 'changKou', id: '1306', parent: '13', level: '2', title: '常口库管理', icon: 'people-alarm', imgNormal: 'nav_icon_pop_n', imgCapture: 'nav_icon_pop_c' },
  { path: '/imPersonManage', name: 'imPersonManage', id: '1303', parent: '13', level: '2', title: '重口库管理', icon: 'people-alarm', imgNormal: 'nav_icon_population_n', imgCapture: 'nav_icon_population_c' },
  { path: '/strangerSearch', name: 'strangerSearch', id: '1304', parent: '13', level: '2', title: '陌生人管理', icon: 'people-search' },
  { path: '/searchByMap', name: 'searchByMap', id: '1301', parent: '13', level: '2', title: '路人库检索', icon: 'people-search', imgNormal: 'nav_icon_retrieval_n', imgCapture: 'nav_icon_retrieval_c' },
  { path: '/multiPersonTrackSearch', name: 'multiPersonTrackSearch', id: '1307', parent: '13', level: '2', title: '多人轨迹检索', icon: 'people-search', imgNormal: 'nav_icon_retrieval_n', imgCapture: 'nav_icon_retrieval_c' },
  { path: '/faceAlarm', name: 'faceAlarm', id: '1302', parent: '13', level: '2', title: '人口告警', icon: 'people-alarm', imgNormal: 'nav_icon_alarm_n', imgCapture: 'nav_icon_alarm_c' },
  { path: '/exitManagement', name: 'exitManagement', id: '1308', parent: '13', level: '2', title: '迁出管理', icon: 'people-alarm', imgNormal: 'nav_icon_alarm_n', imgCapture: 'nav_icon_alarm_c' },
  { path: '/personalFilesHomePage', name: 'personalFilesHomePage', id: '1305', parent: '13', level: '2', title: '一人一档', icon: 'people', imgNormal: 'nav_icon_archives_n', imgCapture: 'nav_icon_archives_c' },
  { path: '/vehicle', name: 'vehicle', id: '14', parent: '2', level: '1', title: '车辆管理', icon: 'car', imgNormal: '', imgCapture: '' },
  { path: '/vehicleSearch', name: 'vehicleSearch', id: '1401', parent: '14', level: '2', title: '车辆检索', icon: 'car-search', imgNormal: 'nav_icon_cars_n', imgCapture: 'nav_icon_cars_c' },
  { path: '/alarmList', name: 'alarmList', id: '1402', parent: '14', level: '2', title: '车辆告警', icon: 'car-alarm', imgNormal: 'nav_icon_caralarm_n', imgCapture: 'nav_icon_caralarm_c' },
  { path: '/vehicleFilesHomePage', name: 'vehicleFilesHomePage', id: '1403', parent: '14', level: '2', title: '一车一档', icon: 'car', imgNormal: 'nav_icon_carp_n', imgCapture: 'nav_icon_carp_c' },
  { path: '/alarmManage', name: 'alarmManage', id: '16', parent: '2', level: '1', title: '告警管理', icon: 'warning', imgNormal: '', imgCapture: '' },
  { path: '/alarmReportForm', name: 'alarmReportForm', id: '1601', parent: '16', level: '2', title: '告警检索', icon: 'warning', imgNormal: '', imgCapture: '' },
  { path: '/modelAnalysis', name: 'modelAnalysis', id: '17', parent: '2', level: '1', title: '模型管理', icon: 'model', imgNormal: 'nav_icon_mux_n', imgCapture: 'nav_icon_mux_c' },
  { path: '/modelWarehouse', name: 'modelWarehouse', id: '1701', parent: '17', level: '2', title: '模型仓库', icon: 'model', imgNormal: 'nav_icon_mux_n', imgCapture: 'nav_icon_mux_c' },
  { path: '/alarmHandling', name: 'alarmHandling', id: '1702', parent: '17', level: '2', title: '模型处置', icon: 'model', imgNormal: '', imgCapture: '' },
  { path: '/removeDoubtManagement', name: 'removeDoubtManagement', id: '1703', parent: '17', level: '2', title: '排疑管理', icon: 'model', imgNormal: 'nav_icon_mux_n', imgCapture: 'nav_icon_mux_c' }
]
