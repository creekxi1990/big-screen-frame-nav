import Vue from 'vue'
import Cookies from 'js-cookie'
/**
 * 获取uuid
 */
export function getUUID () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    return (c === 'x' ? (Math.random() * 16 | 0) : ('r&0x3' | '0x8')).toString(16)
  })
}

/**
 * 是否有权限
 * @param {*} key
 */
export function isAuth (key) {
  return JSON.parse(sessionStorage.getItem('permissions-c') || '[]').indexOf(key) !== -1 || false
}

/**
 * 是否管理员
 */
export function isAdmin () {
  return this.$cookie.get('isAdmin') === 'true'
}
/**
 * 获得机构名称
 */
export function getOfficeName () {
  return this.$cookie.get('officeName')
}

/**
 * 获取Token
 */
export function getToken () {
  return Vue.cookie.getToken
}

/**
 * 获取userId
 */
export function getUserId () {
  return Vue.cookie.get('userId')
}

/**
 * 获取userName
 */
export function getUserName () {
  return Vue.cookie.get('userName')
}

/**
 * 获取officeId
 */
export function getOfficeId () {
  return this.$cookie.get('officeId')
}

/**
 * 清除登录信息
 */
export function clearLoginInfo () {
  Cookies.remove('token-c')
  Cookies.remove('userId-c')
  Cookies.remove('userName-c')
  Cookies.remove('officeName-c')
  Cookies.remove('officeId-c')
  sessionStorage.clear()
}
