import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    showLoginPop: false,  // 展示登录弹出层
    isLogin: false,  // 登录状态，默认没有登录
    token: '',
    userInfo: '',
    messageData: [],  // 
  },
  mutations: {
    showLoginPop(state, boolen) {
      state.showLoginPop = boolen
    },
    changeLoginState(state, boolen) {
      state.isLogin = boolen
    },
    setToken(state, token) {
      state.token = token
    },
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo
    },
    setMessageData(state, messageData) {
      state.messageData = messageData;
    },
  },
  actions: {

  }
})