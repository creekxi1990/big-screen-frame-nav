import axios from 'axios'
import router from '@/router'
import { Message, Loading } from 'element-ui'
import Cookies from 'js-cookie'
import { clearLoginInfo } from '@/utils'
import i18n from '@/lang/lang'

const service = axios.create({
  timeout: 1000 * 60 * 60,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  }
})
// const errorCode = [400, 404, 500, 600, 601, 700, 701, 800, 801]
/**
 * 请求拦截
 */
service.interceptors.request.use(config => {
  let qurl = config.url
  if (qurl.indexOf('?') === -1) {
    qurl += '?'
  } else {
    qurl += '&'
  }
  qurl += ('r=' + (new Date().getTime()))
  config.url = encodeURI(qurl)
  // config.headers['Authorization'] = '9cb18280e625fe8a319fd3a035a6c41d'
  config.headers.Authorization = Cookies.get('token')
  return config
}, error => {
  return Promise.reject(error)
})

/**
 * 响应拦截
 */
service.interceptors.response.use(response => {
  if (response.data && response.data.code === 401) { // 401, token失效
    if (!sessionStorage.getItem('tokenSession')) {
      clearLoginInfo()
      sessionStorage.setItem('tokenSession', 'tokenSession')
      Message({
        showClose: true,
        message: 'token失效',
        type: 'error',
        duration: 5 * 1000
      })
      router.push({ name: 'login' })
    }
    // 为了取消掉页面中可能因为token失效而存在的loading
    let loading = Loading.service({ fullscreen: true })
    loading.close()
    return Promise.reject(new Error(i18n.t(`${response.data.msg}`) || 'Error'))
  } else if (response.data.code === 500) {
    Message({
      message: '500接口内部错误',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(new Error(i18n.t(`${response.data.msg}`) || 'Error'))
  } else {
    sessionStorage.removeItem('tokenSession')
  }
  return response
}, error => {
  Message({
    showClose: true,
    message: error,
    type: 'error'
  })
  return Promise.reject(error)
})

export default service
