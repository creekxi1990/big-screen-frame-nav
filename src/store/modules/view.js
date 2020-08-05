import Cookies from 'js-cookie'
import { getLanguage } from '@/lang/lang'
const state = {
  language: getLanguage(),
  resizeValue: null, // 界面大小变化
  componentLibraryVisible: false // 组件库右侧栏是否显示
}

const mutations = {
  SET_LANGUAGE: (state, language) => {
    state.language = language
    Cookies.set('language', language)
  },
  SET_RESIZE: (state, status) => {
    state.resizeValue = status
  },
  SET_COMPONENT_LIBRARY_VISIBLE: (state, status) => {
    state.componentLibraryVisible = status
  }
}

const actions = {
  setLanguage({ commit }, language) {
    commit('SET_LANGUAGE', language)
  },
  setResize ({ commit }, val) {
    commit('SET_RESIZE', val)
  },
  setComponentLibraryVisible ({ commit }, val) {
    commit('SET_COMPONENT_LIBRARY_VISIBLE', val)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
