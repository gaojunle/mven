import Vue from 'vue';

export default {
  state: {
    userInfo: {}
  },
  getters: {
    getUserInfo(state) {
      return state.userInfo;
    }
  },
  mutations: {
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo;
    }
  },
  actions: {
    setUserInfo({commit}, user){
      if (window.sessionStorage && user) {
        window.sessionStorage.user = JSON.stringify(user);
      }
      commit('setUserInfo', user)
    },
    getUserInfo({commit, getters, state}){
      return new Promise((resolve, reject) => {
        if (state.userInfo.id) {
          resolve(state.userInfo);
        } else {
          var user = {};
          if (window.sessionStorage && window.sessionStorage.user) {
            user = JSON.parse(window.sessionStorage.user);
          }
          if (user.id) {
            resolve(user);
          } else {
            // Vue.http.get('/api/account/profile').then(response => {
            Vue.http.get('/api/account/profile').then(response => {
                if (response.data.errno == 0) {
                  var d = response.data.data;
                  let user = {
                    id: d.id,
                    img: d.sex == 1 ? './static/img/avatar-0.png' : './static/img/avatar-1.png',
                    name: d.name || '未知姓名',
                    company: d.group.id ? d.group.name : '还没加入任何组织~',
                    mobile: d.mobile,
                    zone: d.province ? (d.province + ' ' + d.city + ' ' + d.district) : '未设置辖区~',
                    province: d.province,
                    city: d.city,
                    district: d.district,
                    group: d.group,
                    type: d.type
                  };
                  commit('setUserInfo', user);
                  resolve(user);
                } else {
                  commit('setUserInfo', {});
                  reject({
                    status: response.data && response.data.errno,
                    statusText: response.data ? response.data.errmsg : response
                  });
                }
              }, response => {
                reject(response);
              }
            )
          }
        }
      });
    }
  }
}
